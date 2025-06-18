import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert, Text } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { findNoteById } from "../../services/firebase/notes.firebase";
import { Button, Content, Input, InputContainer, Title } from "./styles";
import { Timestamp } from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import {
  createNote,
  deleteNote,
  updateNote,
} from "../../services/firebase/notes.firebase";
import { DefaultContainer } from "../../components/DefaultContainer";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
};

type FormSchemaType = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, "Nome da nota é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  author: z.string().optional(),
  type: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ).default([]),
});

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

  const uid = loggedUser?.user?.uid;
  const currentUser = loggedUser?.user?.displayName;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
      sharedUsers: [],
      author: "",
      type: "",
    },
  });

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  const sharedUsers = watch("sharedUsers");

  const handleCreateNote = async ({
    name,
    description,
    sharedUsers,
  }: FormSchemaType) => {
    console.log('=== INÍCIO handleCreateNote ===');
    console.log('Valores do formulário:', { name, description, sharedUsers });
    
    try {
      // Validação manual adicional
      if (!name || name.trim() === '') {
        Alert.alert("Erro", "Nome da nota é obrigatório");
        return;
      }
      
      if (!description || description.trim() === '') {
        Alert.alert("Erro", "Descrição é obrigatória");
        return;
      }
      
      if (!uid) return;
      setLoading(true);
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });

      const createdNote = await createNote({
        name,
        description,
        type: "nota",
        author: String(currentUser),
        createdAt: new Date(),
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

      if (sharedUsers.length > 0 || sharedUsers.length !== null) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === "accepted"
          );

          const possibleSharingRequestExists = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );

          const message = alreadySharing
            ? `${loggedUser?.user?.displayName} adicionou uma nova nota`
            : `${loggedUser?.user?.displayName} convidou você para compartilhar uma nota`;

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
              createdAt: Timestamp.now(),
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

  const handleUpdateNote = async ({
    name,
    description,
    author,
    type,
  }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    
    // Validação manual adicional
    if (!name || name.trim() === '') {
      Alert.alert("Erro", "Nome da nota é obrigatório");
      return;
    }
    
    if (!description || description.trim() === '') {
      Alert.alert("Erro", "Descrição é obrigatória");
      return;
    }
    
    try {
      await updateNote({
        id: selectedItemId,
        name,
        author,
        type,
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

  const onInvalid = (errors: any) => {
    console.log('Erros de validação:', errors);
    console.log('Valores atuais do formulário:', form.getValues());
    
    const errorMessages = [];
    
    if (errors.name) {
      errorMessages.push(`Nome: ${errors.name.message}`);
    }
    
    if (errors.description) {
      errorMessages.push(`Descrição: ${errors.description.message}`);
    }
    
    if (errors.author) {
      errorMessages.push(`Autor: ${errors.author.message}`);
    }
    
    if (errors.type) {
      errorMessages.push(`Tipo: ${errors.type.message}`);
    }
    
    if (errors.sharedUsers) {
      errorMessages.push(`Usuários compartilhados: ${errors.sharedUsers.message}`);
    }
    
    Alert.alert(
      "Atenção!",
      `Por favor, corrija os seguintes campos:\n\n${errorMessages.join('\n')}`
    );
  };

  useEffect(() => {
    if (selectedItemId) {
      const findNote = async () => {
        try {
          const note = await findNoteById(selectedItemId);

          if (note) {
            setValue("name", note.name);
            setValue("author", note.author);
            setValue("type", note.type);
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
        <Content>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
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
                  style={errors.name ? { borderColor: 'red' } : {}}
                />
              )}
            />
            {errors.name && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                {errors.name.message}
              </Text>
            )}

            {selectedItemId && (
              <>
                <Title>Autor da nota</Title>
                <Controller
                  control={control}
                  name="author"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={isCreator}
                    />
                  )}
                />
                <Title>Tipo de item</Title>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={isCreator}
                    />
                  )}
                />
              </>
            )}

            <Title>Nota</Title>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputContainer
                  multiline
                  numberOfLines={40}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  textAlignVertical="top"
                  editable={isCreator}
                  style={errors.description ? { borderColor: 'red' } : {}}
                />
              )}
            />
            {errors.description && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                {errors.description.message}
              </Text>
            )}

            {isCreator && (
              <FormProvider {...form}>
                <ShareWithUsers
                  control={control as any}
                  name="sharedUsers"
                />
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
          </ScrollView>
        </Content>
      </DefaultContainer>
    </>
  );
}
