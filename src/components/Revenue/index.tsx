import { MaterialIcons } from '@expo/vector-icons';
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
});

type FormSchemaType = z.infer<typeof formSchema>;

export function Revenue({
  selectedItemId,
  showButtonRemove,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
}: RevenueProps) {
  // States
  const user = useUserAuth();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const uid = user?.uid;

  // Hooks
  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      formattedDate: date.toLocaleDateString("pt-BR"),
      name: "",
      selectedCategory: "Outros",
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

  function handleSaveRevenue({
    formattedDate,
    name,
    valueTransaction,
    description,
    selectedCategory,
  }: FormSchemaType) {
    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    const revenueData = {
      name: name,
      category: selectedCategory,
      uid: uid,
      date: formattedDate,
      valueTransaction: !!valueTransaction?.length ? currencyUnMask(valueTransaction) : "0",
      description: description,
      repeat: repeat,
      type: "input",
      month: monthNumber,
    };

    // Salva o lançamento de receita para o mês atual
    database
      .collection("Revenue")
      .add(revenueData)
      .then(() => {
        Toast.show("Transação adicionada!", { type: "success" });
        setRepeat(false);
        reset();
      })
      .catch((error) => {
        console.error("Erro ao adicionar a transação: ", error);
      });

    // Se o interruptor de repetição estiver ativado, cria cópias para os próximos 11 meses
    if (repeat) {
      for (let i = 1; i <= 11; i++) {
        // Obtém o próximo mês e ano
        let nextMonth = monthNumber + i;
        let nextYear: any = year;

        if (nextMonth > 12) {
          nextMonth -= 12;
          nextYear++;
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
  }

  function handleEditRevenue({
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

    database
      .collection("Revenue")
      .doc(selectedItemId)
      .set({
        name: name,
        category: selectedCategory,
        uid: uid,
        date: formattedDate,
        valueTransaction: !!valueTransaction?.length ? currencyUnMask(valueTransaction) : "0",
        description: description,
        repeat: repeat,
        type: "input",
        month: monthNumber,
      })
      .then(() => {
        Toast.show("Transação editada!", { type: "success" });
        setRepeat(false);
        setIsEditing(false);
        reset();
        if (onCloseModal) {
          onCloseModal();
        }
      })
      .catch((error) => {
        console.error("Erro ao editar a transação: ", error);
      });
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
                currencyMask(String(data.valueTransaction))
              );
              setValue("description", data.description);
              setValue("formattedDate", data.date);
              setValue("selectedCategory", data.category);
              setRepeat(data.repeat);
              setDate(new Date(data.date));
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
      <ScrollView>
        <View>
          <TitleTask>Nome*</TitleTask>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <TitleTask>Valor <Span>(opicional)</Span></TitleTask>
          <Controller
            control={control}
            name="valueTransaction"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={(value) => onChange(currencyMask(value))}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder='0,00'
              />
            )}
          />
        </View>
        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleShowAdvanced}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Title>{showAdvanced ? "Mostrar menos" : "Mostrar mais"}</Title>
            <MaterialIcons
              name={showAdvanced ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {showAdvanced &&
          <>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ width: "50%" }}>
                <View>
                  <TitleTask>Data*</TitleTask>
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
                      display="calendar"
                      onChange={handleDateChange}
                    />
                  )}
                </View>
                <View>
                  <TitleTask style={{ marginTop: 20 }}>
                    Categorias <Span>(opicional)</Span>{" "}
                  </TitleTask>
                  <View style={{ height: 50 }}>
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
                          placeholder={{ label: "Selecione", value: "Selecione" }}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <DividerTask />
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
        }
        <View style={{ marginBottom: 10, height: 200 }}>
          {showButtonSave && (
            <Button
              style={{ marginBottom: 10 }}
              onPress={
                isEditing
                  ? handleSubmit(handleEditRevenue, onInvalid)
                  : handleSubmit(handleSaveRevenue, onInvalid)
              }
            >
              <TitleTask>{isEditing ? "Salvar" : "Salvar"}</TitleTask>
            </Button>
          )}
          {showButtonEdit && (
            <Button
              style={{ marginBottom: 10 }}
              onPress={handleSubmit(handleEditRevenue, onInvalid)}
            >
              <TitleTask>Salvar</TitleTask>
            </Button>
          )}
          {showButtonRemove && (
            <Button style={{ marginBottom: 10 }} onPress={handleDeleteRevenue}>
              <TitleTask>Excluir</TitleTask>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
