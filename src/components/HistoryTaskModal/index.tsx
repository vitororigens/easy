import React from 'react';
import { Modal, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import {
  Container,
  Content,
  Header,
  Title,
  CloseButton,
  TaskItem,
  TaskName,
  TaskDate,
} from './styles';

interface HistoryTaskModalProps {
  onClose: () => void;
  tasks: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

export function HistoryTaskModal({ onClose, tasks }: HistoryTaskModalProps) {
  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Container>
        <Content>
          <Header>
            <Title>Tarefas Finalizadas</Title>
            <CloseButton onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </CloseButton>
          </Header>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem>
                <TaskName>{item.name}</TaskName>
                <TaskDate>Finalizada em: {item.createdAt}</TaskDate>
              </TaskItem>
            )}
            showsVerticalScrollIndicator={false}
          />
        </Content>
      </Container>
    </Modal>
  );
}
