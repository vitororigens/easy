import { Modal, FlatList } from 'react-native';
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
  GroupName,
} from './styles';
import { useRoute, useNavigation } from '@react-navigation/native';

type HistoryTaskModalParams = {
  onClose: () => void;
  groupName: string;
  finishedDate: string;
  finishedTime: string;
  tasks: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
};

export function HistoryTaskModal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { onClose, groupName, finishedDate, finishedTime, tasks } = route.params as HistoryTaskModalParams;
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

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

          <GroupName>{groupName}</GroupName>
          <TaskDate>Finalizado em: {finishedDate} às {finishedTime}</TaskDate>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <TaskItem>
                  <TaskName>{item.name}</TaskName>
                  <TaskDate>
                    Criada em: {date} às {time}
                  </TaskDate>
                </TaskItem>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </Content>
      </Container>
    </Modal>
  );
}
