import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Container, Content, ButtonText } from './styles';

interface FinishTasksProps {
  selectedCount: number;
  onFinish: (groupName: string) => void;
}

export function FinishTasks({ selectedCount, onFinish }: FinishTasksProps) {
  const [groupName, setGroupName] = useState('');

  if (selectedCount === 0) return null;

  return (
    <Container>
      <Content>
        <Text style={{ color: '#FFF', fontSize: 16 }}>
          {selectedCount} {selectedCount === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <TextInput
            placeholder="Nome do grupo"
            placeholderTextColor="#FFF"
            value={groupName}
            onChangeText={setGroupName}
            style={{
              color: '#FFF',
              borderBottomWidth: 1,
              borderBottomColor: '#FFF',
              marginRight: 8,
              flex: 1
            }}
          />
          <TouchableOpacity onPress={() => onFinish(groupName || 'Grupo de Tarefas')}>
            <ButtonText>
              <MaterialIcons name="check-circle" size={24} color="#FFF" />
              <Text style={{ color: '#FFF', marginLeft: 8 }}>Finalizar</Text>
            </ButtonText>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  );
}
