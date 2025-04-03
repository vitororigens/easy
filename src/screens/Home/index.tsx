import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Items } from "../../components/Items";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useTotalValue } from "../../hooks/useTotalValue";
import { useUserAuth } from "../../hooks/useUserAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import { Timestamp } from "firebase/firestore";
import {
  Button,
  ContainerItems,
  Header,
  NavBar,
  SubTitle,
  Title,
  ContentTitle,
  DividerContent,
  Icon,
  SharingSubTitle,
  Container,
} from "./styles";

import { useNavigation } from "@react-navigation/native";
import ExpensePersonImage from "../../assets/illustrations/expense.png";
import RevenuePersonImage from "../../assets/illustrations/revenue.png";
import { database } from "../../libs/firebase";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IRevenue {
  id: string;
  status: boolean;
  createdAt: Timestamp;
  name: string;
  author: string;
  type: string;
  date: string;
  repeat: boolean;
  description: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
  valueTransaction: string;
}

export function Home() {
  const user = useUserAuth();
  const uid = user?.uid;
  const [activeButton, setActiveButton] = useState("receitas");
  const { selectedMonth } = useMonth();
  const revenue = useFirestoreCollection("Revenue");
  const expense = useFirestoreCollection("Expense");
  const { tolalRevenueMunth, totalExpenseMunth } = useTotalValue(
    uid || "Não foi possivel encontrar o uid"
  );
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);
  const [isSharedRevenueListVisible, setSharedRevenueListVisible] =
    useState(false);
  const [revenueShareByMe, setRevenueSharedByMe] = useState<IRevenue[]>([]);
  const [revenueShareWithMe, setRevenueSharedWithMe] = useState<IRevenue[]>([]);
  const [expenseSharedByMe, setExpenseSharedByMe] = useState<IRevenue[]>([]);
  const [expensesSharedWithMe, setExpensesSharedWithme] = useState<IRevenue[]>(
    []
  );
  const [revenues, setRevenues] = useState<IRevenue[]>([]);
  const [expenses, setExpenses] = useState<IRevenue[]>([]);

  useEffect(() => {
    getRevenuesSharedByMe();
    // getExpenseSharedByMe();
    setIsLoaded(true);
  }, []);

  const navigation = useNavigation();

  const formattedRevenue = tolalRevenueMunth.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedExpense = totalExpenseMunth.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalValue = tolalRevenueMunth - totalExpenseMunth;
  const formattedTotalValue = totalValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  function handleNewTaskModal() {
    setShowNewTaskModal(true);
  }

  function closeNewTaskModal() {
    setShowNewTaskModal(false);
  }

  function handleRevenueEdit(documentId: string, initialActiveButton: string) {
    navigation.navigate("newtask", {
      selectedItemId: documentId,
      initialActiveButton,
    });
  }

  function handleExpenseEdit(documentId: string, initialActiveButton: string) {
    navigation.navigate("newtask", {
      selectedItemId: documentId,
      initialActiveButton,
    });
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  function handleDeleteRevenue(documentId: string) {
    database
      .collection("Revenue")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Nota excluída!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a nota: ", error);
      });
  }

  const handleDeleteItem = (documentId: string, type: string) => {
    if (type === "input") {
      database
        .collection("Revenue")
        .doc(documentId)
        .delete()
        .then(() => {
          Toast.show("Nota excluída!", { type: "success" });
        })
        .catch((error) => {
          console.error("Erro ao excluir a nota: ", error);
        });
      // setRevenueSharedByMe((prev) => prev.filter((n) => n.id !== documentId));
      // setExpenseSharedByMe((prev) => prev.filter((n) => n.id !== documentId));
    } else {
      database
        .collection("Expense")
        .doc(documentId)
        .delete()
        .then(() => {
          Toast.show("Nota excluída!", { type: "success" });
        })
        .catch((error) => {
          console.error("Erro ao excluir a nota: ", error);
        });

      // setRevenueSharedByMe((prev) => prev.filter((n) => n.id !== documentId));
      // setExpenseSharedByMe((prev) => prev.filter((n) => n.id !== documentId));
    }
  };

  async function getRevenuesSharedByMe() {
    if (!uid) return;
    try {
      const data = await database
        .collection("Revenue")
        .where("uid", "==", uid)
        .get();

      const revenues = data.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as IRevenue))
        .filter(
          (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
        );

      setRevenueSharedByMe(revenues);
    } catch (err) {
      return err;
    }
  }

  async function getRevenuesSharedWithMe() {
    if (!uid) return;
    try {
      const data = await database
        .collection("Revenue")
        .where("shareWith", "array-contains", uid)
        .get();

      const revenues = (data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) ?? []) as IRevenue[];

      const filteredRevenues = revenues.filter((n) =>
        n.shareInfo.some(
          ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
        )
      );

      setRevenueSharedWithMe(filteredRevenues);
    } catch (err) {
      return err;
    }
  }

  async function getExpenseSharedByMe() {
    if (!uid) return;
    try {
      const data = await database
        .collection("Expense")
        .where("uid", "==", uid)
        .get();

      const expenses = data.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as IRevenue))
        .filter(
          (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
        );

      setExpenseSharedByMe(expenses);
    } catch (err) {
      return err;
    }
  }

  async function getExpenseSharedWithMe() {
    if (!uid) return;
    try {
      const data = await database
        .collection("Expense")
        .where("shareWith", "array-contains", uid)
        .get();

      const expenses = (data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) ?? []) as IRevenue[];

      const filteredExpenses = expenses.filter((n) =>
        n.shareInfo.some(
          ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
        )
      );

      setExpensesSharedWithme(filteredExpenses);
    } catch (err) {
      return err;
    }
  }

  useEffect(() => {
    getRevenuesSharedByMe();
    getExpenseSharedByMe();
    getRevenuesSharedWithMe();
    getExpenseSharedWithMe();
  }, [uid, expense, revenue]);

  function handleDeleteExpense(documentId: string) {
    database
      .collection("Expense")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Nota excluída!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a nota: ", error);
      });
  }

  function handleCreateItem(documentId: string, initialActiveButton: string) {
    navigation.navigate("newtask", {
      selectedItemId: documentId,
      initialActiveButton,
    });
  }

  // useEffect(() => {}, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  const filteredRevenue = revenue.filter(
    (item) => item.uid === uid && item.month === selectedMonth
  );
  const filteredExpense = expense.filter(
    (item) => item.uid === uid && item.month === selectedMonth
  );

  return (
    <DefaultContainer
      monthButton
      title={activeButton === "receitas" ? "Receitas" : "Despesas"}
      type="SECONDARY"
      subtitle={formattedTotalValue}
      addActionFn={() => handleCreateItem(selectedItemId, activeButton)}
    >
      <Header>
        <NavBar>
          <Button
            onPress={() => handleButtonClick("receitas")}
            active={activeButton !== "receitas"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Receitas</Title>
            <SubTitle type="PRIMARY">{formattedRevenue}</SubTitle>
          </Button>
          <Button
            onPress={() => handleButtonClick("despesas")}
            active={activeButton !== "despesas"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Despesas</Title>
            <SubTitle type="SECONDARY">{formattedExpense}</SubTitle>
          </Button>
        </NavBar>
      </Header>
      {activeButton === "receitas" && (
        <>
          <ContainerItems>
            {filteredRevenue.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {!isSharedRevenueListVisible && (
                  <LoadData
                    imageSrc={RevenuePersonImage}
                    title="Comece agora!"
                    subtitle="Adicione uma receita clicando em +"
                  />
                )}
              </View>
            ) : (
              <FlatList
                style={{ marginTop: 16 }}
                data={filteredRevenue}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleRevenueEdit(item.id, activeButton)}
                  >
                    <Items
                      onDelete={() => handleDeleteItem(item.id, item.type)}
                      onEdit={() => handleRevenueEdit(item.id, activeButton)}
                      showItemTaskRevenue
                      type={item.type}
                      category={item.name}
                      date={item.date}
                      repeat={item.repeat}
                      valueTransaction={
                        item.valueTransaction
                          ? formatCurrency(item.valueTransaction ?? "0")
                          : formatCurrency("0")
                      }
                    />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
                ListFooterComponent={<View style={{ height: 90 }} />}
              />
            )}
          </ContainerItems>
          <ContentTitle
            onPress={() =>
              setSharedRevenueListVisible(!isSharedRevenueListVisible)
            }
          >
            <Title>Despesas e receitas compartilhadas</Title>

            <DividerContent />
            <Icon
              name={
                isSharedRevenueListVisible ? "arrow-drop-up" : "arrow-drop-down"
              }
            />
          </ContentTitle>

          {isSharedRevenueListVisible && (
            <Container>
              <FlatList
                style={{ marginTop: 16 }}
                data={revenueShareByMe.concat(revenueShareWithMe)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleExpenseEdit(item.id, activeButton)}
                  >
                    <Items
                      onDelete={() => handleDeleteItem(item.id, item.type)}
                      onEdit={() => handleExpenseEdit(item.id, activeButton)}
                      showItemTask
                      status={item.status}
                      type={item.type}
                      category={item.name}
                      date={item.date}
                      repeat={item.repeat}
                      valueTransaction={
                        item.valueTransaction
                          ? formatCurrency(item.valueTransaction ?? "0")
                          : formatCurrency("0")
                      }
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
                ListFooterComponent={<View style={{ height: 10 }} />}
              />
            </Container>
          )}
        </>
      )}
      {activeButton === "despesas" && (
        <>
          <ContainerItems>
            {filteredExpense.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {!isSharedListVisible && (
                  <LoadData
                    imageSrc={ExpensePersonImage}
                    title="Comece agora!"
                    subtitle="Adicione uma despesa clicando em +"
                  />
                )}
              </View>
            ) : (
              <FlatList
                style={{ marginTop: 16 }}
                data={filteredExpense}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleExpenseEdit(item.id, activeButton)}
                  >
                    <Items
                      onDelete={() => handleDeleteItem(item.id, "output")}
                      onEdit={() => handleExpenseEdit(item.id, activeButton)}
                      showItemTask
                      status={item.status}
                      type={item.type}
                      category={item.name}
                      date={item.date}
                      repeat={item.repeat}
                      valueTransaction={
                        item.valueTransaction
                          ? formatCurrency(item.valueTransaction ?? "0")
                          : formatCurrency("0")
                      }
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
                ListFooterComponent={<View style={{ height: 10 }} />}
              />
            )}
          </ContainerItems>
          <ContentTitle
            onPress={() => setIsSharedListVisible(!isSharedListVisible)}
          >
            <Title>Despesas e receitas compartilhadas</Title>

            <DividerContent />
            <Icon
              name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"}
            />
          </ContentTitle>

          {isSharedListVisible && (
            <Container>
              <FlatList
                style={{ marginTop: 16 }}
                data={expenseSharedByMe.concat(expensesSharedWithMe)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleExpenseEdit(item.id, activeButton)}
                  >
                    <Items
                      onDelete={() => handleDeleteItem(item.id, item.type)}
                      onEdit={() => handleExpenseEdit(item.id, activeButton)}
                      showItemTask
                      status={item.status}
                      type={item.type}
                      category={item.name}
                      date={item.date}
                      repeat={item.repeat}
                      valueTransaction={
                        item.valueTransaction
                          ? formatCurrency(item.valueTransaction ?? "0")
                          : formatCurrency("0")
                      }
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
                ListFooterComponent={<View style={{ height: 10 }} />}
              />
            </Container>
          )}
        </>
      )}
    </DefaultContainer>
  );
}
