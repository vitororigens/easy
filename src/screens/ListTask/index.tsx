import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { Button, Content, Divider, Header, NavBar, Title } from "./styles";

import { format } from "date-fns";
import { useTheme } from "styled-components/native";
import { FinishTasks } from "../../components/FinishTasks";
import { HistoryTaskModal } from "../../components/HistoryTaskModal";
import { ItemTask } from "../../components/ItemTask";
import { Items } from "../../components/Items";
import useHistoryTasksCollections from "../../hooks/useHistoryTasksCollection";
import { NewItemTask } from "../NewItemTask";
type SelectedItems = {
  [key: string]: boolean;
};

const modalBottom = Platform.OS === "ios" ? 90 : 70;

export function ListTask() {
  const [activeButton, setActiveButton] = useState("tarefas");
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const data = useMarketplaceCollections("Task");
  const historyData = useHistoryTasksCollections("HistoryTasks");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHistoryTask, setShowHistoryTask] = useState(false);

  const [modalActive, setModalActive] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedListTaskId, setSelectedListTaskId] = useState("");
  const { COLORS } = useTheme();

  const user = useUserAuth();
  const uid = user?.uid;

  const selectedTrueItems = Object.entries(selectedItems)
    .filter(([key, value]) => value)
    .map(([key]) => key);

  const filteredDataSelecteds = data.filter((item) =>
    selectedTrueItems.includes(item.id)
  );

  const historyUser = historyData.filter((item) => item.uid === uid);

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "tarefas") {
    }
    setActiveButton(buttonName);
  };

  // function handleCheckAll() {
  //   const newSelectedItems = {};
  //   data.forEach((item) => {
  //     if (item.uid === uid) {
  //       newSelectedItems[item.id] = true;
  //     }
  //   });
  //   setSelectedItems(newSelectedItems);
  // }

  function handleUncheckAll() {
    setSelectedItems({});
  }

  function openModalHistoryTask(id: string) {
    setShowHistoryTask(true);
    setSelectedListTaskId(id);
  }

  function closeModals() {
    setShowTaskModal(false);
    setShowHistoryTask(false);
  }

  function handleEditItem(documentId: string) {
    setShowTaskModal(true);
    setSelectedItemId(documentId);
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

  function handleDeleteMultipleItems(documentIds: string[]) {
    const batch = database.batch();

    documentIds.forEach((documentId) => {
      const docRef = database.collection("Task").doc(documentId);
      batch.delete(docRef);
    });

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

  function handleFinishTasks() {
    const tasks = filteredDataSelecteds.map((task) => ({
      name: task.name,
      id: task.id,
      createdAt: task.createdAt,
    }));

    const taskIds = tasks.map((task) => task.id);

    database
      .collection("HistoryTasks")
      .doc()
      .set({
        uid,
        tasks,
        finishedDate: format(new Date(), "dd/MM/yyyy"),
      })
      .then(() => {
        handleDeleteMultipleItems(taskIds);
        handleUncheckAll();
        setModalActive(false);
      })
      .catch((error) => {
        console.error("Erro ao finalizar tarefas: ", error);
      });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!filteredDataSelecteds.length) return setModalActive(false);
    setModalActive(true);
  }, [filteredDataSelecteds]);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer newItem>
      <Container type="SECONDARY" title="Lista de tarefas">
        <Content>
          <Header>
            <Divider
              style={{
                alignSelf:
                  activeButton === "tarefas" ? "flex-start" : "flex-end",
              }}
            />
            <NavBar>
              <Button onPress={() => handleButtonClick("tarefas")}>
                <Title>Tarefas</Title>
              </Button>
              <Button onPress={() => handleButtonClick("historico")}>
                <Title>Histórico de tarefas</Title>
              </Button>
            </NavBar>
          </Header>

          {activeButton === "tarefas" && (
            <FlatList
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
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <LoadData
                  image="PRIMARY"
                  title="Desculpe!"
                  subtitle="Você ainda não possui dados para exibir aqui! Comece adicionando uma nova tarefa clicando em Novo +."
                />
              }
            />
          )}

          {activeButton === "historico" && (
            <FlatList
              data={historyUser}
              ListEmptyComponent={
                <LoadData
                  image="PRIMARY"
                  title="Desculpe!"
                  subtitle="Você ainda não possui nenhuma lista de tarefas para exibir aqui! Comece finalizando tarefas e crie sua lista de tarefas."
                />
              }
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
            />
          )}
        </Content>
      </Container>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showTaskModal}
        onRequestClose={closeModals}
      >
        <NewItemTask
          selectedItemId={selectedItemId}
          showButtonSave
          showButtonRemove
          closeBottomSheet={closeModals}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistoryTask}
        onRequestClose={closeModals}
      >
        <HistoryTaskModal
          selectedItemId={selectedListTaskId}
          closeBottomSheet={closeModals}
        />
      </Modal>

      {modalActive && (
        <View
          style={{
            position: "absolute",
            bottom: modalBottom,
            left: 20,
            backgroundColor: COLORS.TEAL_600,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 100,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
          }}
        >
          <FinishTasks
            itemsCount={filteredDataSelecteds.length}
            buttonSave={handleFinishTasks}
          />
        </View>
      )}
    </DefaultContainer>
  );
}
