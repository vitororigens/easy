import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  CircleContainer,
  ButtonSelect,
  IconCheck,
  ModalContainer,
  ModalContent,
  Plus,
  Title,
  Remove,
  FavoriteButton,
  FavoriteIcon,
  HeaderContainer,
  SectionTitle,
  ActionButtonsContainer,
  ActionButton,
  ActionButtonText,
  FavoritesContainer,
  FavoritesList,
  CloseButton,
  CloseButtonText,
  TextCircle,
} from "./styles";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { getInitials } from "../../utils/getInitials";
import { SubTitle } from "../DefaultContainer/style";
import { Input } from "../Input";
import { useDebouncedCallback } from "use-debounce";
import {
  findUserByUsername,
  IUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../../services/firebase/users.firestore";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Timestamp } from "@react-native-firebase/firestore";
import { database } from "../../libs/firebase";
import { doc, updateDoc, getDoc } from '@react-native-firebase/firestore';
import {
  ESharingStatus,
  getSharing,
  ISharing,
} from "../../services/firebase/sharing.firebase";
import { sendPushNotification } from "../../services/one-signal";

export const shareUserSchema = z.object({
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

// const form = useForm<FormSchemaType>({
//   resolver: zodResolver(formSchema),
//   defaultValues: {
//     description: "",
//     name: "",
//     sharedUsers: [],
//   },
// });

export type TShareUser = z.infer<typeof shareUserSchema>;

// Tipo genérico para o formulário
type FormData = {
  sharedUsers: Array<{
    uid: string;
    userName: string;
    acceptedAt: Timestamp | null;
  }>;
  [key: string]: any; // Permitir outras propriedades
};

export const ShareWithUsers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersAlreadySharing, setUsersAlreadySharing] = useState<ISharing[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<IUser[]>([]);

  const user = useUserAuth();
  const uid = user.user?.uid;

  const { watch, setValue } = useFormContext<FormData>();
  const sharedUsers = watch("sharedUsers");

  const searchUsers = useDebouncedCallback(async (username: string) => {
    if (!username || !uid) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const results = await findUserByUsername(username, uid);
      setUsers(results);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    
    // Adicionar favoritos automaticamente à lista de compartilhamento
    if (favoriteUsers.length > 0) {
      const newSharedUsers = [...sharedUsers];
      
      favoriteUsers.forEach(favoriteUser => {
        // Verificar se o usuário já está na lista de compartilhamento
        const isAlreadyShared = newSharedUsers.some(u => u.uid === favoriteUser.uid);
        
        if (!isAlreadyShared) {
          newSharedUsers.push({
            uid: favoriteUser.uid,
            userName: favoriteUser.userName,
            acceptedAt: usersAlreadySharing.some(
              (u) => u.target === favoriteUser.uid
            )
              ? Timestamp.now()
              : null,
          });
        }
      });
      
      setValue("sharedUsers", newSharedUsers);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchValue("");
  };

  const handleToggleSharedUser = async (
    user: Pick<IUser, "uid" | "userName"> & { acceptedAt: Timestamp | null }
  ) => {
    const isAdded = sharedUsers.some((u) => u.uid === user.uid);
    if (isAdded) {
      setValue(
        "sharedUsers",
        sharedUsers.filter((u) => u.uid !== user.uid)
      );
      return;
    }
    
    // Add user to shared list
    setValue("sharedUsers", [...sharedUsers, user]);
    
    // Send notification to the added user
    try {
      await sendPushNotification({
        title: "Novo compartilhamento",
        message: `${user.userName}, você foi adicionado a um compartilhamento!`,
        uid: user.uid,
      });
      console.log("Notification sent to:", user.userName);
    } catch (error) {
      console.error("Error sending notification:", error);
      // Don't show error to user as the sharing still works
    }
  };

  const handleToggleFavorite = async (userToToggle: IUser) => {
    if (!uid) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }
    
    const isFavorite = favoriteUsers.some(u => u.uid === userToToggle.uid);
    
    try {
      if (isFavorite) {
        await removeFromFavorites(uid, userToToggle.uid);
        setFavoriteUsers(favoriteUsers.filter(u => u.uid !== userToToggle.uid));
        Alert.alert("Sucesso", `${userToToggle.userName} removido dos favoritos`);
      } else {
        await addToFavorites(uid, userToToggle.uid);
        setFavoriteUsers([...favoriteUsers, userToToggle]);
        Alert.alert("Sucesso", `${userToToggle.userName} adicionado aos favoritos`);
      }
    } catch (error) {
      console.error("Erro ao gerenciar favoritos:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível gerenciar os favoritos: ${errorMessage}`);
    }
  };

  const handleClearSharedUsers = () => {
    Alert.alert(
      "Limpar usuários",
      "Tem certeza que deseja remover todos os usuários da lista de compartilhamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Limpar",
          onPress: () => {
            setValue("sharedUsers", []);
            Alert.alert("Sucesso", "Todos os usuários foram removidos da lista de compartilhamento");
          }
        }
      ]
    );
  };

  const handleClearAllFavorites = async () => {
    if (!uid) return;
    
    Alert.alert(
      "Limpar favoritos",
      "Tem certeza que deseja remover todos os usuários dos favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Limpar",
          onPress: async () => {
            try {
              // Usar a função ensureFavoritesProperty para garantir que o documento existe
              const userRef = doc(database, "User", uid);
              const userDoc = await getDoc(userRef);
              
              if (!userDoc.exists) {
                // Se o documento não existe, não há favoritos para limpar
                setFavoriteUsers([]);
                Alert.alert("Sucesso", "Todos os favoritos foram removidos");
                return;
              }
              
              // Atualizar o documento do usuário para remover todos os favoritos
              await updateDoc(userRef, {
                favorites: [],
                updatedAt: new Date()
              });
              
              setFavoriteUsers([]);
              Alert.alert("Sucesso", "Todos os favoritos foram removidos");
            } catch (error) {
              console.error("Erro ao limpar favoritos:", error);
              Alert.alert("Erro", "Não foi possível limpar os favoritos. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  const handleAddAllFavorites = async () => {
    if (favoriteUsers.length === 0) return;
    
    const newSharedUsers = [...sharedUsers];
    let addedCount = 0;
    const usersToNotify: IUser[] = [];
    
    favoriteUsers.forEach(favoriteUser => {
      // Verificar se o usuário já está na lista de compartilhamento
      const isAlreadyShared = newSharedUsers.some(u => u.uid === favoriteUser.uid);
      
      if (!isAlreadyShared) {
        newSharedUsers.push({
          uid: favoriteUser.uid,
          userName: favoriteUser.userName,
          acceptedAt: usersAlreadySharing.some(
            (u) => u.target === favoriteUser.uid
          )
            ? Timestamp.now()
            : null,
        });
        usersToNotify.push(favoriteUser);
        addedCount++;
      }
    });
    
    setValue("sharedUsers", newSharedUsers);
    
    // Send notifications to all added users
    if (usersToNotify.length > 0) {
      try {
        const notificationPromises = usersToNotify.map(user =>
          sendPushNotification({
            title: "Novo compartilhamento",
            message: `${user.userName}, você foi adicionado a um compartilhamento!`,
            uid: user.uid,
          })
        );
        
        await Promise.allSettled(notificationPromises);
        console.log("Notifications sent to", usersToNotify.length, "users");
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    }
    
    if (addedCount > 0) {
      Alert.alert("Sucesso", `${addedCount} favorito(s) adicionado(s) à lista de compartilhamento`);
    } else {
      Alert.alert("Informação", "Todos os favoritos já estão na lista de compartilhamento");
    }
  };

  const handleRemoveFavorite = async (userToRemove: IUser) => {
    if (!uid) return;
    
    Alert.alert(
      "Remover favorito",
      `Deseja remover ${userToRemove.userName} dos favoritos?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          onPress: async () => {
            try {
              await removeFromFavorites(uid, userToRemove.uid);
              setFavoriteUsers(favoriteUsers.filter(u => u.uid !== userToRemove.uid));
              Alert.alert("Sucesso", `${userToRemove.userName} removido dos favoritos`);
            } catch (error) {
              console.error("Erro ao remover favorito:", error);
              Alert.alert("Erro", "Não foi possível remover o favorito. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (!user) return;
    const getUsersInvitedByMe = async () => {
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: user.user?.uid as string,
      });

      const usersThatAcceptInvitation = usersInvitedByMe.filter(
        (u) => u.status === ESharingStatus.ACCEPTED
      );

      setUsersAlreadySharing(usersThatAcceptInvitation);
    };
    getUsersInvitedByMe();
  }, [user]);

  useEffect(() => {
    if (!uid) return;
    const loadFavorites = async () => {
      try {
        console.log("Carregando favoritos para usuário:", uid);
        
        const favorites = await getFavorites(uid);
        console.log("Favoritos carregados:", favorites.length);
        setFavoriteUsers(favorites);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        // Não mostrar alerta aqui para não incomodar o usuário
        setFavoriteUsers([]);
      }
    };
    loadFavorites();
  }, [uid]);

  return (
    <>
      <View>
        <Title
          style={{
            textAlign: "center",
            marginBottom: 10
          }}
        >
          Compartilhar
        </Title>
        <View style={{ width: "100%" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            <CircleContainer onPress={handleOpenModal}>
              <Plus name="plus" />
            </CircleContainer>
            {sharedUsers.map((user, index) => (
              <CircleContainer
                key={index}
                onPress={() => handleToggleSharedUser(user)}
              >
                <Remove name="close" />
                <SubTitle>{getInitials(user.userName)}</SubTitle>
              </CircleContainer>
            ))}
          </ScrollView>
        </View>
      </View>
      <Modal visible={isModalOpen} transparent={true} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ModalContainer>
            <ModalContent>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <HeaderContainer>
                  <SectionTitle>Compartilhar com</SectionTitle>
                </HeaderContainer>

                <Input
                  name="user"
                  placeholder="Buscar usuários"
                  value={searchValue}
                  onChangeText={(text) => {
                    searchUsers(text);
                    setSearchValue(text);
                  }}
                  style={{
                    marginBottom: 15,
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                />
                
                {favoriteUsers.length > 0 && (
                  <FavoritesContainer>
                  <SectionTitle type="primary">Favoritos</SectionTitle>
                    <HeaderContainer>
                      
                      <ActionButtonsContainer>
                        {sharedUsers.length > 0 && (
                          <ActionButton onPress={handleClearSharedUsers}>
                            <ActionButtonText>Limpar Seleção</ActionButtonText>
                          </ActionButton>
                        )}
                        <ActionButton onPress={handleAddAllFavorites}>
                          <ActionButtonText>Adicionar Todos</ActionButtonText>
                        </ActionButton>
                        <ActionButton onPress={handleClearAllFavorites}>
                          <ActionButtonText>Limpar Favoritos</ActionButtonText>
                        </ActionButton>
                      </ActionButtonsContainer>
                    </HeaderContainer>
                    <FavoritesList>
                      {favoriteUsers.map((item) => {
                        const isSelected = sharedUsers.some(u => u.uid === item.uid);
                        return (
                          <View style={{ alignItems: 'center' }} key={item.uid}>
                                  <CircleContainer
                            key={`fav-${item.uid}`}
                            onPress={() =>
                              handleToggleSharedUser({
                                ...item,
                                acceptedAt: usersAlreadySharing.some(
                                  (u) => u.target === item.uid
                                )
                                  ? Timestamp.now()
                                  : null,
                              })
                            }
                            style={{ 
                              borderWidth: isSelected ? 2 : 0,
                              borderColor: '#00ff48',
                              backgroundColor: isSelected ? 'rgba(0, 255, 38, 0.1)' : undefined
                            }}
                          >
                            <SubTitle>{getInitials(item.userName)}</SubTitle>
                            <TouchableOpacity 
                              onPress={(e) => {
                                e.stopPropagation();
                                handleRemoveFavorite(item);
                              }}
                              style={{ 
                                position: 'absolute', 
                                top: -5, 
                                right: -5, 
                                backgroundColor: 'white', 
                                borderRadius: 10,
                                padding: 2,
                                elevation: 4,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                              }}
                            >
                              <Remove name="close" size={12} />
                            
                            </TouchableOpacity>
                          </CircleContainer>
                          <TextCircle>
                                {item.userName}
                              </TextCircle>
                          </View>
                        );
                      })}
                    </FavoritesList>
                  </FavoritesContainer>
                )}
                
                <SectionTitle type="secondary">Todos os usuários</SectionTitle>
                {loading ? (
                  <View style={{ alignItems: 'center', marginVertical: 16 }}>
                    <Title type="secondary">Carregando...</Title>
                  </View>
                ) : (
                  <FlatList
                    data={users}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => {
                      const isChecked = !!sharedUsers.find((u) => u.uid === item.uid);
                      const isFavorite = favoriteUsers.some(u => u.uid === item.uid);
                      return (
                        <ButtonSelect
                          onPress={() =>
                            handleToggleSharedUser({
                              ...item,
                              acceptedAt: usersAlreadySharing.some(
                                (u) => u.target === item.uid
                              )
                                ? Timestamp.now()
                                : null,
                            })
                          }
                          style={{
                            borderLeftWidth: isFavorite ? 3 : 0,
                            borderLeftColor: '#FFD700',
                            backgroundColor: isChecked ? 'rgba(255, 215, 0, 0.05)' : undefined
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title type={isChecked ? "primary" : "secondary"}>
                              {item.userName}
                            </Title>
                            {isFavorite && (
                              <FavoriteIcon
                                name="star"
                                type="primary"
                                style={{ marginLeft: 5 }}
                              />
                            )}
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FavoriteButton
                              onPress={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(item);
                              }}
                            >
                              <FavoriteIcon
                                name={isFavorite ? "star" : "star-outline"}
                                type={isFavorite ? "primary" : "secondary"}
                              />
                            </FavoriteButton>
                            <IconCheck
                              type={isChecked ? "primary" : "secondary"}
                              name={
                                isChecked
                                  ? "checkbox-marked-circle-outline"
                                  : "checkbox-blank-circle-outline"
                              }
                            />
                          </View>
                        </ButtonSelect>
                      );
                    }}
                    style={{ maxHeight: 300 }}
                    scrollEnabled={false}
                  />
                )}
                <CloseButton onPress={handleCloseModal}>
                  <CloseButtonText>Fechar</CloseButtonText>
                </CloseButton>
              </ScrollView>
            </ModalContent>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
