import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ITask } from "../../interfaces/ITask";
import {
  Container,
  Content,
  Title,
  Description,
  Actions,
  ActionButton,
  Checkbox,
  CheckboxContainer,
  ShareBadge,
  ShareIcon,
  ShareText,
} from "./styles";
import { useUserAuth } from "../../hooks/useUserAuth";

interface ItemTaskProps {
  task: ITask;
  handleDelete: () => void;
  handleUpdate: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function ItemTask({
  task,
  handleDelete,
  handleUpdate,
  isSelected,
  onSelect,
}: ItemTaskProps) {
  const { user } = useUserAuth();
  
  console.log("ItemTask recebeu a tarefa:", task);

  // Verificar se é uma tarefa compartilhada
  const isShared = task.shareWith && task.shareWith.length > 0;
  const isSharedByMe = isShared && task.uid === user?.uid;

  return (
    <Container>
      <Content>
        <CheckboxContainer onPress={onSelect}>
          <Checkbox checked={isSelected}>
            {isSelected && (
              <MaterialIcons name="check" size={16} color="#FFF" />
            )}
          </Checkbox>
        </CheckboxContainer>
        <TouchableOpacity onPress={handleUpdate} style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Title status={task.status}>{task.name}</Title>
            {isShared && (
              <ShareBadge isSharedByMe={isSharedByMe}>
                <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
              </ShareBadge>
            )}
          </View>
          <Description status={task.status}>{task.description}</Description>
          {isShared && (
            <ShareText>
              {isSharedByMe ? "Compartilhado por você" : "Compartilhado com você"}
            </ShareText>
          )}
        </TouchableOpacity>
        <Actions>
          <ActionButton onPress={handleUpdate}>
            <MaterialIcons name="edit" size={24} color="#6B7280" />
          </ActionButton>
          <ActionButton onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#EF4444" />
          </ActionButton>
        </Actions>
      </Content>
    </Container>
  );
}
