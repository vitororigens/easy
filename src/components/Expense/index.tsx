import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import {
  Alert,
  Platform,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { useMonth } from "../../context/MonthProvider";
import { useUserAuth } from "../../hooks/useUserAuth";
import { currencyMask, currencyUnMask } from "../../utils/mask";
import { LoadingIndicator } from "../Loading/style";
import { sendPushNotification } from "../../services/one-signal";
import { Timestamp } from "@react-native-firebase/firestore";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { useRoute } from "@react-navigation/native";
import { createNotification } from "../../services/firebase/notifications.firebase";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import {
  Button,
  DividerTask,
  Input,
  InputDescription,
  Span,
  Title,
  TitleTask,
} from "./styles";
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  EventType,
} from "@notifee/react-native";
import { database } from "../../libs/firebase";

// Types
export type ExpenseProps = {
  selectedItemId?: string;
  showButtonRemove?: boolean;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showAdvanced?: boolean;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  valueTransaction: z.string().optional(),
  formattedDate: z.string().min(1, "Data é obrigatória"),
  description: z.string().optional(),
  selectedCategory: z.string().optional(),
  selectedDateNotification: z.string().optional(),
  selectedHourNotification: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

export type FormSchemaType = z.infer<typeof formSchema>;

// Constants
const EXPENSE_CATEGORIES = [
  { label: "Investimentos", value: "Investimentos" },
  { label: "Contas", value: "Contas" },
  { label: "Compras", value: "Compras" },
  { label: "Faculdade", value: "Faculdade" },
  { label: "Internet", value: "Internet" },
  { label: "Academia", value: "Academia" },
  { label: "Emprestimo", value: "Emprestimo" },
  { label: "Comida", value: "Comida" },
  { label: "Telefone", value: "Telefone" },
  { label: "Entretenimento", value: "Entretenimento" },
  { label: "Educação", value: "Educacao" },
  { label: "Beleza", value: "beleza" },
  { label: "Esporte", value: "esporte" },
  { label: "Social", value: "social" },
  { label: "Transporte", value: "transporte" },
  { label: "Roupas", value: "roupas" },
  { label: "Carro", value: "carro" },
  { label: "Bebida", value: "bebida" },
  { label: "Cigarro", value: "cigarro" },
  { label: "Eletrônicos", value: "eletronicos" },
  { label: "Viagem", value: "viagem" },
  { label: "Saúde", value: "saude" },
  { label: "Estimação", value: "estimacao" },
  { label: "Reparar", value: "reparar" },
  { label: "Moradia", value: "moradia" },
  { label: "Presente", value: "presente" },
  { label: "Doações", value: "doacoes" },
  { label: "Loteria", value: "loteria" },
  { label: "Lanches", value: "lanches" },
  { label: "Filhos", value: "filhos" },
  { label: "Outros", value: "outros" },
];

const NOTIFICATION_DATE_OPTIONS = [
  { label: "No dia", value: "no dia" },
  { label: "Um dia antes", value: "um dia antes" },
  { label: "Tres dia antes", value: "tres dia antes" },
  { label: "Cinco dia antes de vencer", value: "cinco dias antes de vencer" },
];

const NOTIFICATION_HOUR_OPTIONS = [
  { label: "07:00", value: "07:00" },
  { label: "08:00", value: "08:00" },
  { label: "09:00", value: "09:00" },
];

const REPEAT_MONTHS_LIMIT = 11;
const CURRENT_YEAR = new Date().getFullYear();

export function Expense({
  selectedItemId,
  showButtonRemove,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
}: ExpenseProps) {
  // Hooks
  const user = useUserAuth();
  const { selectedMonth } = useMonth();
  const route = useRoute();

  // States
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [income, setIncome] = useState(false);
  const [status, setStatus] = useState(false);
  const [alert, setAlert] = useState(false);
  const [removeRepeat, setRemoveRepeat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const uid = user?.user?.uid;

  // Form setup
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      formattedDate: date.toLocaleDateString("pt-BR"),
      name: "",
      selectedCategory: "outros",
      selectedDateNotification: "no dia",
      selectedHourNotification: "08:00",
      valueTransaction: "",
      sharedUsers: [],
    },
  });

  const { control, handleSubmit, reset, setValue, getValues } = form;

  // Utility functions
  const parseDateString = useCallback((dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return {
      day: Number(day),
      month: Number(month),
      year: Number(year),
      date: new Date(Number(year), Number(month) - 1, Number(day)),
    };
  }, []);

  const formatCurrencyValue = useCallback((value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // Notification validation
  const validateNotificationParams = useCallback(() => {
    const { selectedHourNotification, selectedDateNotification } = getValues();

    if (!selectedHourNotification || !selectedDateNotification) {
      return {
        isValid: false,
        errorMessage: "Horário ou data de notificação não definido.",
      };
    }

    const [hour, minute] = selectedHourNotification.split(":");
    if (isNaN(Number(hour)) || isNaN(Number(minute))) {
      return { isValid: false, errorMessage: "Hora ou minuto inválido." };
    }

    const notificationDate = new Date(date);
    notificationDate.setHours(Number(hour), Number(minute), 0, 0);

    switch (selectedDateNotification) {
      case "um dia antes":
        notificationDate.setDate(notificationDate.getDate() - 1);
        break;
      case "tres dias antes":
        notificationDate.setDate(notificationDate.getDate() - 3);
        break;
      case "cinco dias antes":
        notificationDate.setDate(notificationDate.getDate() - 5);
        break;
      default:
        return {
          isValid: false,
          errorMessage: "Data de notificação inválida.",
        };
    }

    if (notificationDate < new Date()) {
      return {
        isValid: false,
        errorMessage: "A data de notificação está no passado.",
      };
    }

    return { isValid: true, notificationDate };
  }, [getValues, date]);

  // Schedule notification
  const scheduleNotification = useCallback(async (notificationDate: Date) => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notificationDate.getTime(),
    };

    try {
      const channelId = await notifee.createChannel({
        id: "notificacao",
        name: "Expense Notification",
        vibration: true,
        importance: AndroidImportance.HIGH,
      });

      await notifee.createTriggerNotification(
        {
          title: "Boleto agendado!",
          body: "Olá, você tem boletos prestes a vencer",
          android: { channelId },
        },
        trigger
      );
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
    }
  }, []);

  // Date handling
  const handleDateChange = useCallback((event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formattedDateString = currentDate.toLocaleDateString("pt-BR");
    setValue("formattedDate", formattedDateString);
  }, [date, setValue]);

  const showDatePickerModal = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  // Notification handling
  const handleUserNotifications = useCallback(async (
    sharedUsers: FormSchemaType['sharedUsers'],
    usersInvitedByMe: any[],
    createdExpenseId: string
  ) => {
    if (!sharedUsers?.length || !uid || !user?.user?.displayName) return;

    const notificationPromises = sharedUsers.map(async (userSharing) => {
      const alreadySharing = usersInvitedByMe.some(
        (u) => u.target === userSharing.uid && u.status === "accepted"
      );

      const possibleSharingRequestExists = usersInvitedByMe.some(
        (u) => u.target === userSharing.uid
      );

      const message = alreadySharing
        ? `${user.user?.displayName} adicionou um novo histórico de compras`
        : `${user.user?.displayName} convidou você para compartilhar uma histórico de compras`;

      const notificationData = {
        sender: uid,
        receiver: userSharing.uid,
        status: alreadySharing ? "sharing_accepted" as const : "pending" as const,
        type: "sharing_invite" as const,
        source: {
          type: "expense" as const,
          id: createdExpenseId,
        },
        title: "Compartilhamento de compras",
        description: message,
        createdAt: Timestamp.now(),
      };

      const promises = [
        createNotification(notificationData),
        sendPushNotification({
          title: "Compartilhamento de despesa",
          message,
          uid: userSharing.uid,
        }),
      ];

      if (!alreadySharing && !possibleSharingRequestExists) {
        promises.push(
          createSharing({
            invitedBy: uid,
            status: ESharingStatus.PENDING,
            target: userSharing.uid,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          })
        );
      }

      return Promise.allSettled(promises);
    });

    await Promise.all(notificationPromises);
  }, [uid, user?.user?.displayName]);

  // Repeat expense creation
  const createRepeatedExpenses = useCallback(async (
    expenseData: any,
    monthNumber: number,
    year: number,
    day: number
  ) => {
    if (!repeat) return;

    const repeatPromises = [];
    
    for (let i = 1; i <= REPEAT_MONTHS_LIMIT; i++) {
      let nextMonth = monthNumber + i;
      let nextYear = year;

      if (nextMonth > 12) {
        nextMonth -= 12;
        nextYear++;
      }

      if (nextYear > CURRENT_YEAR) {
        break;
      }

      const nextDate = `${day}/${nextMonth}/${nextYear}`;
      const nextMonthExpenseData = {
        ...expenseData,
        date: nextDate,
        month: nextMonth,
      };

      repeatPromises.push(
        database.collection("Expense").add(nextMonthExpenseData)
          .catch((error) => {
            console.error("Erro ao adicionar a transação repetida:", error);
          })
      );
    }

    await Promise.allSettled(repeatPromises);
  }, [repeat]);

  // Main save function
  const handleSaveExpense = useCallback(async (formData: FormSchemaType) => {
    if (!uid) {
      Toast.show("Erro: Usuário não autenticado", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      const { day, month, year, date: selectedDate } = parseDateString(formData.formattedDate);
      const monthNumber = selectedDate.getMonth() + 1;

      const transactionValue = formData.valueTransaction
        ? currencyUnMask(formData.valueTransaction)
        : 0;

      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid,
      });

      const expenseData = {
        name: formData.name,
        category: formData.selectedCategory,
        date: formData.formattedDate,
        valueTransaction: transactionValue,
        description: formData.description,
        repeat,
        status,
        alert,
        type: "output",
        uid,
        month: monthNumber,
        income,
        shareWith: formData.sharedUsers.map((user) => user.uid),
        shareInfo: formData.sharedUsers.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          acceptedAt: usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === ESharingStatus.ACCEPTED
          )
            ? Timestamp.now()
            : null,
        })),
      };

      // Save the expense for the current month
      const saveExpenseData = await database
        .collection("Expense")
        .add(expenseData);
      
      Toast.show("Transação adicionada!", { type: "success" });

      // Handle notifications
      await handleUserNotifications(
        formData.sharedUsers,
        usersInvitedByMe,
        saveExpenseData.id
      );

      // Create repeated expenses
      await createRepeatedExpenses(expenseData, monthNumber, year, day);

      // Reset form and states
      setLoading(false);
      setRepeat(false);
      setAlert(false);
      setStatus(false);
      setIncome(false);
      reset();
      
      if (onCloseModal) {
        onCloseModal();
      }

    } catch (error) {
      setLoading(false);
      console.error("Erro ao adicionar a transação:", error);
      Toast.show("Erro ao adicionar a transação", { type: "danger" });
    }
  }, [uid, repeat, status, alert, income, reset, onCloseModal, parseDateString, handleUserNotifications, createRepeatedExpenses]);

  // Delete function
  const handleDeleteExpense = useCallback(() => {
    if (!selectedItemId) {
      Toast.show("Erro: Nenhum item selecionado para exclusão", { type: "error" });
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta despesa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await database.collection("Expense").doc(selectedItemId).delete();
              Toast.show("Despesa excluída com sucesso!", { type: "success" });
              if (onCloseModal) {
                onCloseModal();
              }
            } catch (error) {
              console.error("Erro ao excluir a despesa:", error);
              Toast.show("Erro ao excluir a despesa", { type: "error" });
            }
          },
        },
      ]
    );
  }, [selectedItemId, onCloseModal]);

  // Notification handler
  const handleNotification = useCallback(async () => {
    try {
      const validationResult = validateNotificationParams();
      if (validationResult.isValid && validationResult.notificationDate) {
        await scheduleNotification(validationResult.notificationDate);
        console.log("Notificação agendada com sucesso!");
      } else {
        console.error(validationResult.errorMessage);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  }, [validateNotificationParams, scheduleNotification]);

  // Edit function
  const handleEditExpense = useCallback(async (formData: FormSchemaType) => {
    if (!selectedItemId || !uid) {
      Toast.show("Erro: Dados inválidos para edição", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      const { month, year, date: selectedDate } = parseDateString(formData.formattedDate);
      const monthNumber = selectedDate.getMonth() + 1;

      const transactionValue = formData.valueTransaction
        ? currencyUnMask(formData.valueTransaction)
        : 0;

      const expenseData = {
        name: formData.name,
        category: formData.selectedCategory,
        date: formData.formattedDate,
        valueTransaction: transactionValue,
        description: formData.description,
        repeat: removeRepeat ? false : repeat,
        status,
        alert,
        type: "output",
        uid,
        month: monthNumber,
        income,
      };

      await database.collection("Expense").doc(selectedItemId).set(expenseData);
      Toast.show("Transação editada!", { type: "success" });

      // Handle repeat removal
      if (removeRepeat) {
        const expensesSnapshot = await database
          .collection("Expense")
          .where("uid", "==", uid)
          .where("name", "==", formData.name)
          .get();

        const batch = database.batch();
        expensesSnapshot.forEach((doc) => {
          const expenseMonth = doc.data().month;
          if (expenseMonth !== selectedMonth) {
            batch.delete(doc.ref);
          }
        });

        await batch.commit();
      }

      setLoading(false);
      setRepeat(false);
      setAlert(false);
      setStatus(false);
      setIncome(false);
      
      if (onCloseModal) {
        onCloseModal();
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao editar a transação:", error);
      Toast.show("Erro ao editar a transação", { type: "error" });
    }
  }, [selectedItemId, uid, removeRepeat, repeat, status, alert, income, selectedMonth, onCloseModal, parseDateString]);

  // Form validation
  const onInvalid = useCallback(() => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obrigatórios antes de salvar."
    );
  }, []);

  // UI handlers
  const handleShowAdvanced = useCallback(() => {
    setShowAdvanced((prevState) => !prevState);
  }, []);

  // Load existing expense data
  useEffect(() => {
    if (!selectedItemId) return;

    const loadExpenseData = async () => {
      try {
        const doc = await database.collection("Expense").doc(selectedItemId).get();
        
        if (doc.exists()) {
          const data = doc.data();
          if (data) {
            setValue("name", data.name);
            setValue("valueTransaction", formatCurrencyValue(data.valueTransaction));
            setValue("description", data.description);

            const { date: parsedDate } = parseDateString(data.date);
            setValue("formattedDate", data.date);
            setValue("selectedCategory", data.category);
            
            setRepeat(data.repeat);
            setAlert(data.alert);
            setStatus(data.status);
            setDate(parsedDate);
            setIsEditing(true);
            setIncome(data.income);
          }
        }
      } catch (error) {
        console.error("Erro ao obter o documento:", error);
        Toast.show("Erro ao carregar dados da despesa", { type: "error" });
      }
    };

    loadExpenseData();
  }, [selectedItemId, setValue, formatCurrencyValue, parseDateString]);

  // Notification event handlers
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("Usuário descartou a notificação");
          break;
        case EventType.ACTION_PRESS:
          console.log("Usuário pressionou a notificação", detail.notification);
          break;
        default:
          break;
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Usuário tocou na notificação", detail.notification);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <TitleTask>Nome*</TitleTask>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <TitleTask>Valor*</TitleTask>
          <Controller
            control={control}
            name="valueTransaction"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={(value) => onChange(currencyMask(value))}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0,00"
              />
            )}
          />
        </View>

        {Platform.OS === "ios" ? (
          <View>
            <TitleTask>Data*</TitleTask>
            <View
              style={{
                width: 100,
                marginTop: 10,
              }}
            >
              <DateTimePicker
                value={date}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
                accessibilityLanguage="pt-BR"
              />
            </View>
          </View>
        ) : (
          <View>
            <TitleTask>Data* </TitleTask>

            <Controller
              control={control}
              name="formattedDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity
                  style={{ height: 50 }}
                  onPress={showDatePickerModal}
                >
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={false}
                    onFocus={showDatePickerModal}
                  />
                </TouchableOpacity>
              )}
            />

            {showDatePicker && (
              <DateTimePicker
                display="inline"
                value={date}
                mode="date"
                onChange={handleDateChange}
                locale="pt-BR"
              />
            )}
          </View>
        )}
        
        <View style={{ marginTop: 40, marginBottom: 20 }}>
          {!isEditing && (
            <>
              <TitleTask>
                Adicionar esse lançamento a sua lista de contas recorrentes?{" "}
                <Span>(opcional)</Span>
              </TitleTask>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={repeat ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setRepeat(!repeat)}
                value={repeat}
                style={{ width: 50, marginBottom: 20 }}
              />
            </>
          )}

          {isEditing && repeat && (
            <>
              <TitleTask>
                Remover da lista de despesas recorrentes <Span>(opcional)</Span>
              </TitleTask>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={removeRepeat ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setRemoveRepeat(!removeRepeat)}
                value={removeRepeat}
                style={{ width: 50 }}
              />
            </>
          )}

          <View>
            <TouchableOpacity
              onPress={handleShowAdvanced}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Title>{showAdvanced ? "Mostrar menos" : "Mostrar mais"}</Title>
              <MaterialIcons
                name={showAdvanced ? "arrow-drop-up" : "arrow-drop-down"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {showAdvanced && (
          <View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <View>
                <View>
                  <TitleTask>
                    Categorias <Span>(opcional)</Span>
                  </TitleTask>
                  <View style={{ height: 50, justifyContent: "center" }}>
                    <Controller
                      control={control}
                      name="selectedCategory"
                      render={({ field: { onChange, value } }) => (
                        <RNPickerSelect
                          value={value}
                          onValueChange={(value) => onChange(value)}
                          items={EXPENSE_CATEGORIES}
                          placeholder={{
                            label: "Selecione",
                            value: "Selecione",
                          }}
                          doneText="Pronto"
                        />
                      )}
                    />
                  </View>
                </View>
                
                {alert && (
                  <>
                    <TitleTask>Data da notificação</TitleTask>
                    <View style={{ height: 50, justifyContent: "center" }}>
                      <Controller
                        control={control}
                        name="selectedDateNotification"
                        render={({ field: { onChange, value } }) => (
                          <RNPickerSelect
                            value={value}
                            onValueChange={(value) => onChange(value)}
                            items={NOTIFICATION_DATE_OPTIONS}
                            placeholder={{
                              label: "Selecione",
                              value: "Selecione",
                            }}
                          />
                        )}
                      />
                    </View>
                    <TitleTask>Hora da notificação</TitleTask>
                    <View style={{ height: 50, justifyContent: "center" }}>
                      <Controller
                        control={control}
                        name="selectedHourNotification"
                        render={({ field: { onChange, value } }) => (
                          <RNPickerSelect
                            value={value}
                            onValueChange={(value) => onChange(value)}
                            items={NOTIFICATION_HOUR_OPTIONS}
                            placeholder={{
                              label: "Selecione",
                              value: "Selecione",
                            }}
                          />
                        )}
                      />
                    </View>
                  </>
                )}
              </View>
              
              <DividerTask />
              
              <View>
                <TitleTask>
                  Essa conta já está paga? <Span>(opcional)</Span>
                </TitleTask>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={status ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setStatus(!status)}
                  value={status}
                  style={{ width: 50 }}
                />
                <TitleTask>
                  Lembrete? <Span>(opcional)</Span>
                </TitleTask>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={alert ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setAlert(!alert)}
                  value={alert}
                  style={{ width: 50 }}
                />
                <TitleTask>
                  Despesa fixa? <Span>(opcional)</Span>
                </TitleTask>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={income ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setIncome(!income)}
                  value={income}
                  style={{ width: 50 }}
                />
              </View>
            </View>
            
            <View style={{ marginBottom: 5 }}>
              <TitleTask>
                Descrição <Span>(opcional)</Span>
              </TitleTask>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputDescription
                    multiline
                    numberOfLines={5}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    textAlignVertical="top"
                    style={{ paddingHorizontal: 12, paddingVertical: 12 }}
                  />
                )}
              />
            </View>
          </View>
        )}
        
        <View
          style={{
            marginBottom: 250,
            marginTop: Platform.OS === "ios" && alert === true ? 90 : 0,
          }}
        >
          {showButtonSave && (
            <Button
              style={{ marginBottom: 10 }}
              onPress={
                isEditing
                  ? handleSubmit(handleEditExpense, onInvalid)
                  : handleSubmit(handleSaveExpense, onInvalid)
              }
            >
              <TitleTask>{loading ? <LoadingIndicator /> : "Salvar"}</TitleTask>
            </Button>
          )}
          
          {isEditing && (
            <Button style={{ marginBottom: 10 }} onPress={handleDeleteExpense}>
              <TitleTask>Excluir</TitleTask>
            </Button>
          )}
          
          {user && (
            <FormProvider {...form}>
              <ShareWithUsers 
                control={control}
                name="sharedUsers"
              />
            </FormProvider>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
