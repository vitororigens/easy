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
import { Button, Content, Input, Title } from "./styles";

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
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewItemTask({
  closeBottomSheet,
  onCloseModal,
  showButtonEdit,
  showButtonSave,
  showButtonRemove,
  selectedItemId,
}: Props) {
  // State
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);

  const formattedDate = format(new Date(), "dd/MM/yyyy");
  
  // Hooks
  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Functions
  const handleSaveItem = ({ name }: FormSchemaType) => {
    database
      .collection("Task")
      .doc()
      .set({
        name,
        uid: uid,
        createdAt: formattedDate,
      })
      .then(() => {
        Toast.show("Item adicionado!", { type: "success" });
        reset();
        !!closeBottomSheet && closeBottomSheet()
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

    const expenseRef = database.collection("Marketplace").doc(selectedItemId);
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

  const handleEditExpense = ({ name }: FormSchemaType) => {
    database
      .collection("Task")
      .doc(selectedItemId)
      .set({
        name,
        uid: uid,
      })
      .then(() => {
        Toast.show("Item adicionado!", { type: "success" });
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
      isEditing ? "Nenhum documento selecionado para edição!" : "Atenção!",
      "Por favor, preencha todos os campos obriatórios antes de salvar."
    );
  };

  useEffect(() => {
    if (selectedItemId) {
      database
        .collection("Task")
        .doc(selectedItemId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setValue("name", data.name);
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
      <DefaultContainer hasHeader={false} title="Adicionar nova tarefa" closeModalFn={closeBottomSheet}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <Content>
              <Title>Nome da tarefa*</Title>
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
