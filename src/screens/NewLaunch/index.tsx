import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
//
import { Button, Content, Input, Title } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
//
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useUserAuth } from "../../hooks/useUserAuth";
import { currencyMask, currencyUnMask } from "../../utils/currency";
import { database } from "../../libs/firebase";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  valueItem: z.string().min(1, "Valor é obrigatório"),
  formattedDate: z.string().min(1, "Data é obrigatória"),
  description: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewLaunch({
  closeBottomSheet,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
  showButtonRemove,
  selectedItemId,
}: Props) {
  // States
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Hooks
  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      valueItem: "",
      formattedDate: date.toLocaleDateString("pt-BR"),
      description: "",
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

  const handleSaveItem = ({
    name,
    valueItem,
    formattedDate,
    description,
  }: FormSchemaType) => {
    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;
    database
      .collection("PiggyBank")
      .doc()
      .set({
        valueItem: currencyUnMask(valueItem),
        name,
        description,
        uid: uid,
        month: monthNumber,
        date: formattedDate,
      })
      .then(() => {
        Toast.show("Item adicionado!", { type: "success" });
        reset();
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  const handleDeleteExpense = () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    const expenseRef = database.collection("PiggyBank").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        Toast.show("Item Excluido!", { type: "success" });
        onCloseModal && onCloseModal();
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de item:", error);
      });
  };

  const handleEditExpense = ({
    name,
    description,
    valueItem,
    formattedDate,
  }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    const [day, month, year] = formattedDate.split("/");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    database
      .collection("PiggyBank")
      .doc(selectedItemId)
      .set({
        valueItem: currencyUnMask(valueItem),
        name,
        description,
        uid: uid,
        month: monthNumber,
        date: formattedDate,
      })
      .then(() => {
        Toast.show("Item adicionado!", { type: "success" });
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obriatórios antes de salvar."
    );
  };

  useEffect(() => {
    if (selectedItemId) {
      database
        .collection("PiggyBank")
        .doc(selectedItemId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setValue(
                "valueItem",
                data.valueItem.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              );
              setValue("description", data.description || "");
              setValue("name", data.name);
              setIsEditing(true);
              const [day, month, year] = data.date.split("/");
              const formattedDate = `${day}/${month}/${year}`;
              setValue("formattedDate", formattedDate);
              setDate(new Date(year, month - 1, day));
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
    <>
      <DefaultContainer
        closeModalFn={closeBottomSheet}
        title="Quanto você economizou?"
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Content>
            <Title>Nome*</Title>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />

            <Title>Valor</Title>
            <Controller
              control={control}
              name="valueItem"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={(value) => onChange(currencyMask(value))}
                  onBlur={onBlur}
                  placeholder="0,00"
                  keyboardType="numeric"
                />
              )}
            />

            {Platform.OS === "ios" ? (
              <View>
                <Title>Data*</Title>
                <View
                  style={{
                    width: 100,
                    marginTop: 10,
                    marginBottom: 10,
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
                <Title>Data* </Title>

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

            <Title>Descrição</Title>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input value={value} onChangeText={onChange} onBlur={onBlur} />
              )}
            />
            <View style={{ marginBottom: 10, height: 150 }}>
              {showButtonSave && (
                <Button
                  style={{ marginBottom: 10 }}
                  onPress={
                    isEditing
                      ? handleSubmit(handleEditExpense, onInvalid)
                      : handleSubmit(handleSaveItem, onInvalid)
                  }
                >
                  <Title>{isEditing ? "Salvar" : "Salvar"}</Title>
                </Button>
              )}
              {showButtonRemove && (
                <Button
                  style={{ marginBottom: 10 }}
                  onPress={handleDeleteExpense}
                >
                  <Title>Excluir</Title>
                </Button>
              )}
            </View>
          </Content>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
