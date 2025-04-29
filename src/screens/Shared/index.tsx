import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { ButtonSelect, Container, Content, IconCheck, Title, FilterButton, FilterContainer, FilterText } from "./styles";
import { FlatList, View, Text } from "react-native";
import { ItemSharedUser } from "../../components/ItemSharedUser";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  findUserByUsername,
  IUser,
} from "../../services/firebase/users.firestore";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  createSharing,
  ESharingStatus,
  getSharing,
  ISharing,
} from "../../services/firebase/sharing.firebase";
import { Alert } from "react-native";
import { Timestamp } from "@react-native-firebase/firestore";
import { createNotification } from "../../services/firebase/notifications.firebase";

export function Shared() {
  const [sharedUsers, setSharedUsers] = useState<ISharing[]>([]);
  const [receivedShares, setReceivedShares] = useState<ISharing[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  const user = useUserAuth();

  const searchUsers = useDebouncedCallback(async (username: string) => {
    if (!username || !user?.uid) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      const result = await findUserByUsername(username, user.uid);
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Erro", "Não foi possível buscar os usuários");
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const addSharedUser = async (u: IUser) => {
    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    if (sharedUsers.find((su) => su.target === u.uid)) {
      Alert.alert("Aviso", "Este usuário já está na lista de compartilhamento");
      return;
    }

    try {
      setIsLoading(true);
      const now = Timestamp.now();

      // Criar o compartilhamento
      const result = await createSharing({
        invitedBy: user.uid,
        status: ESharingStatus.PENDING,
        target: u.uid,
        createdAt: now,
        updatedAt: now
      });

      const sharingData = {
        id: result.id,
        invitedBy: user.uid,
        status: ESharingStatus.PENDING,
        target: u.uid,
        createdAt: now,
        updatedAt: now
      };

      // Criar a notificação para o usuário alvo
      await createNotification({
        type: "sharing_invite",
        status: "pending",
        sender: user.uid,
        receiver: u.uid,
        createdAt: now,
        title: "Novo convite de compartilhamento",
        description: `${user.displayName || "Um usuário"} quer compartilhar conteúdo com você`,
        source: {
          id: result.id,
          type: "notification"
        }
      });

      setSharedUsers([sharingData, ...sharedUsers]);
      setSearchValue("");
      setUsers([]);
    } catch (error) {
      console.error("Error creating sharing:", error);
      Alert.alert("Erro", "Não foi possível adicionar o usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteSharing = (id: string) => {
    setSharedUsers(sharedUsers.filter((u) => u.id !== id));
  };

  const loadSharedUsers = async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);

      // Buscar compartilhamentos enviados
      const sentSharing = await getSharing({
        profile: "invitedBy",
        uid: user.uid,
      });
      setSharedUsers(sentSharing);

      // Buscar compartilhamentos recebidos
      const receivedSharing = await getSharing({
        profile: "target",
        uid: user.uid,
      });
      setReceivedShares(receivedSharing);
    } catch (error) {
      console.error("Error fetching sharing users:", error);
      Alert.alert("Erro", "Não foi possível carregar os compartilhamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSharedUsers();
  }, [user]);

  return (
    <DefaultContainer title="Compartilhamento" backButton>
      <Container>
        <FilterContainer>
          <FilterButton active={activeTab === 'sent'} onPress={() => setActiveTab('sent')}>
            <FilterText active={activeTab === 'sent'}>Enviados</FilterText>
          </FilterButton>
          <FilterButton active={activeTab === 'received'} onPress={() => setActiveTab('received')}>
            <FilterText active={activeTab === 'received'}>Recebidos</FilterText>
          </FilterButton>
        </FilterContainer>

        {activeTab === 'sent' && (
          <>
            <Input
              name="search"
              placeholder="Buscar usuários"
              value={searchValue}
              onChangeText={(text) => {
                searchUsers(text);
                setSearchValue(text);
              }}
              editable={!isLoading}
            />

            {users && users.length > 0 && (
              <Content>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.uid}
                  renderItem={({ item }) => {
                    const isChecked = !!sharedUsers.find(
                      (u) => u.target === item.uid
                    );
                    return (
                      <ButtonSelect
                        onPress={() => {
                          if (isChecked) return;
                          addSharedUser(item);
                        }}
                        disabled={isLoading}
                      >
                        <Title type={isChecked ? "PRIMARY" : "SECONDARY"}>
                          {item.userName || "Usuário sem nome"}
                        </Title>
                        <IconCheck
                          type={isChecked ? "PRIMARY" : "SECONDARY"}
                          name={
                            isChecked
                              ? "checkbox-marked-circle-outline"
                              : "checkbox-blank-circle-outline"
                          }
                        />
                      </ButtonSelect>
                    );
                  }}
                />
              </Content>
            )}

            <FlatList
              data={sharedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ItemSharedUser sharing={item} onDeleteSharing={onDeleteSharing} />
              )}
              ListEmptyComponent={() => (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text>Nenhum compartilhamento enviado</Text>
                </View>
              )}
            />
          </>
        )}

        {activeTab === 'received' && (
          <FlatList
            data={receivedShares}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemSharedUser sharing={item} onDeleteSharing={onDeleteSharing} />
            )}
            ListEmptyComponent={() => (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text>Nenhum compartilhamento recebido</Text>
              </View>
            )}
          />
        )}
      </Container>
    </DefaultContainer>
  );
}
