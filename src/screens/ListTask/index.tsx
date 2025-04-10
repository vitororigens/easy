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
import {
  listTasksSharedByMe,
  listTaskSharedWithMe,
} from "../../services/firebase/tasks";
import { Timestamp } from "firebase/firestore";
import { useTask } from "../../contexts/TaskContext";
import { ITask } from "../../interfaces/ITask";
import { ITask as IFirebaseTask } from "../../services/firebase/tasks";

type SelectedItems = {
  [key: string]: boolean;
};

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

const modalBottom = Platform.OS === "ios" ? 90 : 70;

export function ListTask({ route }: any) {
  const reload = route?.params?.reload;
  const user = useUserAuth();
  const uid = user?.uid;

  const { selectedMonth } = useMonth();
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState("tarefas");
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const data = useMarketplaceCollections("Task");
  const historyData = useHistoryTasksCollections("HistoryTasks");

  const [currentUid, setCurrentUid] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHistoryTask, setShowHistoryTask] = useState(false);

  const [modalActive, setModalActive] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedListTaskId, setSelectedListTaskId] = useState("");
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);
  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isMyHistoricVisible, setisMyHistoricVisible] = useState(true);
  const [tasksSharedByMe, setTasksSharedByMe] = useState<IFirebaseTask[]>([]);
  const [tasksSharedWithMe, setTasksSharedWithMe] = useState<IFirebaseTask[]>([]);
  const { COLORS } = useTheme();

  const { tasks, loading, deleteTask, toggleTaskCompletion } = useTask();
  const [isListVisible, setIsListVisible] = useState(true);

  const selectedTrueItems = Object.entries(selectedItems)
    .filter(([key, value]) => value)
    .map(([key]) => key);

  const filteredDataSelecteds = data.filter((item) =>
    selectedTrueItems.includes(item.id)
  );

  const historyUser = historyData.filter((item) => item.uid === uid);

  const historyUserMonth = historyUser.filter((item) => {
    const month =
      getMonth(parse(item.finishedDate, "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "tarefas") {
    }
    setActiveButton(buttonName);
  };

  function handleUncheckAll() {
    setSelectedItems({});
  }

  function openModalHistoryTask(documentId: string) {
    navigation.navigate("historytask", { selectedItemId: documentId });
  }

  function closeModals() {
    setShowTaskModal(false);
    setShowHistoryTask(false);
  }

  function handleEditItem(documentId: string) {
    navigation.navigate("newitemtask", { selectedItemId: documentId });
  }

  function handleDeleteItem(documentId: string) {
    database
      .collection("Task")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Nota excluída!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a nota: ", error);
      });
  }

  function handleDeleteFilteredItem(documentId: string) {
    const batch = database.batch();

    const docRef = database.collection("Task").doc(documentId);
    batch.delete(docRef);

    batch
      .commit()
      .then(() => {
        Toast.show("Tarefas finalizadas!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir as tarefas: ", error);
      });
  }

  function handleDeleteHistoryTasks(documentId: string) {
    database
      .collection("HistoryTasks")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Lista de tarefas excluída!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a lista de tarefas: ", error);
      });
  }

  async function handleFinishTasks() {
    const tasks = filteredDataSelecteds.map((task) => ({
      name: task.name,
      id: task.id,
      createdAt: task.createdAt,
    }));

    const taskIds = tasks.map((task) => task.id);

    for (const foundTasksById of taskIds) {
      const doc = await database.collection("Task").doc(foundTasksById).get();

      if (doc.exists) {
        const taskData = doc.data();

        const shareInfo = taskData?.shareInfo || [];

        if (taskData?.uid === user?.uid) {
          await database
            .collection("Task")
            .doc(foundTasksById)
            .update({ finished: true });

          const allShareInfosTrue = taskData?.shareInfo.every(
            (item: any) => item.finished === true
          );

          if (allShareInfosTrue) {
            await database
              .collection("HistoryTasks")
              .doc(foundTasksById)
              .set({
                uid,
                tasks,
                finishedDate: format(new Date(), "dd/MM/yyyy"),
              })
              .then(() => {
                handleDeleteFilteredItem(foundTasksById);
                handleUncheckAll();
                setModalActive(false);
              })
              .catch((error) => {
                console.error("Erro ao finalizar tarefa: ", error);
              });
          }
        } else {
          const updatedShareInfo = shareInfo.map((item: any) => {
            if (item.uid === user?.uid) {
              return {
                ...item,
                finished: true,
              };
            }
            return item;
          });

          await database
            .collection("Tasks")
            .doc(foundTasksById)
            .update({ shareInfo: updatedShareInfo });
        }

        const allShareInfosTrue = taskData?.shareInfo.every(
          (item: any) => item.finished === true
        );

        if (taskData?.finished === true && allShareInfosTrue === true) {
          database
            .collection("HistoryTasks")
            .doc(foundTasksById)
            .set({
              uid,
              tasks,
              finishedDate: format(new Date(), "dd/MM/yyyy"),
            })
            .then(() => {
              handleDeleteFilteredItem(foundTasksById);
              handleUncheckAll();
              setModalActive(false);
            })
            .catch((error) => {
              console.error("Erro ao finalizar tarefas: ", error);
            });
        }
      }
    }
  }
  const fetchTasks = async () => {
    if (!uid) return;
    try {
      setIsLoaded(true);
      const [mTasks, sTasks] = await Promise.all([
        listTasksSharedByMe(uid),
        listTaskSharedWithMe(uid),
      ]);

      setTasksSharedWithMe(sTasks);
      setTasksSharedByMe(mTasks);
    } catch (err) {
      setIsLoaded(false);
      console.error("Erro ao buscar as notas: ", err);
    } finally {
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [uid]);

  useEffect(() => {
    if (!filteredDataSelecteds.length) return setModalActive(false);
    setModalActive(true);
  }, [filteredDataSelecteds]);

  useFocusEffect(
    useCallback(() => {
      if (reload) {
        fetchTasks();
      }
    }, [reload])
  );

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

  if (loading) {
    return <Loading />;
  }

  // Filtrar tarefas para cada seção
  const personalTasks = tasks?.filter(task => !task.shareWith || task.shareWith.length === 0) || [];
  const sharedTasks = tasks?.filter(task => task.shareWith && task.shareWith.length > 0) || [];
  const completedTasks = tasks?.filter(task => task.status) || [];

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
                    handleToggleCompletion={() => handleToggleCompletion(item.id)}
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
                    handleToggleCompletion={() => handleToggleCompletion(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <SubTitle>
                      Você não possui tarefas compartilhadas
                    </SubTitle>
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
    </DefaultContainer>
  );
}
