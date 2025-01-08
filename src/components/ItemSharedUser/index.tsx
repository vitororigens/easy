import { useFocusEffect } from "@react-navigation/native";
import {
  deleteSharing,
  ISharing,
  sharingStatusMapper,
} from "../../services/firebase/sharing.firebase";
import { Badge, BadgeText, Container, Content, Icon, Title } from "./styles";
import React, { useCallback, useState } from "react";
import { findUserById, IUser } from "../../services/firebase/users.firestore";
import { TouchableOpacity } from "react-native";

type ItemSharedUserProps = {
  sharing: ISharing;
  onDeleteSharing: (id: string) => void;
};

export function ItemSharedUser({
  sharing,
  onDeleteSharing,
}: ItemSharedUserProps) {
  const [user, setUser] = useState<IUser | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const userData = await findUserById(sharing.target);
          if (isActive) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [sharing.target])
  );

  const handleDeleteSharing = () => {
    deleteSharing(sharing.id);
    onDeleteSharing(sharing.id);
  };

  if (!user) return null;
  return (
    <Container>
      <Title>{user?.userName}</Title>
      <Content>
        <Badge status={sharing.status}>
          <BadgeText status={sharing.status}>
            {sharingStatusMapper[sharing.status]}
          </BadgeText>
        </Badge>
        <TouchableOpacity onPress={handleDeleteSharing}>
          <Icon name="trash-o" />
        </TouchableOpacity>
      </Content>
    </Container>
  );
}
