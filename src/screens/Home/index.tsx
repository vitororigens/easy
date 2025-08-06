import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Toast } from 'react-native-toast-notifications';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Items } from '../../components/Items';
import { LoadData } from '../../components/LoadData';
import { AIInsights } from '../../components/AIInsights';
import { NaturalInput } from '../../components/NaturalInput';
import { useMonth } from '../../context/MonthProvider';
import useFirestoreCollection from '../../hooks/useFirestoreCollection';
import { useTotalValue } from '../../hooks/useTotalValue';
import { useUserAuth } from '../../hooks/useUserAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { Timestamp } from '@react-native-firebase/firestore';
import { processAndSaveNaturalInput } from '../../services/firebase/ai-transactions.firebase';
import {
  Button,
  NavBar,
  SubTitle,
  Title,
  Icon,
  Container,
  Content,
  StatsContainer,
  StatItem,
  StatValue,
  StatLabel,
  EmptyContainer,
  CenteredView,
  RedText,
  FlatListContentReceita,
  FlatListContentDespesa,
} from './styles';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../@types/navigation';
import { database } from '../../libs/firebase';
import { AppOpenAdComponent } from '../../components/AppOpenAd';
import firebase from '@react-native-firebase/app';
import { SkeletonItem } from '../../components/SkeletonItem';

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
  type: 'input' | 'output';
  date: string;
  month: number;
  repeat: boolean;
  description: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
  valueTransaction: string;
  uid?: string;
}

