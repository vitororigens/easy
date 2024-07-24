import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Expense } from "../../components/Expense";
import { Items } from "../../components/Items";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { Revenue } from "../../components/Revenue";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useTotalValue } from "../../hooks/useTotalValue";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { formatCurrency } from "../../utils/formatCurrency";
import { NewTask } from "../NewTask";
import {
  Button,
  ContainerItems,
  Content,
  Header,
  NavBar,
  SubTitle,
  Title,
} from "./styles";

import { useNavigation } from "@react-navigation/native";
import ExpensePersonImage from "../../assets/illustrations/expense.png";
import RevenuePersonImage from "../../assets/illustrations/revenue.png";
import theme from "../../theme";

export function Home() {
  const user = useUserAuth();
  const uid = user?.uid;
  const { COLORS } = useTheme();
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

  const navigation = useNavigation()

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
    // @ts-ignore
  navigation.navigate("newtask", { selectedItemId: documentId, initialActiveButton });
}


  function handleExpenseEdit(documentId: string, initialActiveButton: string) {
    // @ts-ignore
  navigation.navigate("newtask", { selectedItemId: documentId, initialActiveButton });
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
    // @ts-ignore
    navigation.navigate("newtask", { selectedItemId: documentId, initialActiveButton });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer
      monthButton
      title={activeButton === "receitas" ? "Receitas" : "Despesas"}
      type="SECONDARY"
      subtitle={formattedTotalValue}
      addActionFn={() => handleCreateItem(selectedItemId, activeButton)}
      customBg={theme.COLORS.TEAL_50}
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
        <ContainerItems>
          {revenue.filter((item) => item.uid === uid).length === 0 ? null : (
            <FlatList
              style={{ marginTop: 16 }}
              data={revenue.filter(
                (item) => item.uid === uid && item.month === selectedMonth
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRevenueEdit(item.id, activeButton)}
                >
                  <Items
                    onDelete={() => handleDeleteRevenue(item.id)}
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
              ListEmptyComponent={
                <LoadData
                  imageSrc={RevenuePersonImage}
                  title="Comece agora!"
                  subtitle="Adicione uma receita clicando em +"
                  width={300}
                />
              }
            />
          )}
        </ContainerItems>
      )}
      {activeButton === "despesas" && (
        <ContainerItems>
          {expense.filter((item) => item.uid === uid).length === 0 ? null : (
            <FlatList
              style={{ marginTop: 16 }}
              data={expense.filter(
                (item) =>
                  item.uid === uid &&
                  ((item.repeat === true && item.month === selectedMonth) ||
                    (item.repeat === false && item.month === selectedMonth))
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleExpenseEdit(item.id, activeButton)}
                >
                  <Items
                    onDelete={() => handleDeleteExpense(item.id)}
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
              contentContainerStyle={{ paddingBottom: 90 }}
              ListEmptyComponent={
                <LoadData
                  imageSrc={ExpensePersonImage}
                  title="Comece agora!"
                  subtitle="Adicione uma despesa clicando em +"
                  width={300}
                />
              }
            />
          )}
        </ContainerItems>
      )}
    </DefaultContainer>
  );
}
