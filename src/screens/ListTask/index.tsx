import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
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

const modalBottom = Platform.OS === "ios" ? 90 : 70;

export function ListTask({ route }: any) {
  const reload = route?.params?.reload;
  const user = useUserAuth();
  const uid = user?.uid;
  const { tasks, loading, deleteTask, toggleTaskCompletion } = useTask();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const { selectedMonth } = useMonth();
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState("tarefas");
  const [isListVisible, setIsListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const { COLORS } = useTheme();

  const historyData = useHistoryTasksCollections("HistoryTasks");
  const historyUser = historyData.filter((item) => item.uid === uid);
  const historyUserMonth = historyUser.filter((item) => {
    const month = getMonth(parse(item.finishedDate, "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  // Filtrar tarefas para cada seção
  const personalTasks = tasks?.filter(task => !task.shareWith || task.shareWith.length === 0) || [];
  const sharedTasks = tasks?.filter(task => task.shareWith && task.shareWith.length > 0) || [];
  const completedTasks = tasks?.filter(task => task.status) || [];

  console.log("Tarefas no ListTask:", tasks);
  console.log("Tarefas pessoais:", personalTasks);
  console.log("Tarefas compartilhadas:", sharedTasks);
  console.log("Tarefas concluídas:", completedTasks);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleEditTask = (taskId: string) => {
    // @ts-ignore
    navigation.navigate("newtask", { selectedTaskId: taskId });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      Toast.show("Tarefa excluída!", { type: "success" });
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

  const handleFinishSelectedTasks = async () => {
    try {
      for (const taskId of selectedTasks) {
        await toggleTaskCompletion(taskId);
      }
      setSelectedTasks([]);
      Toast.show("Tarefas finalizadas com sucesso!", { type: "success" });
    } catch (error) {
      console.error("Erro ao finalizar tarefas:", error);
      Toast.show("Erro ao finalizar tarefas", { type: "error" });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
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
          <ContentTitle onPress={() => setIsListVisible(!isListVisible)}>
            <HeaderContainer>
              <SectionIcon name="checkbox-marked-circle-outline" />
              <Title>Minhas tarefas</Title>
            </HeaderContainer>
            <Icon name={isListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={personalTasks}
                renderItem={({ item }) => (
                  <ItemTask
                    task={item}
                    handleDelete={() => handleDeleteTask(item.id)}
                    handleUpdate={() => handleEditTask(item.id)}
                    isSelected={selectedTasks.includes(item.id)}
                    onSelect={() => handleSelectTask(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
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
          )}

          <ContentTitle onPress={() => setIsSharedListVisible(!isSharedListVisible)}>
            <HeaderContainer>
              <SectionIcon name="share-variant" />
              <Title>Tarefas compartilhadas</Title>
            </HeaderContainer>
            <Icon name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isSharedListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sharedTasks}
                renderItem={({ item }) => (
                  <ItemTask
                    task={item}
                    handleDelete={() => handleDeleteTask(item.id)}
                    handleUpdate={() => handleEditTask(item.id)}
                    isSelected={selectedTasks.includes(item.id)}
                    onSelect={() => handleSelectTask(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <SubTitle>Nenhuma tarefa compartilhada</SubTitle>
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
              data={completedTasks}
              renderItem={({ item }) => (
                <ItemTask
                  task={item}
                  handleDelete={() => handleDeleteTask(item.id)}
                  handleUpdate={() => handleEditTask(item.id)}
                  handleToggleCompletion={() => handleToggleCompletion(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <EmptyContainer>
                  <LoadData
                    imageSrc={PersonImage}
                    title="Nenhuma tarefa concluída"
                    subtitle="Complete algumas tarefas para ver seu histórico"
                  />
                </EmptyContainer>
              }
            />
          </Container>
        </Content>
      )}

      <FinishTasks
        selectedCount={selectedTasks.length}
        onFinish={handleFinishSelectedTasks}
      />

      <Modal
        visible={modalActive}
        transparent
        animationType="slide"
        onRequestClose={() => setModalActive(false)}
      >
        <HistoryTaskModal
          onClose={() => setModalActive(false)}
          tasks={historyUserMonth[0]?.tasks || []}
        />
      </Modal>
    </DefaultContainer>
  );
}