export function Home() {
  const { user, loading: authLoading } = useUserAuth();
  const uid = user?.uid;
  const [activeButton, setActiveButton] = useState('receitas');
  const { selectedMonth } = useMonth();
  const { data: revenueData } = useFirestoreCollection('Revenue');
  const { data: expenseData } = useFirestoreCollection('Expense');
  const { tolalRevenueMunth, totalExpenseMunth } = useTotalValue(
    uid || 'Não foi possivel encontrar o uid',
  );
  const [isRevenueListVisible] = useState(true);
  const [isExpenseListVisible] = useState(true);
  const [revenueShareWithMe, setRevenueSharedWithMe] = useState<IRevenue[]>([]);
  const [expensesSharedWithMe, setExpensesSharedWithme] = useState<IRevenue[]>(
    [],
  );
  const [isLoadingSharedData, setIsLoadingSharedData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

  // Adicionando estados para o resumo
  const [paidBills, setPaidBills] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Estados para funcionalidades de IA
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [showNaturalInput, setShowNaturalInput] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  // Corrigir: memorizar as funções para evitar loop
  const getRevenuesSharedWithMe = useCallback(async () => {
    if (!uid) return [];
    try {
      const data = await database
        .collection('Revenue')
        .where('shareWith', 'array-contains', uid)
        .get();

      const revenues = (data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) ?? []) as IRevenue[];

      const filteredRevenues = revenues.filter((n) =>
        n.shareInfo.some(
          ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null,
        ),
      );

      setRevenueSharedWithMe(filteredRevenues);
      return filteredRevenues;
    } catch {
      Toast.show('Erro ao buscar receitas compartilhadas comigo', { type: 'danger' });
      setError('Erro ao buscar receitas compartilhadas comigo');
      return [];
    }
  }, [uid]);

  const getExpenseSharedWithMe = useCallback(async () => {
    if (!uid) return [];
    try {
      const data = await database
        .collection('Expense')
        .where('shareWith', 'array-contains', uid)
        .get();

      const expenses = (data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) ?? []) as IRevenue[];

      const filteredExpenses = expenses.filter((n) =>
        n.shareInfo.some(
          ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null,
        ),
      );

      setExpensesSharedWithme(filteredExpenses);
      return filteredExpenses;
    } catch {
      Toast.show('Erro ao buscar despesas compartilhadas comigo', { type: 'danger' });
      setError('Erro ao buscar despesas compartilhadas comigo');
      return [];
    }
  }, [uid]);

  useEffect(() => {
    if (!authLoading && uid) {
      setIsLoadingSharedData(true);
      setError(null);
      Promise.all([
        getRevenuesSharedWithMe(),
        getExpenseSharedWithMe(),
      ]).catch(() => {
        Toast.show('Erro ao carregar dados compartilhados', { type: 'danger' });
      }).finally(() => {
        setIsLoadingSharedData(false);
      });
    }
  }, [authLoading, uid, getExpenseSharedWithMe, getRevenuesSharedWithMe]);

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
      } catch {
        Toast.show('Erro ao calcular resumo', { type: 'danger' });
        setError('Erro ao calcular resumo');
      }
    }
  }, [expenseData, tolalRevenueMunth, totalExpenseMunth, selectedMonth, uid, expensesSharedWithMe]);

  const formattedRevenue = tolalRevenueMunth.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const formattedExpense = totalExpenseMunth.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  function handleRevenueEdit(documentId: string, initialActiveButton: string) {
    const collectionType = initialActiveButton === 'receitas' ? 'Revenue' : 'Expense';
    // @ts-expect-error: Navegação para rota customizada
    navigation.navigate('newlaunch', {
      selectedItemId: documentId,
      initialActiveButton,
      collectionType,
      isCreator: true,
    });
  }

  function handleExpenseEdit(documentId: string, initialActiveButton: string) {
    const collectionType = initialActiveButton === 'receitas' ? 'Revenue' : 'Expense';
    // @ts-expect-error: Navegação para rota customizada
    navigation.navigate('newlaunch', {
      selectedItemId: documentId,
      initialActiveButton,
      collectionType,
      isCreator: true,
    });
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleDeleteItem = async (
    documentId: string,
    type: 'input' | 'output',
    item?: IRevenue,
  ) => {
    // Se o item for compartilhado com você (não é seu), remova seu UID do array shareWith no Firestore
    if (item && item.uid !== uid) {
      const collectionName = type === 'input' ? 'Revenue' : 'Expense';
      try {
        await database
          .collection(collectionName)
          .doc(documentId)
          .update({
            shareWith: firebase.firestore.FieldValue.arrayRemove(uid),
          });

        // Remover localmente para sumir da tela imediatamente
        if (type === 'input') {
          setRevenueSharedWithMe((prev) => prev.filter((n) => n.id !== documentId));
        } else {
          setExpensesSharedWithme((prev) => prev.filter((n) => n.id !== documentId));
        }

        // Adicionar ao conjunto de itens removidos para garantir que não apareça na lista
        setRemovedItems(prev => new Set([...prev, documentId]));
        Toast.show('Item removido da sua lista!', { type: 'success' });
      } catch {
        Toast.show('Erro ao remover compartilhamento', { type: 'danger' });
      }
      return;
    }
    // Se for seu, delete do banco normalmente
    if (type === 'input') {
      database
        .collection('Revenue')
        .doc(documentId)
        .delete()
        .then(() => {
          Toast.show('Nota excluída!', { type: 'success' });
        })
        .catch((error) => {
          Toast.show(`Erro ao excluir a nota: ${error}`, { type: 'danger' });
        });
    } else {
      database
        .collection('Expense')
        .doc(documentId)
        .delete()
        .then(() => {
          Toast.show('Nota excluída!', { type: 'success' });
        })
        .catch((error) => {
          Toast.show(`Erro ao excluir a nota: ${error}`, { type: 'danger' });
        });
    }
  };

  const handleToggleStatus = (documentId: string) => {
    // Primeiro, buscar o documento atual para obter o status atual
    database
      .collection('Expense')
      .doc(documentId)
      .get()
      .then((doc) => {
        if (doc.exists()) {
          const currentStatus = doc.data()?.['status'] || false;

          // Atualizar o status para o oposto do atual
          database
            .collection('Expense')
            .doc(documentId)
            .update({
              status: !currentStatus,
            })
            .then(() => {
              Toast.show(
                !currentStatus
                  ? 'Despesa marcada como paga!'
                  : 'Despesa marcada como não paga!',
                { type: 'success' },
              );
            })
            .catch(() => {
              Toast.show('Erro ao atualizar o status', { type: 'danger' });
            });
        } else {
          Toast.show('Despesa não encontrada', { type: 'error' });
        }
      })
      .catch(() => {
        Toast.show('Erro ao buscar a despesa', { type: 'error' });
      });
  };

  function handleCreateItem(documentId: string, initialActiveButton: string) {
    const collectionType = initialActiveButton === 'receitas' ? 'Revenue' : 'Expense';
    const params: {
      selectedItemId?: string;
      initialActiveButton: string;
      collectionType: string;
      isCreator: boolean;
    } = {
      initialActiveButton: initialActiveButton || 'receitas',
      collectionType,
      isCreator: true,
    };
    if (documentId && documentId.trim() !== '') {
      params.selectedItemId = documentId;
    }
    try {
      // @ts-expect-error: Navegação para rota customizada
      navigation.navigate('newlaunch', params);
    } catch {
      Toast.show('Erro ao navegar para newtask', { type: 'danger' });
    }
  }

  // Função para lidar com transações processadas pela IA
  const handleAITransactionParsed = async (transaction: {
    type: 'input' | 'output';
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => {
    if (!uid) {
      Toast.show('Usuário não autenticado', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
      return;
    }

    try {
      // Salvar a transação no Firebase
      const result = await processAndSaveNaturalInput(
        `${transaction.type === 'output' ? 'gastei' : 'recebi'} ${transaction.amount} ${transaction.description}`,
        uid
      );

      if (result.success) {
        Toast.show(`Transação ${transaction.type === 'input' ? 'de receita' : 'de despesa'} salva com sucesso!`, {
          type: 'success',
          placement: 'top',
          duration: 3000,
        });
        
        // Fechar o input natural após processar
        setShowNaturalInput(false);
      } else {
        Toast.show(`Erro: ${result.error}`, {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving AI transaction:', error);
      Toast.show('Erro ao salvar transação', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    }
  };

  // Função utilitária para remover duplicatas por id
  function deduplicateById(arr: IRevenue[]): IRevenue[] {
    const map = new Map<string, IRevenue>();
    arr.forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  }

  function hasCreatedAt(item: unknown): item is IRevenue {
    return !!item && typeof (item as IRevenue).createdAt !== 'undefined';
  }

  // Obter o ano atual
  const currentYear = new Date().getFullYear();

  // Função para verificar se o item é do ano corrente
  const isCurrentYear = (item: IRevenue) => {
    // Primeiro tenta verificar o campo date (data do evento)
    if (item.date) {
      try {
        // Converte a data do formato DD/MM/YYYY para Date
        const dateParts = item.date.split('/');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[2] || '0', 10);
          return year === currentYear;
        }
      } catch {
        // Erro ao processar data do evento
      }
    }

    // Se não conseguir verificar a data do evento, tenta o createdAt
    if (item.createdAt) {
      try {
        let itemDate: Date;

        // Verifica se é um Timestamp do Firestore
        if (typeof item.createdAt.toDate === 'function') {
          itemDate = item.createdAt.toDate();
        }
        // Verifica se é uma string de data
        else if (typeof item.createdAt === 'string') {
          itemDate = new Date(item.createdAt);
        }
        // Se não conseguir determinar, assume que é do ano atual
        else {
          return true;
        }

        const itemYear = itemDate.getFullYear();
        return itemYear === currentYear;
      } catch {
        // Se não conseguir converter a data, assume que é do ano atual
        return true;
      }
    }

    // Se não tem nenhuma data válida, assume que é do ano atual para não perder dados
    return true;
  };

  // Unificar listas para renderização, sem duplicatas e com filtro de compartilhamento e ano corrente
  const allRevenues = deduplicateById(
    [...revenueData, ...revenueShareWithMe].filter(hasCreatedAt),
  ).filter(item => {
    if (removedItems.has(item.id)) {
      return false;
    }
    if (!isCurrentYear(item)) {
      return false;
    }
    if ((item.uid ?? '') === (uid ?? '')) {
      return true;
    }
    const isSharedWithMe = Array.isArray(item.shareWith) && item.shareWith.includes(uid ?? '');
    return isSharedWithMe;
  });

  const allExpenses = deduplicateById(
    [...expenseData, ...expensesSharedWithMe].filter(hasCreatedAt),
  ).filter(item => {
    if (removedItems.has(item.id)) {
      return false;
    }
    if (!isCurrentYear(item)) {
      return false;
    }
    if ((item.uid ?? '') === (uid ?? '')) {
      return true;
    }
    const isSharedWithMe = Array.isArray(item.shareWith) && item.shareWith.includes(uid ?? '');
    return isSharedWithMe;
  });

  const skeletonArray = Array.from({ length: 6 });

  if (authLoading || isLoadingSharedData) {
    return (
      <DefaultContainer
        monthButton
        title={activeButton === 'receitas' ? 'Receitas' : 'Despesas'}
        type="SECONDARY"
      >
        <NavBar>
          <Button
            onPress={() => handleButtonClick('receitas')}
            active={activeButton === 'receitas'}
          >
            <Title active={activeButton === 'receitas'}>Receitas</Title>
            <SubTitle type="PRIMARY">--</SubTitle>
          </Button>
          <Button
            onPress={() => handleButtonClick('despesas')}
            active={activeButton === 'despesas'}
          >
            <Title active={activeButton === 'despesas'}>Despesas</Title>
            <SubTitle type="SECONDARY">--</SubTitle>
          </Button>
        </NavBar>
        <Content>
          <Container>
            {skeletonArray.map((_, idx) => (
              <SkeletonItem key={idx} />
            ))}
          </Container>
        </Content>
      </DefaultContainer>
    );
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
      >
        <CenteredView>
          <RedText>{error}</RedText>
          <Button onPress={() => {
            setError(null);
          }}>
            <Title>Tentar novamente</Title>
          </Button>
        </CenteredView>
      </DefaultContainer>
    );
  }

  return (
    <DefaultContainer
      monthButton
      title={activeButton === 'receitas' ? 'Receitas' : 'Despesas'}
      type="SECONDARY"
      addActionFn={() => handleCreateItem('', activeButton)}
    >
      <AppOpenAdComponent />
      <NavBar>
        <Button
          onPress={() => handleButtonClick('receitas')}
          active={activeButton === 'receitas'}
        >
          <Title active={activeButton === 'receitas'}>Receitas</Title>
          <SubTitle type="PRIMARY">{formattedRevenue}</SubTitle>
        </Button>
        <Button
          onPress={() => handleButtonClick('despesas')}
          active={activeButton === 'despesas'}
        >
          <Title active={activeButton === 'despesas'}>Despesas</Title>
          <SubTitle type="SECONDARY">{formattedExpense}</SubTitle>
        </Button>
      </NavBar>

      <Content>
          <StatsContainer>
            <StatItem>
              <TouchableOpacity onPress={() => navigation.navigate('graphics' as never)}>
                <Icon name="pie-chart" size={24} color="#000" />
                <StatLabel>Gráficos</StatLabel>
              </TouchableOpacity>
            </StatItem>
            <StatItem>
              <TouchableOpacity onPress={() => setShowAIInsights(!showAIInsights)}>
                <Icon name="lightbulb" size={24} color={showAIInsights ? '#3498db' : '#000'} />
                <StatLabel>IA Insights</StatLabel>
              </TouchableOpacity>
            </StatItem>
            <StatItem>
              <TouchableOpacity onPress={() => setShowNaturalInput(!showNaturalInput)}>
                <Icon name="edit" size={24} color={showNaturalInput ? '#3498db' : '#000'} />
                <StatLabel>Entrada IA</StatLabel>
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

          {/* Componentes de IA */}
          <AIInsights 
            transactions={[...allRevenues, ...allExpenses]} 
            visible={showAIInsights} 
          />
          
          <NaturalInput 
            onTransactionParsed={handleAITransactionParsed}
            visible={showNaturalInput}
          />

        {activeButton === 'receitas' && (
          <>
            <Container>
              {isRevenueListVisible && (
                <FlatList
                  data={allRevenues}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleRevenueEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as 'input' | 'output', item as IRevenue)}
                        onEdit={() => handleRevenueEdit(item.id, activeButton)}
                        type="PRIMARY"
                        status={item.status}
                        category={item.name}
                        date={item.date}
                        repeat={item.repeat}
                        valueTransaction={
                          item.valueTransaction
                            ? formatCurrency(item.valueTransaction ?? '0')
                            : formatCurrency('0')
                        }
                        isShared={Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        isSharedByMe={((item.uid ?? '') === (uid ?? '')) && Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        uid={item.uid ?? ''}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={7}
                  removeClippedSubviews={true}
                  contentContainerStyle={FlatListContentReceita}
                  ListEmptyComponent={
                    <EmptyContainer>
                      <LoadData
                        imageSrc={require('../../assets/illustrations/revenue.png')}
                        title="Nenhuma receita"
                        subtitle="Toque no botão + para adicionar uma nova receita"
                      />
                    </EmptyContainer>
                  }
                />
              )}
            </Container>
          </>
        )}
        {activeButton === 'despesas' && (
          <>
            <Container>
              {isExpenseListVisible && (
                <FlatList
                  data={allExpenses}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleExpenseEdit(item.id, activeButton)}
                    >
                      <Items
                        onDelete={() => handleDeleteItem(item.id, item.type as 'input' | 'output', item as IRevenue)}
                        onEdit={() => handleExpenseEdit(item.id, activeButton)}
                        type="SECONDARY"
                        status={item.status}
                        onToggleStatus={() => handleToggleStatus(item.id)}
                        category={item.name}
                        date={item.date}
                        repeat={item.repeat}
                        valueTransaction={
                          item.valueTransaction
                            ? formatCurrency(item.valueTransaction ?? '0')
                            : formatCurrency('0')
                        }
                        isShared={Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        isSharedByMe={((item.uid ?? '') === (uid ?? '')) && Array.isArray(item.shareWith) && item.shareWith.length > 0}
                        uid={item.uid ?? ''}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={7}
                  removeClippedSubviews={true}
                  contentContainerStyle={FlatListContentDespesa}
                  ListEmptyComponent={
                    <EmptyContainer>
                      <LoadData
                        imageSrc={require('../../assets/illustrations/expense.png')}
                        title="Nenhuma despesa"
                        subtitle="Toque no botão + para adicionar uma nova despesa"
                      />
                    </EmptyContainer>
                  }
                />
              )}
            </Container>
          </>
        )}
        </Content>
      </DefaultContainer>
    );
  }
