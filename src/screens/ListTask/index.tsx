import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useMarketplaceCollections } from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useTask } from "../../contexts/TaskContext";
import { ITask } from "../../interfaces/ITask";

import {
  Title,
  ContentTitle,
  Icon,
  Container,
  Content,
  HeaderContainer,
  SectionIcon,
  EmptyContainer,
  Header,
  NavBar,
  Button,
  SubTitle,
  TaskCard,
  TaskName,
  DateText,
} from "./styles";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { format, getMonth, parse } from "date-fns";
import { useTheme } from "styled-components/native";
import PersonImage from "../../assets/illustrations/tasks.png";
import { FinishTasks } from "../../components/FinishTasks";
import { ItemTask } from "../../components/ItemTask";
import { Items } from "../../components/Items";
import { useMonth } from "../../context/MonthProvider";
import useHistoryTasksCollections from "../../hooks/useHistoryTasksCollection";
import { NewItemTask } from "../NewItemTask";
import { database } from "../../libs/firebase";
import { Timestamp } from "@react-native-firebase/firestore";
import { HistoryTaskModal } from "../../components/HistoryTaskModal";
import { createHistoryTasks } from "../../services/firebase/tasks";
import { NativeAdComponent } from "../../components/NativeAd";

const modalBottom = Platform.OS === "ios" ? 90 : 70;

interface HistoryItem {
  id: string;
  name: string;
  finishedDate: string;
  finishedTime: string;
  tasks: Array<{
    id: string;
    name: string;
    createdAt: string | Timestamp;
  }>;
}

