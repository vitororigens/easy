import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { Container } from "../../components/Container";
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
import {
  Button,
  ButtonClose,
  ContainerItems,
  Header,
  NavBar,
  SubTitle,
  Title
} from "./styles";

export function Home() {
  const user = useUserAuth();
  const [activeButton, setActiveButton] = useState("receitas");
  const { selectedMonth } = useMonth();
  const uid = user?.uid;
  const revenue = useFirestoreCollection("Revenue");
  const expense = useFirestoreCollection("Expense");

  const { tolalRevenueMunth, totalExpenseMunth } = useTotalValue(
    uid || "Não foi possivel encontrar o uid"
  );
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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
  console.log(expense.filter((item) => item.uid === uid));

  function handleRevenueConfirmation(documentId: string) {
    setConfirmRevenueVisible(true);
    setSelectedItemId(documentId);
  }

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer
      addButton
      monthButton
      title={activeButton === "receitas" ? "Receitas" : "Despesas"}
      type="SECONDARY"
      subtitle={formattedTotalValue}
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
          {revenue.filter((item) => item.uid === uid).length === 0 ? (
            <ScrollView>
              <LoadData
                image="PRIMARY"
                title="Desculpe!"
                subtitle="Você ainda não possui lançamentos de entradas! Comece adicionando uma nova entrada."
              />
            </ScrollView>
          ) : (
            <FlatList
              style={{ marginTop: 16 }}
              data={revenue.filter(
                (item) => item.uid === uid && item.month === selectedMonth
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRevenueConfirmation(item.id)}
                >
                  <Items
                    onDelete={() => handleDeleteRevenue(item.id)}
                    onEdit={() => handleRevenueConfirmation(item.id)}
                    showItemTaskRevenue
                    type={item.type}
                    category={item.name}
                    date={item.date}
                    repeat={item.repeat}
                    valueTransaction={formatCurrency(item.valueTransaction)}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 90 }}
            />
          )}
        </ContainerItems>
      )}
      {activeButton === "despesas" && (
        <ContainerItems>
          {expense.filter((item) => item.uid === uid).length === 0 ? (
            <ScrollView>
              <LoadData
                image="SECONDARY"
                title="Desculpe!"
                subtitle="Você ainda não possui lançamentos de saídas! Comece lançando uma nova saída."
              />
            </ScrollView>
          ) : (
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
                  onPress={() => handleExpenseConfirmation(item.id)}
                >
                  <Items
                    onDelete={() => handleDeleteExpense(item.id)}
                    onEdit={() => handleRevenueConfirmation(item.id)}
                    showItemTask
                    status={item.status}
                    type={item.type}
                    category={item.name}
                    date={item.date}
                    repeat={item.repeat}
                    valueTransaction={formatCurrency(item.valueTransaction)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
            />
          )}
        </ContainerItems>
      )}

      <Modal
        visible={confirmRevenueVisible}
        onRequestClose={() => setConfirmRevenueVisible(false)}
      >
        <DefaultContainer hasHeader={false}>
          <ButtonClose
            onPress={() => setConfirmRevenueVisible(false)}
            style={{ alignSelf: "flex-end", marginBottom: 32 }}
          >
            <Title style={{ color: "white" }}>Fechar</Title>
          </ButtonClose>
          <Container title={"Editar Entrada"}>
            <Revenue
              selectedItemId={selectedItemId}
              showButtonRemove
              onCloseModal={() => setConfirmRevenueVisible(false)}
              showButtonEdit
            />
          </Container>
        </DefaultContainer>
      </Modal>
      <Modal
        visible={confirmExpenseVisible}
        onRequestClose={() => setConfirmExpenseVisible(false)}
      >
        <DefaultContainer hasHeader={false}>
          <ButtonClose
            onPress={() => setConfirmExpenseVisible(false)}
            style={{ alignSelf: "flex-end", marginBottom: 32 }}
          >
            <Title style={{ color: "white" }}>Fechar</Title>
          </ButtonClose>
          <Container type="SECONDARY" title={"Editar Saida"}>
            <Expense
              selectedItemId={selectedItemId}
              showButtonRemove
              onCloseModal={() => setConfirmExpenseVisible(false)}
              showButtonEdit
            />
          </Container>
        </DefaultContainer>
      </Modal>
    </DefaultContainer>
  );
}
