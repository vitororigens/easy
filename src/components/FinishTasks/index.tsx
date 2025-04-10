import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Container, Content, ButtonText } from './styles';

interface FinishTasksProps {
  selectedCount: number;
  onFinish: () => void;
}

export function FinishTasks({ selectedCount, onFinish }: FinishTasksProps) {
  if (selectedCount === 0) return null;

  return (
    <Container>
      <Content>
        <Text style={{ color: '#FFF', fontSize: 16 }}>
          {selectedCount} {selectedCount === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}
        </Text>
        <TouchableOpacity onPress={onFinish}>
          <ButtonText>
            <MaterialIcons name="check-circle" size={24} color="#FFF" />
            <Text style={{ color: '#FFF', marginLeft: 8 }}>Finalizar</Text>
          </ButtonText>
        </TouchableOpacity>
      </Content>
    </Container>
  );
}
