import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { createRevenue } from "../../services/firebase/revenues.firebase";
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
import { sendPushNotification } from "../../services/one-signal";
import { Timestamp } from "firebase/firestore";
import { LoadingIndicator } from "../Loading/style";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import {
  Button,
  DividerTask,
  Input,
  InputDescription,
  Span,
  Title,
  TitleTask,
} from "./styles";
import { database } from "../../libs/firebase";

type RevenueProps = {
  selectedItemId?: string;
  showButtonRemove?: boolean;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  valueTransaction: z.string().optional(),
  formattedDate: z.string().min(1, "Data é obrigatória"),
  description: z.string().optional(),
  selectedCategory: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function Revenue({
  selectedItemId,
  onCloseModal,
  showButtonSave,
}: RevenueProps) {
  // States
  const user = useUserAuth();
  const { selectedMonth } = useMonth();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [removeRepeat, setRemoveRepeat] = useState(false);
  const uid = user?.uid;

  const navigation = useNavigation();
  const route = useRoute();
  const { isCreator = true } = route.params as {
    selectedItemId?: string;
    isCreator: boolean;
  };

  // Hooks
  // const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     description: "",
  //     formattedDate: date.toLocaleDateString("pt-BR"),
  //     name: "",
  //     selectedCategory: "Outros",
  //     valueTransaction: "",
  //     sharedUsers: [],
  //   },
  // });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      formattedDate: date.toLocaleDateString("pt-BR"),
      name: "",
      selectedCategory: "Outros",
      valueTransaction: "",
      sharedUsers: [],
    },
  });
  const { control, handleSubmit, reset, setValue, watch } = form;
  // Functions

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

  async function handleSaveRevenue({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
    sharedUsers,
  }: FormSchemaType) {
    setLoading(true);

    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    const usersInvitedByMe = await getSharing({
      profile: "invitedBy",
      uid: uid as string,
    });

    const transactionValue = valueTransaction
      ? currencyUnMask(valueTransaction)
      : 0;

    let transactionValueConverted = transactionValue.toString().slice(0, -2);

    const revenueData = {
      name: name,
      category: selectedCategory,
      uid: uid,
      date: formattedDate,
      valueTransaction: transactionValueConverted,
      description: description,
      repeat,
      type: "input",
      month: monthNumber,
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

    // Salva o lançamento de receita para o mês atual
    // const saveRevenue = database
    //   .collection("Revenue")
    //   .add(revenueData)
    //   .then(() => {
    //     Toast.show("Transação adicionada!", { type: "success" });
    //     setRepeat(false);
    //     reset();
    //     setLoading(false);
    //     !!onCloseModal && onCloseModal();
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     console.error("Erro ao adicionar a transação: ", error);
    //   });

    try {
      const createdRevenue = await createRevenue(revenueData);

      Toast.show("Transação adicionada!", { type: "success" });
      setRepeat(false);
      reset();
      setLoading(false);
      !!onCloseModal && onCloseModal();

      navigation.navigate("tabroutes", {
        screen: "Receitas",
        params: { reload: true },
      });

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
          const nextMonthRevenueData = {
            ...revenueData,
            date: nextDate,
            month: nextMonth,
          };

          database
            .collection("Revenue")
            .add(nextMonthRevenueData)
            .catch((error) => {
              console.error("Erro ao adicionar a transação repetida: ", error);
            });
        }
      }

      for (const userSharing of sharedUsers) {
        const alreadySharing = usersInvitedByMe.some(
          (u) => u.target === userSharing.uid && u.status === "accepted"
        );

        const possibleSharingRequestExists = usersInvitedByMe.some(
          (u) => u.target === userSharing.uid
        );

        const message = alreadySharing
          ? `${user?.displayName} adicionou um novo item ao mercado`
          : `${user?.displayName} convidou você para compartilhar um item de mercado`;

        await Promise.allSettled([
          createNotification({
            sender: uid as string,
            receiver: userSharing.uid,
            status: alreadySharing ? "sharing_accepted" : "pending",
            type: "sharing_invite",
            source: {
              type: "expense",
              id: createdRevenue.id,
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
    } catch (err) {
      setLoading(false);
      return console.log("erro:", err);
    }
  }

  async function handleEditRevenue({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
  }: FormSchemaType) {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }

    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    const transactionValue = valueTransaction
      ? currencyUnMask(valueTransaction)
      : 0;

    try {
      const revenueData = {
        name,
        category: selectedCategory,
        uid: uid,
        date: formattedDate,
        valueTransaction: transactionValue,
        description: description,
        repeat: removeRepeat ? false : repeat,
        type: "input",
        month: monthNumber,
      };

      await database.collection("Revenue").doc(selectedItemId).set(revenueData);
      Toast.show("Transação editada!", { type: "success" });

      if (removeRepeat) {
        const revenuesSnapshot = await database
          .collection("Revenue")
          .where("uid", "==", uid)
          .where("name", "==", name)
          .get();

        const batch = database.batch();
        revenuesSnapshot.forEach((doc) => {
          const revenueMonth = doc.data().month;
          if (revenueMonth !== selectedMonth) {
            batch.delete(doc.ref);
          }
        });

        await batch.commit();
      }

      setLoading(false);
      setRepeat(false);
      setIsEditing(false);
      !!onCloseModal && onCloseModal();
    } catch (error) {
      setLoading(false);
      console.error("Erro ao editar a transação: ", error);
    }
  }

  function handleDeleteRevenue() {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    const revenueRef = database.collection("Revenue").doc(selectedItemId);
    revenueRef
      .delete()
      .then(() => {
        console.log("Documento de receita excluído com sucesso.");
        if (onCloseModal) {
          onCloseModal();
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de receita:", error);
      });
  }

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha os campos obrigatórios antes de salvar."
    );
  };

  function handleShowAdvanced() {
    setShowAdvanced((prevState) => !prevState);
  }

  useEffect(() => {
    if (selectedItemId) {
      database
        .collection("Revenue")
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
              setValue(
                "sharedUsers",
                data.shareInfo.map((si: any) => ({
                  uid: si.uid,
                  userName: si.userName,
                  acceptedAt: si.acceptedAt,
                })) ?? []
              );
              setValue("description", data.description);
              const [day, month, year] = data.date.split("/");
              setValue("formattedDate", data.date);
              setValue("selectedCategory", data.category);
              setRepeat(data.repeat);
              setDate(new Date(year, month - 1, day));
              setIsEditing(true);
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
          <TitleTask>
            Valor <Span>(opcional)</Span>
          </TitleTask>
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
        {showAdvanced && (
          <>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ width: "50%" }}>
                <View>
                  <TitleTask>
                    Categorias <Span>(opicional)</Span>{" "}
                  </TitleTask>
                  <View style={{ height: 50, justifyContent: "center" }}>
                    <Controller
                      control={control}
                      name="selectedCategory"
                      defaultValue="Outros"
                      render={({ field: { onChange, value } }) => (
                        <RNPickerSelect
                          value={value}
                          onValueChange={(value) => onChange(value)}
                          items={[
                            { label: "Salário", value: "salario" },
                            { label: "Vendas", value: "vendas" },
                            { label: "Investimentos", value: "investimentos" },
                            { label: "Comissão", value: "Comissão" },
                            { label: "Adiantamentos", value: "Adiantamentos" },
                            { label: "Outros", value: "Outros" },
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
              </View>
              <DividerTask />
              {(!isEditing || !repeat) && (
                <View style={{ width: "40%" }}>
                  <TitleTask>
                    Repetir essa receita? <Span>(opicional)</Span>
                  </TitleTask>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={repeat ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setRepeat(!repeat)}
                    value={repeat}
                    style={{ width: 50 }}
                  />
                </View>
              )}

              {isEditing && repeat && (
                <View style={{ width: "40%" }}>
                  <TitleTask>
                    Remover da lista de receitas recorrentes{" "}
                    <Span>(opcional)</Span>
                  </TitleTask>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={removeRepeat ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setRemoveRepeat(!removeRepeat)}
                    value={removeRepeat}
                    style={{ width: 50 }}
                  />
                </View>
              )}
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
          </>
        )}
        <View style={{ marginBottom: 250 }}>
          {showButtonSave && (
            <Button
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
              onPress={
                isEditing
                  ? handleSubmit(handleEditRevenue, onInvalid)
                  : handleSubmit(handleSaveRevenue, onInvalid)
              }
            >
              <TitleTask>{isEditing ? "Salvar" : "Salvar"}</TitleTask>
              {loading && <LoadingIndicator style={{ marginTop: 2 }} />}
            </Button>
          )}
          {isEditing && (
            <Button style={{ marginBottom: 10 }} onPress={handleDeleteRevenue}>
              <TitleTask>Excluir</TitleTask>
            </Button>
          )}
          {isCreator && (
            <FormProvider {...form}>
              <ShareWithUsers />
            </FormProvider>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