export function ListTask({ route }: any) {
  const reload = route?.params?.reload;
  const user = useUserAuth();
  const uid = user.user?.uid;
  const { tasks, loading, deleteTask, toggleTaskCompletion } = useTask();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const { selectedMonth } = useMonth();
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState("tarefas");
  const [isCompletedListVisible, setIsCompletedListVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const { COLORS } = useTheme();

  const historyData = useHistoryTasksCollections("HistoryTasks");
  const historyUser = historyData.filter((item) => item.uid === uid);
  const historyUserMonth = historyUser.filter((item) => {
    const month = getMonth(parse(item.finishedDate, "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  // Combinar todas as tarefas em uma única lista (exceto concluídas)
  const allTasks = tasks?.filter(task => !task.status) || [];
  
  const completedTasks = tasks?.filter(task => task.status) || [];

  console.log("Tarefas no ListTask:", tasks);
  console.log("Todas as tarefas ativas:", allTasks);
  console.log("Tarefas concluídas:", completedTasks);
  
  // Log detalhado da primeira tarefa concluída para debug
  if (completedTasks.length > 0) {
    console.log("Estrutura da primeira tarefa concluída:", JSON.stringify(completedTasks[0], null, 2));
    console.log("Tipo de createdAt:", typeof completedTasks[0].createdAt);
    console.log("Tipo de updatedAt:", typeof completedTasks[0].updatedAt);
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleEditTask = (taskId: string) => {
    // @ts-ignore
    navigation.navigate("newitemtask", { selectedItemId: taskId });
  };

  const handleDeleteTask = async (taskId: string, task?: ITask) => {
    try {
      await deleteTask(taskId, task);
    } catch (error) {
      console.error("Erro ao excluir a tarefa: ", error);
      Toast.show("Erro ao excluir a tarefa", { type: "error" });
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error("Erro ao alternar status da tarefa: ", error);
      Toast.show("Erro ao alternar status da tarefa", { type: "error" });
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      }
      return [...prev, taskId];
    });
  };

  const handleFinishSelectedTasks = async (groupName: string) => {
    try {
      // Primeiro, finaliza todas as tarefas selecionadas
      for (const taskId of selectedTasks) {
        await toggleTaskCompletion(taskId);
      }

      // Pega as informações das tarefas selecionadas
      const selectedTasksInfo = tasks
        .filter(task => selectedTasks.includes(task.id))
        .map(task => {
          let dateStr;
          if (task.createdAt && typeof task.createdAt === 'object') {
            if ('seconds' in task.createdAt) {
              // É um Timestamp do Firestore
              dateStr = new Date(task.createdAt.seconds * 1000).toISOString();
            } else {
              // É um objeto Date
              dateStr = new Date(task.createdAt).toISOString();
            }
          } else {
            // É uma string ou outro formato
            dateStr = new Date().toISOString();
          }

          return {
            id: task.id,
            name: task.name,
            createdAt: dateStr
          };
        });

      const now = new Date();
      const historyData = {
        name: groupName,
        uid: uid,
        finishedDate: format(now, "dd/MM/yyyy"),
        finishedTime: format(now, "HH:mm:ss"),
        tasks: selectedTasksInfo,
        createdAt: Timestamp.now(),
      };

      await database.collection("HistoryTasks").add(historyData);

      setSelectedTasks([]);
      Toast.show("Tarefas finalizadas com sucesso!", { type: "success" });
    } catch (error) {
      console.error("Erro ao finalizar tarefas:", error);
      Toast.show("Erro ao finalizar tarefas", { type: "error" });
    }
  };

  const handleDeleteHistoryTaskHistory = async (itemId: string) => {
    Alert.alert(
      "Excluir histórico",
      "Tem certeza que deseja excluir este item do histórico?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await database.collection("HistoryTasks").doc(itemId).delete();
              Toast.show("Item excluído do histórico!", { type: "success" });
            } catch (error) {
              console.error("Erro ao excluir item do histórico:", error);
              Toast.show("Erro ao excluir item do histórico", { type: "error" });
            }
          }
        }
      ]
    );
  };

  const handleGroupTasks = async (groupName: string) => {
    try {
      await createHistoryTasks(groupName);
      Alert.alert('Sucesso', 'Tarefas agrupadas com sucesso!');
    } catch (error) {
      console.error('Erro ao agrupar tarefas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao agrupar as tarefas.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <DefaultContainer newItem monthButton title="Lista de Tarefas">
        <Header>
          <NavBar>
            <Button
              onPress={() => handleButtonClick("tarefas")}
              active={activeButton === "tarefas"}
              style={{ borderTopLeftRadius: 40 }}
            >
              <Title>Tarefas</Title>
            </Button>
            <Button
              onPress={() => handleButtonClick("historico")}
              active={activeButton === "historico"}
              style={{ borderTopRightRadius: 40 }}
            >
              <Title>Histórico de tarefas</Title>
            </Button>
          </NavBar>
        </Header>

        {activeButton === "tarefas" && (
          <Content>
            <ContentTitle>
              <HeaderContainer>
                <SectionIcon name="checkbox-marked-circle-outline" />
                <Title>Lista de Tarefas</Title>
              </HeaderContainer>
            </ContentTitle>
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={allTasks}
                renderItem={({ item, index }) => (
                  <View>
                    <ItemTask
                      task={item}
                      handleDelete={() => handleDeleteTask(item.id, item)}
                      handleUpdate={() => handleEditTask(item.id)}
                      isSelected={selectedTasks.includes(item.id)}
                      onSelect={() => handleSelectTask(item.id)}
                    />
                    {index % 5 === 0 && index !== 0 && (
                      <NativeAdComponent style={{ marginVertical: 10 }} />
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <LoadData
                      imageSrc={PersonImage}
                      title="Comece agora!"
                      subtitle="Adicione uma tarefa clicando em +"
                    />
                  </EmptyContainer>
                }
              />
            </Container>
         
            {isCompletedListVisible && completedTasks.length > 0 && (
              <Container>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={completedTasks}
                  renderItem={({ item, index }) => (
                    <View>
                      <ItemTask
                        task={item}
                        handleDelete={() => handleDeleteTask(item.id)}
                        handleUpdate={() => handleEditTask(item.id)}
                        isSelected={selectedTasks.includes(item.id)}
                        onSelect={() => handleSelectTask(item.id)}
                      />
                      {index % 5 === 0 && index !== 0 && (
                        <NativeAdComponent style={{ marginVertical: 10 }} />
                      )}
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <EmptyContainer>
                      <SubTitle>Nenhuma tarefa concluída</SubTitle>
                    </EmptyContainer>
                  }
                />
              </Container>
            )}
          </Content>
        )}

        {activeButton === "historico" && (
          <Content>
            <ContentTitle>
              <HeaderContainer>
                <SectionIcon name="history" />
                <Title>Histórico de tarefas</Title>
              </HeaderContainer>
            </ContentTitle>
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={historyUserMonth}
                renderItem={({ item }) => (
                  <TaskCard onPress={() => {
                    setModalActive(true);
                    setSelectedHistoryItem(item);
                  }}>
                    <TaskName>{item.name}</TaskName>
                    <DateText>
                      📅 Finalizado em: {item.finishedDate} às {item.finishedTime}
                    </DateText>
                    <DateText>
                      ✅ Total de tarefas: {item.tasks.length}
                    </DateText>
                    <TouchableOpacity 
                      onPress={() => handleDeleteHistoryTaskHistory(item.id)}
                      style={{ position: 'absolute', right: 10, top: 10 }}
                    >
                      <Icon name="delete" size={24} color={COLORS.RED_700} />
                    </TouchableOpacity>
                  </TaskCard>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <LoadData
                      imageSrc={PersonImage}
                      title="Nenhum conjunto de tarefas"
                      subtitle="Finalize algumas tarefas para ver seu histórico"
                    />
                  </EmptyContainer>
                }
              />
            </Container>
          </Content>
        )}

        <FinishTasks
          selectedCount={selectedTasks.length}
          onFinish={(groupName: string) => handleFinishSelectedTasks(groupName)}
        />

        <Modal
          visible={modalActive}
          transparent
          animationType="slide"
          onRequestClose={() => setModalActive(false)}
        >
          {selectedHistoryItem && (
            <HistoryTaskModal
              onClose={() => setModalActive(false)}
              groupName={selectedHistoryItem.name}
              finishedDate={selectedHistoryItem.finishedDate}
              finishedTime={selectedHistoryItem.finishedTime}
              tasks={selectedHistoryItem.tasks.map(task => ({
                ...task,
                createdAt: typeof task.createdAt === 'string' 
                  ? task.createdAt 
                  : new Date(task.createdAt.toDate()).toISOString()
              }))}
            />
          )}
        </Modal>
      </DefaultContainer>
    </KeyboardAvoidingView>
  );
}
