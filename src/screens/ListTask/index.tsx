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
  Button,
  Header,
  NavBar,
  Title,
  ContentTitle,
  Icon,
  DividerContent,
  Container,
  SubTitle,
  SubTitleSharing,
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

type SelectedItems = {
  [key: string]: boolean;
};

export interface ITask {
  id: string;
  uid: string;
  createdAt: Timestamp;
  name: string;
  type: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

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
  const [tasksSharedByMe, setTasksSharedByMe] = useState<ITask[]>([]);
  const [tasksSharedWithMe, setTasksSharedWithMe] = useState<ITask[]>([]);
  const { COLORS } = useTheme();

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

  if (isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer newItem monthButton title="Lista de Tarefas">
      <Header>
        <NavBar>
          <Button
            onPress={() => handleButtonClick("tarefas")}
            active={activeButton !== "tarefas"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Tarefas</Title>
          </Button>
          <Button
            onPress={() => handleButtonClick("historico")}
            active={activeButton !== "historico"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Histórico de tarefas</Title>
          </Button>
        </NavBar>
      </Header>

      {activeButton === "tarefas" && (
        <>
          <ScrollView>
            <ContentTitle onPress={() => setIsMyListVisible(!isMyListVisible)}>
              <Title>Minhas tarefas</Title>
              <DividerContent />
              <Icon
                name={isMyListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>
            {isMyListVisible && (
              <FlatList
                style={{
                  marginTop: !!data.filter((item) => item.uid === uid).length
                    ? 16
                    : 0,
                }}
                data={data.filter((item) => item.uid === uid)}
                renderItem={({ item }) => (
                  <ItemTask
                    onEdit={() => handleEditItem(item.id)}
                    onDelete={() => handleDeleteItem(item.id)}
                    title={item.name}
                    isChecked={selectedItems[item.id] || false}
                    onToggle={() => {
                      setSelectedItems((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }));
                    }}
                  />
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <LoadData
                    imageSrc={PersonImage}
                    title="Comece agora!"
                    subtitle="Adicione uma tarefa clicando em +"
                    width={300}
                  />
                }
                ListFooterComponent={<View style={{ height: 90 }} />}
              />
            )}
            <ContentTitle
              isSharedTasks
              onPress={() => setIsSharedListVisible(!isSharedListVisible)}
            >
              <Title>Tarefas compartilhadas</Title>
              <DividerContent />
              <Icon
                name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>
            {isSharedListVisible && (
              <>
                <FlatList
                  style={{
                    marginTop: !!data.filter((item) => item.uid === uid).length
                      ? 16
                      : 0,
                  }}
                  data={tasksSharedByMe.concat(tasksSharedWithMe)}
                  renderItem={({ item }) => (
                    <ItemTask
                      onEdit={() => handleEditItem(item.id)}
                      onDelete={() => handleDeleteItem(item.id)}
                      title={item.name}
                      isChecked={selectedItems[item.id] || false}
                      onToggle={() => {
                        setSelectedItems((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }));
                      }}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 90 }}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <View
                      style={{
                        padding: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SubTitleSharing>
                        Você não possui tarefas compartilhadas com você
                      </SubTitleSharing>
                    </View>
                  }
                  ListFooterComponent={<View style={{ height: 90 }} />}
                />
              </>
            )}

            {modalActive && (
              <View
                style={{
                  backgroundColor: COLORS.TEAL_600,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  height: 100,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 10,
                  marginTop: 20,
                  marginBottom: 0,
                }}
              >
                <FinishTasks
                  itemsCount={filteredDataSelecteds.length}
                  buttonSave={handleFinishTasks}
                />
              </View>
            )}
          </ScrollView>
        </>
      )}

      {activeButton === "historico" && (
        <>
          <ContentTitle
            onPress={() => setisMyHistoricVisible(!isMyHistoricVisible)}
          >
            <Title>Meu histórico de tarefas</Title>
            <DividerContent />
            <Icon
              name={isMyHistoricVisible ? "arrow-drop-up" : "arrow-drop-down"}
            />
          </ContentTitle>
          {isMyHistoricVisible && (
            <FlatList
              style={{ marginTop: !!historyUserMonth.length ? 16 : 0 }}
              data={historyUserMonth}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModalHistoryTask(item.id)}>
                  <Items
                    showItemTask
                    category="lista de tarefas"
                    customStatusText="Finalizada"
                    status={true}
                    hasEdit={false}
                    date={item.finishedDate}
                    onDelete={() => handleDeleteHistoryTasks(item.id)}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 1000 }}
              ListEmptyComponent={
                <LoadData
                  imageSrc={PersonImage}
                  title="Oops!"
                  subtitle="Você ainda não possui dados para exibir aqui! Comece adicionando tarefas e crie sua lista de tartefas"
                  width={300}
                />
              }
            />
          )}
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showTaskModal}
        onRequestClose={closeModals}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <NewItemTask
            selectedItemId={selectedItemId}
            showButtonSave
            showButtonRemove
            closeBottomSheet={closeModals}
          />
        </View>
      </Modal>
    </DefaultContainer>
  );
}
