import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import {
  Button,
  Content,
  Input,
  InputContainer,
  Title
} from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewNotes({
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

  // Hooks
  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  // Functions
  const handleSaveItem = ({ name, description }: FormSchemaType) => {
    database
      .collection("Notes")
      .doc()
      .set({
        name,
        description,
        createdAt: format(new Date(), "dd/MM/yyyy"),
        uid: uid,
      })
      .then(() => {
        Toast.show("Nota adicionada!", { type: "success" });
        reset();
        onCloseModal && onCloseModal();
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

    const expenseRef = database.collection("Notes").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        Toast.show("Nota Excluída!", { type: "success" });
        onCloseModal && onCloseModal();
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de item:", error);
      });
  };

  const handleEditExpense = ({ name, description }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }

    database
      .collection("Notes")
      .doc(selectedItemId)
      .set({
        name,
        uid,
        description,
        createdAt: format(new Date(), "dd/MM/yyyy"),
      })
      .then(() => {
        Toast.show("Nota editada!", { type: "success" });
        reset();
        onCloseModal && onCloseModal();
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
        .collection("Notes")
        .doc(selectedItemId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setValue("name", data.name);
              setValue("description", data.description);
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
    <>
      <DefaultContainer hasHeader={false} title="Adicionar nova nota" closeModalFn={closeBottomSheet}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <Content>
              <Title>Nome da nota</Title>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Title>Nota</Title>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputContainer
                    multiline
                    numberOfLines={20}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    textAlignVertical="top"
                  />
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
                    <Title>Salvar</Title>
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
