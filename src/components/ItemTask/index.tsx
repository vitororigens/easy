import React from "react";
import { TouchableOpacity } from "react-native";
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
} from "./styles";

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
  console.log("ItemTask recebeu a tarefa:", task);

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
          <Title status={task.status}>{task.name}</Title>
          <Description status={task.status}>{task.description}</Description>
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
