import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';
import { useUserAuth } from '../../hooks/useUserAuth';
import { DefaultContainer } from '../../components/DefaultContainer';
import useFirestoreCollectionLoading from "../../hooks/useFirestoreCollectionLoading";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  padding: 20px;
  padding-top: 40px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.XL}px;
  color: ${({ theme }) => theme.COLORS.PURPLE_600};
  margin-bottom: 20px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

const TaskCard = styled.View`
  padding: 15px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

const TaskText = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-bottom: 4px;
`;

const TaskName = styled(TaskText)`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_800};
  margin-bottom: 8px;
`;

const DateText = styled(TaskText)`
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

interface Task {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function History() {
  const { user } = useUserAuth();
  const uid = user?.uid;

  // Carregar tarefas do Firestore
  const { data, loading } = useFirestoreCollectionLoading('Tasks');
  const [searchTerm, setSearchTerm] = useState('');

  const completedTasks = data
    .filter((item: any) => item.uid === uid && item.status)
    .map((item: any) => {
      const createdAt = item.createdAt?.toDate() || new Date();
      const updatedAt = item.updatedAt?.toDate() || new Date();

      // Ajuste de horário subtraindo 3 horas
      createdAt.setHours(createdAt.getHours() - 3);
      updatedAt.setHours(updatedAt.getHours() - 3);

      return {
        id: item.id,
        name: item.name,
        createdAt,
        updatedAt,
      };
    });

  return (
    <DefaultContainer showButtonBack title="Histórico de Tarefas">
      <Container>
        <Title>Histórico de Tarefas</Title>

        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <FlatList
            data={completedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard>
                <TaskName>{item.name}</TaskName>
                <DateText>
                  🕒 Criada: {item.createdAt.toLocaleDateString()}{' '}
                  {item.createdAt.toLocaleTimeString()}
                </DateText>
                <DateText>
                  ✅ Concluída: {item.updatedAt.toLocaleDateString()}{' '}
                  {item.updatedAt.toLocaleTimeString()}
                </DateText>
              </TaskCard>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#6B7280' }}>
                Nenhuma tarefa concluída encontrada.
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </Container>
    </DefaultContainer>
  );
} 