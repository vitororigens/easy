import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { ButtonSelect, Container, Content, IconCheck, Title } from "./styles";
import { FlatList } from "react-native";
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

export function Shared() {
  const [sharedUsers, setSharedUsers] = useState<ISharing[]>([]);

  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const user = useUserAuth();

  const searchUsers = useDebouncedCallback(async (username: string) => {
    if (!username || !user) return;

    try {
      const result = await findUserByUsername(username, user.uid);
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 300);

  const addSharedUser = async (u: IUser) => {
    if (sharedUsers.find((su) => su.invitedBy === u.uid)) return;
    if (!user) return;

    const result = await createSharing({
      invitedBy: user.uid,
      status: ESharingStatus.PENDING,
      target: u.uid,
    });
    setSharedUsers([result, ...sharedUsers]);
    setSearchValue("");
    setUsers([]);
  };

  const onDeleteSharing = (id: string) => {
    setSharedUsers(sharedUsers.filter((u) => u.id !== id));
  };

  useEffect(() => {
    if (!user) return;
    const getSharingUsers = async () => {
      const sharing = await getSharing({
        profile: "invitedBy",
        uid: user.uid as string,
      });

      setSharedUsers(sharing);
    };
    getSharingUsers();
  }, [user]);

  return (
    <DefaultContainer title="Compartilhamento" backButton>
      <Container>
        <Input
          name="search"
          placeholder="Buscar usuários"
          value={searchValue}
          onChangeText={(text) => {
            searchUsers(text);
            setSearchValue(text);
          }}
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
                  >
                    <Title type={isChecked ? "PRIMARY" : "SECONDARY"}>
                      {item.userName}
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
        />
      </Container>
    </DefaultContainer>
  );
}
