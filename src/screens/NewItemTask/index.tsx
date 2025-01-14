import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Button, Content, Input, Title } from "./styles";
import { database } from "../../libs/firebase";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { Timestamp } from "firebase/firestore";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

// const formSchema = z.object({
//   name: z.string().min(1, "Nome da Tarefa é obrigatória"),
// });

type FormSchemaType = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  quantity: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  measurement: z.string().optional(),
  observation: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

export function NewItemTask({ closeBottomSheet, onCloseModal }: Props) {
  // State
  const navigation = useNavigation();
  const user = useUserAuth();
  const uid = user?.uid;
  const route = useRoute();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedItemId, isCreator = true } = route.params as {
    selectedItemId?: string;
    isCreator: boolean;
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "1",
      price: "",
      category: "",
      measurement: "un",
      observation: "",
      sharedUsers: [],
    },
  });

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
    setLoading(true);
    database
      .collection("Task")
      .doc()
      .set({
        name,
        uid: uid,
        createdAt: formattedDate,
      })
      .then(() => {
        setLoading(false);
        Toast.show("Item adicionado!", { type: "success" });
        reset();
        navigation.goBack();
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  const handleDeleteExpense = () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }
    setLoading(true);

    const expenseRef = database.collection("Task").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        setLoading(false);
        Toast.show("Item Excluido!", { type: "success" });
        navigation.goBack();
        onCloseModal && onCloseModal();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao excluir o documento de item:", error);
      });
  };

  const handleEditExpense = ({ name }: FormSchemaType) => {
    setLoading(true);
    database
      .collection("Task")
      .doc(selectedItemId)
      .set({
        name,
        uid: uid,
      })
      .then(() => {
        setLoading(false);
        Toast.show("Item adicionado!", { type: "success" });
        onCloseModal && onCloseModal();
        navigation.goBack();
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        setLoading(false);
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
      <DefaultContainer
        hasHeader={false}
        title="Adicionar nova tarefa"
        closeModalFn={closeBottomSheet}
        backButton
      >
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
                <Input onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />

            <View style={{ marginBottom: 10, height: 150 }}>
              <Button
                style={{ marginBottom: 10 }}
                onPress={
                  isEditing
                    ? handleSubmit(handleEditExpense, onInvalid)
                    : handleSubmit(handleSaveItem, onInvalid)
                }
              >
                <Title>{loading ? <LoadingIndicator /> : "Salvar"}</Title>
              </Button>
              {!!selectedItemId && (
                <Button
                  style={{ marginBottom: 10 }}
                  onPress={handleDeleteExpense}
                >
                  <Title>Excluir</Title>
                </Button>
              )}
              {isCreator && (
                <FormProvider {...form}>
                  <ShareWithUsers />
                </FormProvider>
              )}
            </View>
          </Content>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
