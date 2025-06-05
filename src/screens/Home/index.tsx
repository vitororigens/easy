import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Text, ScrollView } from "react-native";
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
  NavBar,
  SubTitle,
  Title,
  ContentTitle,
  DividerContent,
  Icon,
  Container,
  Content,
  StatsContainer,
  StatItem,
  StatValue,
  StatLabel,
} from "./styles";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../@types/navigation";
import ExpensePersonImage from "../../assets/illustrations/expense.png";
import RevenuePersonImage from "../../assets/illustrations/revenue.png";
import { database } from "../../libs/firebase";
import { AppOpenAdComponent } from "../../components/AppOpenAd";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  type: "input" | "output";
  date: string;
  repeat: boolean;
  description: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
  valueTransaction: string;
}

export function Home() {
  const { user, loading: authLoading } = useUserAuth();
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
  const [isSharedExpenseListVisible, setSharedExpenseListVisible] = useState(false);
  const [isRevenueListVisible, setRevenueListVisible] = useState(true);
  const [isExpenseListVisible, setExpenseListVisible] = useState(true);
  const [revenueShareByMe, setRevenueSharedByMe] = useState<IRevenue[]>([]);
  const [revenueShareWithMe, setRevenueSharedWithMe] = useState<IRevenue[]>([]);
  const [expenseSharedByMe, setExpenseSharedByMe] = useState<IRevenue[]>([]);
  const [expensesSharedWithMe, setExpensesSharedWithme] = useState<IRevenue[]>(
    []
  );
  const [isLoadingSharedData, setIsLoadingSharedData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adicionando estados para o resumo
  const [paidBills, setPaidBills] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!authLoading && uid) {
      setIsLoadingSharedData(true);
      setError(null);
      Promise.all([
        getRevenuesSharedByMe(),
        getExpenseSharedByMe(),
        getRevenuesSharedWithMe(),
        getExpenseSharedWithMe()
      ]).catch((err) => {
        console.error("Erro ao carregar dados compartilhados:", err);
        setError("Erro ao carregar dados compartilhados");
      }).finally(() => {
        setIsLoadingSharedData(false);
        setIsLoaded(true);
      });
    }
  }, [authLoading, uid]);

  useEffect(() => {
    if (uid && selectedMonth) {
      try {
        // Calculando contas pagas e pendentes apenas para o mês selecionado e do usuário atual
        const filteredExpenses = expense.data.filter(item => item.uid === uid && item.month === selectedMonth);
        const paid = filteredExpenses.filter(item => item.status).length;
        const pending = filteredExpenses.filter(item => !item.status).length;
        
        setPaidBills(paid);
        setPendingBills(pending);
        setTotalValue(tolalRevenueMunth - totalExpenseMunth);
      } catch (err) {
        console.error("Erro ao calcular resumo:", err);
        setError("Erro ao calcular resumo");
      }
    }
  }, [expense, tolalRevenueMunth, totalExpenseMunth, selectedMonth, uid]);

  const formattedRevenue = tolalRevenueMunth.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedExpense = totalExpenseMunth.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
    } as never);
  }

  function handleExpenseEdit(documentId: string, initialActiveButton: string) {
    navigation.navigate("newtask", {
      selectedItemId: documentId,
      initialActiveButton,
    } as never);
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

  const handleDeleteItem = (documentId: string, type: "input" | "output") => {
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

  const handleToggleStatus = (documentId: string) => {
    // Primeiro, buscar o documento atual para obter o status atual
    database
      .collection("Expense")
      .doc(documentId)
      .get()
      .then((doc) => {
        if (doc.exists()) {
          const currentStatus = doc.data()?.status || false;
          
          // Atualizar o status para o oposto do atual
          database
            .collection("Expense")
            .doc(documentId)
            .update({
              status: !currentStatus,
            })
            .then(() => {
              Toast.show(
                !currentStatus 
                  ? "Despesa marcada como paga!" 
                  : "Despesa marcada como não paga!", 
                { type: "success" }
              );
            })
            .catch((error) => {
              console.error("Erro ao atualizar o status: ", error);
              Toast.show("Erro ao atualizar o status", { type: "error" });
            });
        } else {
          Toast.show("Despesa não encontrada", { type: "error" });
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar a despesa: ", error);
        Toast.show("Erro ao buscar a despesa", { type: "error" });
      });
  };

  async function getRevenuesSharedByMe() {
    if (!uid) return [];
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
      return revenues;
    } catch (err) {
      console.error("Erro ao buscar receitas compartilhadas:", err);
      setError("Erro ao buscar receitas compartilhadas");
      return [];
    }
  }

  async function getRevenuesSharedWithMe() {
    if (!uid) return [];
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
          ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null
        )
      );

      setRevenueSharedWithMe(filteredRevenues);
      return filteredRevenues;
    } catch (err) {
      console.error("Erro ao buscar receitas compartilhadas comigo:", err);
      setError("Erro ao buscar receitas compartilhadas comigo");
      return [];
    }
  }

  async function getExpenseSharedByMe() {
    if (!uid) return [];
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
      return expenses;
    } catch (err) {
      console.error("Erro ao buscar despesas compartilhadas:", err);
      setError("Erro ao buscar despesas compartilhadas");
      return [];
    }
  }

  async function getExpenseSharedWithMe() {
    if (!uid) return [];
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
          ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null
        )
      );

      setExpensesSharedWithme(filteredExpenses);
      return filteredExpenses;
    } catch (err) {
      console.error("Erro ao buscar despesas compartilhadas comigo:", err);
      setError("Erro ao buscar despesas compartilhadas comigo");
      return [];
    }
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
    navigation.navigate("newtask", {
      selectedItemId: documentId,
      initialActiveButton,
    } as never);
  }

  const handleSharedRevenueVisibility = () => {
    setSharedRevenueListVisible(!isSharedRevenueListVisible);
    setSharedExpenseListVisible(false);
  };

  const handleSharedExpenseVisibility = () => {
    setSharedExpenseListVisible(!isSharedExpenseListVisible);
    setSharedRevenueListVisible(false);
  };

  if (authLoading || isLoadingSharedData) {
    return <Loading />;
  }

  if (!user) {
    return <LoadData />;
  }

  if (error) {
    return (
      <DefaultContainer
        monthButton
        title="Erro"
        type="SECONDARY"
        subtitle="Ocorreu um erro ao carregar os dados"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
          <Button onPress={() => {
            setError(null);
            setIsLoaded(false);
          }}>
            <Title>Tentar novamente</Title>
          </Button>
        </View>
      </DefaultContainer>
    );
  }

  const filteredRevenue = revenue.data.filter(
    (item) => item.uid === uid && item.month === selectedMonth
  );
  const filteredExpense = expense.data.filter(
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
      <AppOpenAdComponent />
      <NavBar>
        <Button
          onPress={() => handleButtonClick("receitas")}
          active={activeButton === "receitas"}
        >
          <Title active={activeButton === "receitas"}>Receitas</Title>
          <SubTitle type="PRIMARY">{formattedRevenue}</SubTitle>
        </Button>
        <Button
          onPress={() => handleButtonClick("despesas")}
          active={activeButton === "despesas"}
        >
          <Title active={activeButton === "despesas"}>Despesas</Title>
          <SubTitle type="SECONDARY">{formattedExpense}</SubTitle>
        </Button>
      </NavBar>

      <Content>
        <StatsContainer>
          <StatItem>
            <TouchableOpacity onPress={() => navigation.navigate("graphics" as never)}>
              <Icon name="pie-chart" size={24} color="#000" />
              <StatLabel>Gráficos</StatLabel>
            </TouchableOpacity>
          </StatItem>
          <StatItem>
            <StatValue>{pendingBills}</StatValue>
            <StatLabel>Contas pendentes</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{paidBills}</StatValue>
            <StatLabel>Contas pagas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(totalValue)}</StatValue>
            <StatLabel>Valor total</StatLabel>
          </StatItem>
        </StatsContainer>

        {activeButton === "receitas" && (
          <>
            <ContentTitle
              onPress={() => setRevenueListVisible(!isRevenueListVisible)}
            >
              <Title>Receitas</Title>
              <DividerContent />
              <Icon
                name={isRevenueListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>
            <Container>
              {isRevenueListVisible && (
                <FlatList
                  data={filteredRevenue}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleRevenueEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as "input" | "output")}
                        onEdit={() => handleRevenueEdit(item.id, activeButton)}
                        type="PRIMARY"
                        status={item.status}
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
                  ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <LoadData
                        imageSrc={RevenuePersonImage}
                        title="Comece agora!"
                        subtitle="Adicione uma receita clicando em +"
                      />
                    </View>
                  }
                  contentContainerStyle={{ paddingBottom: 90 }}
                />
              )}
            </Container>

            <ContentTitle
              onPress={handleSharedRevenueVisibility}
            >
              <Title>Despesas e receitas compartilhadas</Title>
              <DividerContent />
              <Icon
                name={isSharedRevenueListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>

            {isSharedRevenueListVisible && (
              <Container>
                <FlatList
                  data={revenueShareByMe.concat(revenueShareWithMe)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleExpenseEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type)}
                        onEdit={() => handleExpenseEdit(item.id, activeButton)}
                        status={item.status}
                        type={item.type === "input" ? "PRIMARY" : "SECONDARY"}
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
                />
              </Container>
            )}
          </>
        )}

        {activeButton === "despesas" && (
          <>
            <ContentTitle
              onPress={() => setExpenseListVisible(!isExpenseListVisible)}
            >
              <Title>Despesas</Title>
              <DividerContent />
              <Icon
                name={isExpenseListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>

            <Container>
              {isExpenseListVisible && (
                <FlatList
                  data={filteredExpense}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleExpenseEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as "input" | "output")}
                        onEdit={() => handleExpenseEdit(item.id, activeButton)}
                        type="SECONDARY"
                        status={item.status}
                        onToggleStatus={() => handleToggleStatus(item.id)}
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
                  ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <LoadData
                        imageSrc={ExpensePersonImage}
                        title="Comece agora!"
                        subtitle="Adicione uma despesa clicando em +"
                      />
                    </View>
                  }
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 10 }}
                />
              )}
            </Container>

            <ContentTitle
              onPress={handleSharedExpenseVisibility}
            >
              <Title>Despesas e receitas compartilhadas</Title>
              <DividerContent />
              <Icon
                name={isSharedExpenseListVisible ? "arrow-drop-up" : "arrow-drop-down"}
              />
            </ContentTitle>

            {isSharedExpenseListVisible && (
              <Container>
                <FlatList
                  data={expenseSharedByMe.concat(expensesSharedWithMe)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleExpenseEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as "input" | "output")}
                        onEdit={() => handleExpenseEdit(item.id, activeButton)}
                        status={item.status}
                        type={item.type === "input" ? "PRIMARY" : "SECONDARY"}
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
                />
              </Container>
            )}
          </>
        )}
      </Content>
    </DefaultContainer>
  );
}
