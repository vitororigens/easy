import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Button, Content, Input, InputContainer, Title } from "./styles";
import { sendPushNotification } from "../../services/one-signal";
import { createNotification } from "../../services/firebase/notifications.firebase";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { Timestamp } from "firebase/firestore";
import {
  createNote,
  deleteNote,
  findNoteById,
  updateNote,
} from "../../services/firebase/notes.firebase";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewNotes({ closeBottomSheet, onCloseModal }: Props) {
  const route = useRoute();
  const navigation = useNavigation();

  const { selectedItemId, isCreator = true } = route.params as {
    selectedItemId?: string;
    reload?: boolean;
    isCreator: boolean;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loggedUser = useUserAuth();

  const uid = loggedUser?.uid;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
      sharedUsers: [],
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = form;

  const sharedUsers = watch("sharedUsers");

  const handleCreateNote = async ({ name, description, sharedUsers }: FormSchemaType) => {
    try {
      if (!uid) return;
      setLoading(true);
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });

      const createdNote = await createNote({
        name,
        description,
        createdAt: Timestamp.now(),
        uid,
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
      });

      Toast.show("Nota adicionada!", { type: "success" });

      if (sharedUsers.length > 0) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );

          const message = alreadySharing
            ? `${loggedUser?.displayName} adicionou uma nova nota`
            : `${loggedUser?.displayName} convidou você para compartilhar uma nota`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: user.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "note",
                id: createdNote.id,
              },
              title: "Compartilhamento de nota",
              description: message,
            }),
            ...(!alreadySharing
              ? [
                  createSharing({
                    invitedBy: uid as string,
                    status: ESharingStatus.PENDING,
                    target: user.uid,
                  }),
                ]
              : []),
            sendPushNotification({
              title: "Compartilhamento de nota",
              message,
              uid: user.uid,
            }),
          ]);
        }
      }

      reset();
      navigation.navigate("tabroutes", {
        screen: "Notas",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      setLoading(false);
      console.error("Erro ao adicionar o item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    try {
      setLoading(true);
      await deleteNote(selectedItemId);
      Toast.show("Nota Excluída!", { type: "success" });
      navigation.navigate("tabroutes", {
        screen: "Notas",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao excluir o documento de item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async ({ name, description }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    try {
      await updateNote({
        id: selectedItemId,
        name,
        description,
        shareInfo: sharedUsers.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          acceptedAt: user.acceptedAt,
        })),
        shareWith: sharedUsers.map((user) => user.uid),
      });
      navigation.navigate("tabroutes", {
        screen: "Notas",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao atualizar o documento:", error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obrigatórios antes de salvar."
    );
  };

  useEffect(() => {
    if (selectedItemId) {
      const findNote = async () => {
        try {
          const note = await findNoteById(selectedItemId);

          if (note) {
            setValue("name", note.name);
            setValue("description", note.description);
            setValue(
              "sharedUsers",
              note.shareInfo.map((si) => ({
                uid: si.uid,
                userName: si.userName,
                acceptedAt: si.acceptedAt,
              })) ?? []
            );
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Erro ao obter o documento:", error);
        }
      };
      findNote();
    }
  }, [selectedItemId]);

  return (
    <>
      <DefaultContainer
        backButton
        hasHeader={false}
        title="Adicionar nova nota"
        closeModalFn={closeBottomSheet}
      >
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
                  editable={isCreator}
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
                  editable={isCreator}
                />
              )}
            />
            {isCreator && (
              <FormProvider {...form}>
                <ShareWithUsers />
              </FormProvider>
            )}

            <View style={{ marginBottom: 10, height: 150 }}>
              <Button
                style={{ marginBottom: 10 }}
                onPress={
                  isEditing
                    ? handleSubmit(handleUpdateNote, onInvalid)
                    : handleSubmit(handleCreateNote, onInvalid)
                }
                disabled={!isCreator}
              >
                {loading ? <LoadingIndicator /> : <Title>Salvar</Title>}
              </Button>
              {!!selectedItemId && (
                <Button
                  style={{ marginBottom: 10 }}
                  onPress={handleDeleteNote}
                  disabled={!isCreator}
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
