import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { currencyMask, currencyUnMask } from "../../utils/mask";
import { findTaskById } from "../../services/firebase/tasks";
import { Button, Content, Input, Span, Title } from "./styles";
import { getInitials } from "../../utils/getInitials";
import { Timestamp } from "@react-native-firebase/firestore";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useTask } from "../../contexts/TaskContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { createTask } from "../../services/firebase/tasks";
import { database } from "../../libs/firebase";

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
  formattedDate: z.string().min(1, "Data é obrigatória"),
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
  const uid = loggedUser.user?.uid;
  const route = useRoute();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedItemId, isCreator = true } = route.params as {
    selectedItemId?: string;
    isCreator: boolean;
  };
  console.log("selectedItemId", selectedItemId);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      formattedDate: format(new Date(), "dd/MM/yyyy"),
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
        description: "",
        status: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
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
            ? `${loggedUser.user?.displayName} adicionou uma nova tarefa`
            : `${loggedUser.user?.displayName} convidou você para compartilhar uma tarefa`;

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
              createdAt: Timestamp.now(),
              description: message,
            }),
            ...(!alreadySharing && !possibleSharingRequestExists
              ? [
                createSharing({
                  invitedBy: uid as string,
                  status: ESharingStatus.PENDING,
                  target: user.uid,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
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
    const loadTaskData = async () => {
      if (selectedItemId) {
        try {
          console.log("Carregando dados da tarefa:", selectedItemId);
          const task = await findTaskById(selectedItemId);
          
          if (task) {
            console.log("Dados da tarefa carregados:", task);
            setValue("name", task.name);
            
            // Carregar usuários compartilhados se existirem
            if (task.shareInfo && Array.isArray(task.shareInfo)) {
              setValue(
                "sharedUsers",
                task.shareInfo.map((si: any) => ({
                  uid: si.uid,
                  userName: si.userName,
                  acceptedAt: si.acceptedAt,
                }))
              );
            } else {
              setValue("sharedUsers", []);
            }
            
            setIsEditing(true);
          } else {
            console.log("Tarefa não encontrada:", selectedItemId);
          }
        } catch (error) {
          console.error("Erro ao carregar dados da tarefa:", error);
        }
      }
    };

    loadTaskData();
  }, [selectedItemId, setValue]);

  return (
    <View>
      <DefaultContainer
        hasHeader={false}
        title="Adicionar nova tarefa"
        closeModalFn={closeBottomSheet}
        backButton
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
                  <ShareWithUsers 
                  control={control}
                  name="sharedUsers"
                  />
                </FormProvider>
              )}
            </View>
          </Content>
      </DefaultContainer>
    </View>
  );
}
