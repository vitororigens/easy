import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
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
import { Timestamp } from "firebase/firestore";
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
import { formatDate } from "date-fns";
import { database } from "../../libs/firebase";
import { Notification } from "../Notification/index";

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

type FormSchemaType = z.infer<typeof formSchema>;

export function Expense({
  selectedItemId,
  showButtonRemove,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
}: ExpenseProps) {
  // States
  const user = useUserAuth();
  const { selectedMonth } = useMonth();
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
  const uid = user?.uid;
  const { getValues } = useForm<FormSchemaType>();

  // Hooks
  // const route = useRoute();

  // const { isCreator = true } = route.params as {
  //   selectedItemId?: string;
  //   isCreator: boolean;
  // };

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

  const { control, handleSubmit, reset, setValue, watch } = form;

  // Functions
  const validateNotificationParams = () => {
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
  };

  const scheduleNotification = async (notificationDate: any) => {
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
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formattedDateString = currentDate.toLocaleDateString("pt-BR");
    setValue("formattedDate", formattedDateString);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSaveExpense = async ({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
    sharedUsers,
  }: FormSchemaType) => {
    setLoading(true);

    try {
      const [day, month, year] = formattedDate.split("/");
      const selectedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
      const monthNumber = selectedDate.getMonth() + 1;

      const transactionValue = valueTransaction
        ? currencyUnMask(valueTransaction)
        : 0;

      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });
      const expenseData = {
        name: name,
        category: selectedCategory,
        date: formattedDate,
        valueTransaction: transactionValue,
        description: description,
        repeat: repeat,
        status: status,
        alert: alert,
        type: "output",
        uid: uid,
        month: monthNumber,
        income,
        shareWith: sharedUsers.map((user) => user.uid),
        shareInfo: sharedUsers.map((user) => ({
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

      // await handleNotification();

      if (sharedUsers.length > 0) {
        for (const userSharing of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === userSharing.uid && u.status === "accepted"
          );

          const possibleSharingRequestExists = usersInvitedByMe.some(
            (u) => u.target === userSharing.uid
          );

          const message = alreadySharing
            ? `${user?.displayName} adicionou um novo histórico de compras`
            : `${user?.displayName} convidou você para compartilhar uma histórico de compras`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: userSharing.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "expense",
                id: saveExpenseData.id,
              },
              title: "Compartilhamento de compras",
              description: message,
            }),
            ...(!alreadySharing && !possibleSharingRequestExists
              ? [
                  createSharing({
                    invitedBy: uid as string,
                    status: ESharingStatus.PENDING,
                    target: userSharing.uid as string,
                  }),
                ]
              : []),
            sendPushNotification({
              title: "Compartilhamento de despesa",
              message,
              uid: userSharing?.uid,
            }),
          ]);
        }
      }
      setLoading(false);
      setRepeat(false);
      setAlert(false);
      setStatus(false);
      setIncome(false);
      reset();
      if (onCloseModal) {
        onCloseModal();
      }

      // If the repeat switch is on, create copies for the next 11 months
      if (repeat) {
        for (let i = 1; i <= 11; i++) {
          let nextMonth = monthNumber + i;
          let nextYear: any = year;

          if (nextMonth > 12) {
            nextMonth -= 12;
            nextYear++;
          }

          // Adiciona verificação para garantir que não passe do ano corrente
          if (nextYear > year) {
            break;
          }

          const nextDate = `${day}/${nextMonth}/${nextYear}`;
          const nextMonthExpenseData = {
            ...expenseData,
            date: nextDate,
            month: nextMonth,
          };

          database
            .collection("Expense")
            .add(nextMonthExpenseData)
            .catch((error) => {
              console.error("Erro ao adicionar a transação repetida: ", error);
            });
        }
      }

      for (const userSharing of sharedUsers) {
        const alreadySharing = usersInvitedByMe.some(
          (u) => u.target === userSharing.uid
        );

        const message = alreadySharing
          ? `${user?.displayName} adicionou um novo item ao mercado`
          : `${user?.displayName} convidou você para compartilhar um item de mercado`;

        sendPushNotification({
          title: "Compartilhamento de item de mercado",
          message,
          uid: userSharing.uid,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao adicionar a transação: ", error);
      Toast.show("Erro ao adicionar a transação", { type: "danger" });
    }
  };

  const handleDeleteExpense = () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    const expenseRef = database.collection("Expense").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        console.log("Documento de despesa excluído com sucesso.");
        if (onCloseModal) {
          onCloseModal();
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de despesa:", error);
      });
  };

  async function handleNotification() {
    try {
      const validationResult = await validateNotificationParams();
      if (validationResult.isValid) {
        await scheduleNotification(validationResult.notificationDate);
        console.log("Notificação agendada com sucesso!");
      } else {
        console.error(validationResult.errorMessage);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  }

  const handleEditExpense = async ({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
  }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    setLoading(true);

    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    const transactionValue = valueTransaction
      ? currencyUnMask(valueTransaction)
      : 0;

    try {
      const expenseData = {
        name,
        category: selectedCategory,
        date: formattedDate,
        valueTransaction: transactionValue,
        description,
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

      if (removeRepeat) {
        const expensesSnapshot = await database
          .collection("Expense")
          .where("uid", "==", uid)
          .where("name", "==", name)
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
      !!onCloseModal && onCloseModal();
    } catch (error) {
      setLoading(false);
      console.error("Erro ao editar a transação: ", error);
    }
  };

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obrigatórios antes de salvar."
    );
  };

  function handleShowAdvanced() {
    setShowAdvanced((prevState) => !prevState);
  }

  useEffect(() => {
    if (selectedItemId) {
      database
        .collection("Expense")
        .doc(selectedItemId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setValue("name", data.name);
              setValue(
                "valueTransaction",
                data.valueTransaction.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              );
              setValue("description", data.description);

              const [day, month, year] = data.date.split("/");
              setValue("formattedDate", data.date);

              setValue("selectedCategory", data.category);
              setRepeat(data.repeat);
              setAlert(data.alert);
              setStatus(data.status);
              setDate(new Date(year, month - 1, day));
              setIsEditing(true);
              setIncome(data.income);
            } else {
              console.log("Dados do documento estão vazios!");
            }
          } else {
            console.log("Nenhum documento encontrado!");
          }
        })
        .catch((error) => {
          console.error("Erro ao obter o documento:", error);
        });
    }
  }, [selectedItemId]);

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
                          items={[
                            { label: "Investimentos", value: "Investimentos" },
                            { label: "Contas", value: "Contas" },
                            { label: "Compras", value: "Compras" },
                            { label: "Faculdade", value: "Faculdade" },
                            { label: "Internet", value: "Internet" },
                            { label: "Academia", value: "Academia" },
                            { label: "Emprestimo", value: "Emprestimo" },
                            { label: "Comida", value: "Comida" },
                            { label: "Telefone", value: "Telefone" },
                            {
                              label: "Entretenimento",
                              value: "Entretenimento",
                            },
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
                          ]}
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
                            items={[
                              { label: "No dia", value: "no dia" },
                              { label: "Um dia antes", value: "um dia antes" },
                              {
                                label: "Tres dia antes",
                                value: "tres dia antes",
                              },
                              {
                                label: "Cinco dia antes de vencer",
                                value: "cinco dias antes de vencer",
                              },
                            ]}
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
                            items={[
                              { label: "07:00", value: "07:00" },
                              { label: "08:00", value: "08:00" },
                              { label: "09:00", value: "09:00" },
                            ]}
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
              <ShareWithUsers />
            </FormProvider>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
