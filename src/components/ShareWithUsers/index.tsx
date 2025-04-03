import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  View,
  TouchableOpacity,
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
} from "../../services/firebase/users.firestore";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Button } from "../Button";
import { Timestamp } from "firebase/firestore";
import {
  ESharingStatus,
  getSharing,
  ISharing,
} from "../../services/firebase/sharing.firebase";

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

interface IShareWithUsers {}

export const ShareWithUsers = ({}: IShareWithUsers) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersAlreadySharing, setUsersAlreadySharing] = useState<ISharing[]>(
    []
  );

  const loggedUser = useUserAuth();

  const uid = loggedUser?.uid;

  const user = useUserAuth();

  const { watch, setValue } = useFormContext<TShareUser>();
  const sharedUsers = watch("sharedUsers");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchValue("");
  };

  const searchUsers = useDebouncedCallback(async (username: string) => {
    if (!username || !user) return;

    try {
      const users = await findUserByUsername(username, user.uid);
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 300);

  const handleToggleSharedUser = (
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
    setValue("sharedUsers", [...sharedUsers, user]);
  };

  useEffect(() => {
    if (!user) return;
    const getUsersInvitedByMe = async () => {
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: user.uid as string,
      });

      const usersThatAcceptInvitation = usersInvitedByMe.filter(
        (u) => u.status === ESharingStatus.ACCEPTED
      );

      setUsersAlreadySharing(usersThatAcceptInvitation);
    };
    getUsersInvitedByMe();
  }, [user]);

  return (
    <>
      <View>
        <Title
          onPress={() => alert("Texto clicado!")}
          style={{
            textAlign: "center",
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
        <ModalContainer>
          <ModalContent>
            <Input
              name="user"
              placeholder="Buscar usuários"
              value={searchValue}
              onChangeText={(text) => {
                searchUsers(text);
                setSearchValue(text);
              }}
            />
            <FlatList
              data={users}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => {
                const isChecked = !!sharedUsers.find((u) => u.uid === item.uid);
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
                  >
                    <Title type={isChecked ? "primary" : "secondary"}>
                      {item.userName}
                    </Title>
                    <IconCheck
                      type={isChecked ? "primary" : "secondary"}
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
            <Button title="Fechar" onPress={handleCloseModal} />
          </ModalContent>
        </ModalContainer>
      </Modal>
    </>
  );
};
