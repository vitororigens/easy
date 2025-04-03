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
import { createTask } from "../../services/firebase/tasks";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { sendPushNotification } from "../../services/one-signal";

import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

type FormSchemaType = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatória"),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});
// const formSchema = z.object({
//   name: z.string().min(1, "Nome da Tarefa é obrigatório"),
//   // quantity: z.string().optional(),
//   // price: z.string().optional(),
//   // category: z.string().optional(),
//   // measurement: z.string().optional(),
//   // observation: z.string().optional(),

// });

export function NewItemTask({ closeBottomSheet, onCloseModal }: Props) {
  // State
  const navigation = useNavigation();
  const loggedUser = useUserAuth();
  const uid = loggedUser?.uid;
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
      sharedUsers: [],
    },
  });

  const formattedDate = format(new Date(), "dd/MM/yyyy");

  // Hooks
  const { control, handleSubmit, reset, setValue, watch } = form;

  // Functions

  const sharedUsers = watch("sharedUsers");

  const handleCreatask = async ({ name, sharedUsers }: FormSchemaType) => {
    try {
      if (!uid) return;
      setLoading(true);
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });

      const createNewTask = await createTask({
        name: name,
        createdAt: Timestamp.now(),
        uid: uid,
        type: "task",
        shareWith: sharedUsers.map((user) => user.uid),
        shareInfo: sharedUsers.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          finished: false,
          acceptedAt: usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === ESharingStatus.ACCEPTED
          )
            ? Timestamp.now()
            : null,
        })),
      });

      if (sharedUsers.length > 0 || sharedUsers.length !== null) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === "accepted"
          );

          const possibleSharingRequestExists = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );
          const message = alreadySharing
            ? `${loggedUser.displayName} adicionou uma nova tarefa`
            : `${loggedUser.displayName} convidou você para compartilhar uma tarefa`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: user.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "task",
                id: createNewTask.id,
              },
              title: "Compartilhamento de tarefa",
              description: message,
            }),
            ...(!alreadySharing && !possibleSharingRequestExists
              ? [
                  createSharing({
                    invitedBy: uid as string,
                    status: ESharingStatus.PENDING,
                    target: user.uid,
                  }),
                ]
              : []),
            sendPushNotification({
              title: "Compartilhamento de task",
              message,
              uid: user.uid,
            }),
          ]);
        }
        reset();
        navigation.navigate("tabroutes", {
          screen: "Tarefas",
          params: { reload: true },
        });
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao adicionar o item: ", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSaveItem = ({ name }: FormSchemaType) => {
  //   console.log("chegou aqui no salvamento da nota");
  //   setLoading(true);
  //   database
  //     .collection("Task")
  //     .doc()
  //     .set({
  //       name,
  //       uid: uid,
  //       createdAt: formattedDate,
  //     })
  //     .then(() => {
  //       setLoading(false);
  //       Toast.show("Item adicionado!", { type: "success" });
  //       reset();
  //       navigation.goBack();
  //       !!closeBottomSheet && closeBottomSheet();
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.error("Erro ao adicionar o item: ", error);
  //     });
  // };

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

  // const onInvalid = () => {
  //   Alert.alert(
  //     "Atenção!",
  //     "Por favor, preencha todos os campos obrigatórios antes de salvar."
  //   );
  // };

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
              setValue(
                "sharedUsers",
                data.shareInfo.map((si: any) => ({
                  uid: si.uid,
                  userName: si.userName,
                  acceptedAt: si.acceptedAt,
                })) ?? []
              );
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

            <View style={{ marginBottom: 50, height: 200 }}>
              <Button
                style={{ marginBottom: 10 }}
                onPress={
                  isEditing
                    ? handleSubmit(handleEditExpense)
                    : handleSubmit(handleCreatask)
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
