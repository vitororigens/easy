import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View, Text } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import {
  Button,
  ButtonPlus,
  Content,
  Input,
  InputContainer,
  Plus,
  SubTitle,
  Title
} from "./styles";
import { getInitials } from "../../utils/getInitials";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { EditshareModal } from "../../components/EditsshreModal";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewNotes({ closeBottomSheet, onCloseModal }: Props) {
  // States
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]); // Ensure correct type
  const data = useFirestoreCollection("User");

  // Hooks
  const route = useRoute();
  const navigation = useNavigation();

  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const { selectedItemId } = route.params as { selectedItemId?: string };

  // Functions
  const handleSaveItem = ({ name, description }: FormSchemaType) => {
    setLoading(true);
    database
      .collection("Notes")
      .doc()
      .set({
        name,
        description,
        createdAt: format(new Date(), "dd/MM/yyyy"),
        uid: uid,
        sharedWith: sharedUsers.map(user => ({
          uid: user.uid,
          userName: user.userName, // Store both uid and userName
        })),
      })
      .then(() => {
        setLoading(false);
        Toast.show("Nota adicionada!", { type: "success" });
        reset();
        navigation.goBack();
        onCloseModal && onCloseModal();
        closeBottomSheet && closeBottomSheet();
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

    const expenseRef = database.collection("Notes").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        Toast.show("Nota Excluída!", { type: "success" });
        setLoading(false);
        navigation.goBack();
        onCloseModal && onCloseModal();
        closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao excluir o documento de item:", error);
      });
  };

  const handleEditExpense = ({ name, description }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }

    setLoading(true);

    database
      .collection("Notes")
      .doc(selectedItemId)
      .set({
        name,
        uid,
        description,
        createdAt: format(new Date(), "dd/MM/yyyy"),
        sharedWith: sharedUsers.map(user => ({
          uid: user.uid,
          userName: user.userName, // Store both uid and userName
        })),
      })
      .then(() => {
        Toast.show("Nota editada!", { type: "success" });
        setLoading(false);
        reset();
        navigation.goBack();
        onCloseModal && onCloseModal();
        closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obrigatórios antes de salvar."
    );
  };

  const handleSelectUser = (selectedUser: any) => {
    setSharedUsers((prev) => [...prev, selectedUser]); 
    setIsModalVisible(false); 
  };
  useEffect(() => {
    if (selectedItemId) {
      // Fetch note data
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
  
              if (data.sharedWith && Array.isArray(data.sharedWith)) {
                setSharedUsers(data.sharedWith); // Directly set the sharedWith array
              } else {
                setSharedUsers([]);
              }
  
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
      <DefaultContainer backButton hasHeader={false} title="Adicionar nova nota" closeModalFn={closeBottomSheet}>
        <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
          <Content>
            <Title>Nome da nota</Title>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} onChangeText={onChange} value={value} />
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
            <Title>Compartilhar</Title>
            <View style={{ width: '100%', flexDirection: 'row' }}>
              <ButtonPlus onPress={() => setIsModalVisible(true)}>
                <Plus name="plus" />
              </ButtonPlus>
              {sharedUsers.map((user, index) => (
                <ButtonPlus key={index}>
                  <SubTitle>{getInitials(user.userName)}</SubTitle>
                </ButtonPlus>
              ))}
            </View>

            <View style={{ marginBottom: 10, height: 150 }}>
              <Button
                style={{ marginBottom: 10 }}
                onPress={
                  isEditing
                    ? handleSubmit(handleEditExpense, onInvalid)
                    : handleSubmit(handleSaveItem, onInvalid)
                }
              >
                {loading ? <LoadingIndicator /> : <Title>Salvar</Title>}
              </Button>
              {!!selectedItemId && (
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

        {isModalVisible && (
          <EditshareModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectUser={handleSelectUser}
            share="sharedWith" // Replace with actual field name if needed
            uid={uid || ""} // Pass the correct user UID
          />
        )}
      </DefaultContainer>
    </>
  );
}
