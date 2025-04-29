import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { ButtonSelect, Container, Content, IconCheck, Title, FilterButton, FilterContainer, FilterText } from "./styles";
import { FlatList, View, Text } from "react-native";
import { ItemSharedUser } from "../../components/ItemSharedUser";
import { useEffect, useState, useCallback } from "react";
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
import { Loading } from '../../components/Loading';
import { EmptyList } from '../../components/EmptyList';

export function Shared() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [sharings, setSharings] = useState<ISharing[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");

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

    if (sharings.find((su) => su.target === u.uid)) {
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

      setSharings([sharingData, ...sharings]);
      setSearchValue("");
      setUsers([]);
    } catch (error) {
      console.error("Error creating sharing:", error);
      Alert.alert("Erro", "Não foi possível adicionar o usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSharings = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const profile = activeTab === 'sent' ? 'invitedBy' : 'target';
      const response = await getSharing({ uid: user.uid, profile });
      setSharings(response);
    } catch (error) {
      console.error('Error loading sharings:', error);
      Alert.alert('Erro', 'Não foi possível carregar os compartilhamentos');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, activeTab]);

  useEffect(() => {
    loadSharings();
  }, [loadSharings]);

  const handleDeleteSharing = (id: string) => {
    setSharings(prev => prev.filter(sharing => sharing.id !== id));
  };

  const handleTabPress = (tab: 'sent' | 'received') => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DefaultContainer title="Compartilhamento" backButton>
      <Container>
        <FilterContainer>
          <FilterButton active={activeTab === 'sent'} onPress={() => handleTabPress('sent')}>
            <FilterText active={activeTab === 'sent'}>Enviados</FilterText>
          </FilterButton>
          <FilterButton active={activeTab === 'received'} onPress={() => handleTabPress('received')}>
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
                    const isChecked = !!sharings.find(
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
              data={sharings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ItemSharedUser
                  sharing={item}
                  onDeleteSharing={handleDeleteSharing}
                  onStatusChange={loadSharings}
                />
              )}
              ListEmptyComponent={() => (
                <EmptyList
                  message={
                    activeTab === 'sent'
                      ? 'Você ainda não compartilhou com ninguém'
                      : 'Você ainda não recebeu compartilhamentos'
                  }
                />
              )}
            />
          </>
        )}

        {activeTab === 'received' && (
          <FlatList
            data={sharings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemSharedUser
                sharing={item}
                onDeleteSharing={handleDeleteSharing}
                onStatusChange={loadSharings}
              />
            )}
            ListEmptyComponent={() => (
              <EmptyList
                message={
                  activeTab === 'sent'
                    ? 'Você ainda não compartilhou com ninguém'
                    : 'Você ainda não recebeu compartilhamentos'
                }
              />
            )}
          />
        )}
      </Container>
    </DefaultContainer>
  );
}
