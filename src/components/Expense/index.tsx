import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { currencyMask, currencyUnMask } from "../../utils/currency";
import {
  Button,
  DividerTask,
  Input,
  InputDescription,
  Span,
  Title,
  TitleTask,
} from "./styles";
import { LoadingIndicator } from "../Loading/style";

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
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [income, setIncome] = useState(false);
  const [status, setStatus] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const uid = user?.uid;

  // Hooks
  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      formattedDate: date.toLocaleDateString("pt-BR"),
      name: "",
      selectedCategory: "outros",
      valueTransaction: "",
    },
  });

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

  const handleSaveExpense = ({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
  }: FormSchemaType) => {
    setLoading(true);

    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    const transactionValue = valueTransaction
      ? currencyUnMask(valueTransaction)
      : 0;

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
    };

    // Save the expense for the current month
    database
      .collection("Expense")
      .add(expenseData)
      .then(() => {
        Toast.show("Transação adicionada!", { type: "success" });
        setLoading(false);
        setRepeat(false);
        setAlert(false);
        setStatus(false);
        setIncome(false);
        reset();
        !!onCloseModal && onCloseModal();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao adicionar a transação: ", error);
      });

    // If the repeat switch is on, create copies for the next 11 months
    if (repeat) {
      for (let i = 1; i <= 11; i++) {
        let nextMonth = monthNumber + i;
        let nextYear: any = year;

        if (nextMonth > 12) {
          nextMonth -= 12;
          nextYear++;
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
        onCloseModal && onCloseModal();
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de despesa:", error);
      });
  };

  const handleEditExpense = ({
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

    database
      .collection("Expense")
      .doc(selectedItemId)
      .set({
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
      })
      .then(() => {
        Toast.show("Transação editada!", { type: "success" });
        setLoading(false);
        setRepeat(false);
        setAlert(false);
        setStatus(false);
        setIncome(false);
        !!onCloseModal && onCloseModal();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao editar a transação: ", error);
      });
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
        <View>
          <TitleTask>Data* </TitleTask>
          <TouchableOpacity
            style={{ height: 50 }}
            onPress={showDatePickerModal}
          >
            <Controller
              control={control}
              name="formattedDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={false}
                />
              )}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={handleDateChange}
            />
          )}
        </View>
        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <TitleTask>
            Adicionar esse lançamento a sua lista de contas recorrente?{" "}
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
          <>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ width: "50%" }}>
                <View>
                  <TitleTask style={{ marginTop: 20 }}>
                    Categorias <Span>(opicional)</Span>
                  </TitleTask>
                  <View style={{ height: 50 }}>
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
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <DividerTask />
              <View style={{ width: "50%" }}>
                <TitleTask>
                  Essa conta já está paga? <Span>(opicional)</Span>
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
                  Lembrete? <Span>(opicional)</Span>
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
                  Despesa fixa? <Span>(opicional)</Span>
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
          </>
        )}
        <View style={{ marginBottom: 10, height: 200 }}>
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
          {showButtonEdit && (
            <Button
              style={{ marginBottom: 10 }}
              onPress={handleSubmit(handleEditExpense, onInvalid)}
            >
              <TitleTask>Salvar</TitleTask>

            </Button>
          )}
          {showButtonRemove && (
            <Button style={{ marginBottom: 10 }} onPress={handleDeleteExpense}>
              <TitleTask>Excluir</TitleTask>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
