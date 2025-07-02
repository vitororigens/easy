import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Items } from "../../components/Items";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection, { ExpenseData } from "../../hooks/useFirestoreCollection";
import { useTotalValue } from "../../hooks/useTotalValue";
import { useUserAuth } from "../../hooks/useUserAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import { Timestamp } from "@react-native-firebase/firestore";
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
  EmptyContainer,
  TextEmpty,
} from "./styles";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../@types/navigation";
import ExpensePersonImage from "../../assets/illustrations/expense.png";
import RevenuePersonImage from "../../assets/illustrations/revenue.png";
import { database } from "../../libs/firebase";
import { AppOpenAdComponent } from "../../components/AppOpenAd";
import firebase from '@react-native-firebase/app';

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
  month: number;
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
  const { data: revenueData, loading: revenueLoading } = useFirestoreCollection("Revenue");
  const { data: expenseData, loading: expenseLoading } = useFirestoreCollection("Expense");
  const { tolalRevenueMunth, totalExpenseMunth } = useTotalValue(
    uid || "Não foi possivel encontrar o uid"
  );
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

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
        // Calculando contas pagas e pendentes para o mês selecionado
        // Incluindo dados do usuário atual
        const filteredExpenses = expenseData.filter(item => item.uid === uid && item.month === selectedMonth);
        
        // Incluindo despesas compartilhadas com o usuário
        const sharedExpenses = expensesSharedWithMe.filter(item => item.month === selectedMonth);
        
        // Combinando todas as despesas
        const allExpenses = [...filteredExpenses, ...sharedExpenses];
        
        const paid = allExpenses.filter(item => item.status).length;
        const pending = allExpenses.filter(item => !item.status).length;
        
        setPaidBills(paid);
        setPendingBills(pending);
        setTotalValue(tolalRevenueMunth - totalExpenseMunth);
      } catch (err) {
        console.error("Erro ao calcular resumo:", err);
        setError("Erro ao calcular resumo");
      }
    }
  }, [expenseData, tolalRevenueMunth, totalExpenseMunth, selectedMonth, uid, expensesSharedWithMe]);

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
    // Mapear o botão ativo para o tipo de coleção
    const collectionType = initialActiveButton === "receitas" ? "Revenue" : "Expense";
    
    navigation.navigate("newlaunch" as any, {
      selectedItemId: documentId,
      initialActiveButton,
      collectionType,
    });
  }

  function handleExpenseEdit(documentId: string, initialActiveButton: string) {
    // Mapear o botão ativo para o tipo de coleção
    const collectionType = initialActiveButton === "receitas" ? "Revenue" : "Expense";
    
    navigation.navigate("newlaunch" as any, {
      selectedItemId: documentId,
      initialActiveButton,
      collectionType,
    });
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleDeleteItem = async (documentId: string, type: "input" | "output", item?: any) => {
    console.log('handleDeleteItem chamado:', { documentId, type, itemUid: item?.uid, meuUid: uid, removedItems: Array.from(removedItems) });
    // Se o item for compartilhado com você (não é seu), remova seu UID do array shareWith no Firestore
    if (item && ("uid" in item) && item.uid !== uid) {
      const collectionName = type === "input" ? "Revenue" : "Expense";
      try {
        await database
          .collection(collectionName)
          .doc(documentId)
          .update({
            shareWith: firebase.firestore.FieldValue.arrayRemove(uid),
          });
        
        // Remover localmente para sumir da tela imediatamente
        if (type === "input") {
          setRevenueSharedWithMe((prev: any[]) => {
            const newList = prev.filter((n: any) => n.id !== documentId);
            console.log('Item removido de revenueShareWithMe:', documentId, 'Nova lista tem', newList.length, 'itens');
            return newList;
          });
        } else {
          setExpensesSharedWithme((prev: any[]) => {
            const newList = prev.filter((n: any) => n.id !== documentId);
            console.log('Item removido de expensesSharedWithMe:', documentId, 'Nova lista tem', newList.length, 'itens');
            return newList;
          });
        }
        
        // Adicionar ao conjunto de itens removidos para garantir que não apareça na lista
        setRemovedItems(prev => {
          const newSet = new Set([...prev, documentId]);
          console.log('Item adicionado ao conjunto de removidos:', documentId, 'Total de itens removidos:', newSet.size);
          return newSet;
        });
        Toast.show("Item removido da sua lista!", { type: "success" });
      } catch (error) {
        Toast.show("Erro ao remover compartilhamento", { type: "danger" });
        console.error("Erro ao remover compartilhamento:", error);
      }
      return;
    }
    // Se for seu, delete do banco normalmente
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
    console.log("handleCreateItem - documentId:", documentId);
    console.log("handleCreateItem - initialActiveButton:", initialActiveButton);
    
    // Mapear o botão ativo para o tipo de coleção
    const collectionType = initialActiveButton === "receitas" ? "Revenue" : "Expense";
    
    // Se documentId estiver vazio, não passar selectedItemId
    const params: any = {
      initialActiveButton: initialActiveButton || "receitas",
      collectionType,
      isCreator: true,
    };
    
    // Só adicionar selectedItemId se não estiver vazio
    if (documentId && documentId.trim() !== "") {
      params.selectedItemId = documentId;
    }
    
    console.log("handleCreateItem - params:", params);
    
    try {
      navigation.navigate("newlaunch" as any, params);
    } catch (error) {
      console.error("Erro ao navegar para newtask:", error);
    }
  }

  // Função utilitária para remover duplicatas por id
  function deduplicateById(arr: any[]) {
    const map = new Map();
    arr.forEach(item => map.set(item.id, item));
    return Array.from(map.values());
  }

  // Unificar listas para renderização, sem duplicatas e com filtro de compartilhamento
  const allRevenues = deduplicateById([...revenueData, ...revenueShareWithMe])
    .filter(item => {
      // Se o item foi removido, não aparece
      if (removedItems.has(item.id)) {
        console.log(`Item ${item.id} (${item.name}) foi removido, não aparecerá na lista`);
        return false;
      }
      // Se for meu, sempre aparece
      if (item.uid === uid) return true;
      // Se não for meu, só aparece se ainda estou em shareWith
      const isSharedWithMe = Array.isArray(item.shareWith) && item.shareWith.includes(uid);
      console.log(`Item ${item.id} (${item.name}): uid=${item.uid}, meu uid=${uid}, shareWith=${JSON.stringify(item.shareWith)}, isSharedWithMe=${isSharedWithMe}`);
      return isSharedWithMe;
    });
  
  const allExpenses = deduplicateById([...expenseData, ...expensesSharedWithMe])
    .filter(item => {
      // Se o item foi removido, não aparece
      if (removedItems.has(item.id)) {
        console.log(`Item ${item.id} (${item.name}) foi removido, não aparecerá na lista`);
        return false;
      }
      // Se for meu, sempre aparece
      if (item.uid === uid) return true;
      // Se não for meu, só aparece se ainda estou em shareWith
      const isSharedWithMe = Array.isArray(item.shareWith) && item.shareWith.includes(uid);
      console.log(`Item ${item.id} (${item.name}): uid=${item.uid}, meu uid=${uid}, shareWith=${JSON.stringify(item.shareWith)}, isSharedWithMe=${isSharedWithMe}`);
      return isSharedWithMe;
    });
  
  console.log('Receitas finais renderizadas:', allRevenues.length);
  console.log('Despesas finais renderizadas:', allExpenses.length);

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

  return (
    <DefaultContainer
      monthButton
      title={activeButton === "receitas" ? "Receitas" : "Despesas"}
      type="SECONDARY"
      subtitle={formattedTotalValue}
      addActionFn={() => handleCreateItem("", activeButton)}
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
                  data={allRevenues}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleRevenueEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as "input" | "output", item)}
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
                        isShared={Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        isSharedByMe={("uid" in item ? item.uid : undefined) === uid && Array.isArray(item.shareWith) && item.shareWith.length > 0}
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
                  data={allExpenses}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleExpenseEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as "input" | "output", item)}
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
                        isShared={Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        isSharedByMe={("uid" in item ? item.uid : undefined) === uid && Array.isArray(item.shareWith) && item.shareWith.length > 0}
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
          </>
        )}
      </Content>
    </DefaultContainer>
  );
}
