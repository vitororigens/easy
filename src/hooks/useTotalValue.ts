import { useEffect, useState } from 'react';
import useFirestoreCollection, { ExpenseData } from './useFirestoreCollection';
import { useMonth } from '../context/MonthProvider';
import { database } from '../libs/firebase';

export interface TotalValues {
  totalRevenue: number;
  totalExpense: number;
  tolalRevenueMunth: number;
  totalExpenseMunth: number;
  totalValue: number;
}

export function useTotalValue(uid: string | null): TotalValues {
  const { data: revenueData } = useFirestoreCollection('Revenue');
  const { data: expenseData } = useFirestoreCollection('Expense');
  const { selectedMonth } = useMonth();

  const [totalRevenueValue, setTotalRevenueValue] = useState<number>(0);
  const [totalExpenseValue, setTotalExpenseValue] = useState<number>(0);
  const [totalRevenueValueMunth, setTotalRevenueValueMunth] = useState<number>(0);
  const [totalExpenseValueMunth, setTotalExpenseValueMunth] = useState<number>(0);
  const [sharedRevenueData, setSharedRevenueData] = useState<ExpenseData[]>([]);
  const [sharedExpenseData, setSharedExpenseData] = useState<ExpenseData[]>([]);

  // Obter o ano atual
  const currentYear = new Date().getFullYear();

  // Função para verificar se o item é do ano corrente
  const isCurrentYear = (item: ExpenseData) => {
    // Primeiro tenta verificar o campo date (data do evento)
    if (item.date) {
      try {
        // Converte a data do formato DD/MM/YYYY para Date
        const dateParts = item.date.split('/');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[2] || '0', 10);
          return year === currentYear;
        }
      } catch (error) {
        console.log(`Erro ao processar data do evento do item ${item.name}:`, error);
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
      } catch (error) {
        // Se não conseguir converter a data, assume que é do ano atual
        return true;
      }
    }

    // Se não tem nenhuma data válida, assume que é do ano atual para não perder dados
    return true;
  };

  // Buscar dados compartilhados
  useEffect(() => {
    if (!uid) return;

    const fetchSharedData = async () => {
      try {
        // Buscar receitas compartilhadas com o usuário
        const sharedRevenues = await database
          .collection('Revenue')
          .where('shareWith', 'array-contains', uid)
          .get();

        const sharedRevenuesData = sharedRevenues.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as ExpenseData))
          .filter((item) =>
            item.shareInfo?.some(
              ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null,
            ),
          );

        // Buscar despesas compartilhadas com o usuário
        const sharedExpenses = await database
          .collection('Expense')
          .where('shareWith', 'array-contains', uid)
          .get();

        const sharedExpensesData = sharedExpenses.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as ExpenseData))
          .filter((item) =>
            item.shareInfo?.some(
              ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null,
            ),
          );

        setSharedRevenueData(sharedRevenuesData);
        setSharedExpenseData(sharedExpensesData);
      } catch (error) {
        console.error('Erro ao buscar dados compartilhados:', error);
      }
    };

    fetchSharedData();
  }, [uid]);

  useEffect(() => {
    if (uid) {
      // Dados do usuário atual filtrados por ano
      const revenueFiltered = revenueData.filter(item => item.uid === uid && isCurrentYear(item));
      const expenseFiltered = expenseData.filter(item => item.uid === uid && isCurrentYear(item));
      const revenueFilteredMunth = revenueData.filter(item => item.uid === uid && item.month === selectedMonth && isCurrentYear(item));
      const expenseFilteredMunth = expenseData.filter(item => item.uid === uid && item.month === selectedMonth && isCurrentYear(item));

      // Dados compartilhados filtrados por mês e ano
      const sharedRevenueFilteredMunth = sharedRevenueData.filter(item => item.month === selectedMonth && isCurrentYear(item));
      const sharedExpenseFilteredMunth = sharedExpenseData.filter(item => item.month === selectedMonth && isCurrentYear(item));

      // Calcular totais incluindo dados compartilhados
      const totalRevenue = revenueFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);
      const totalExpense = expenseFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseFloat(curr.valueTransaction || '0'), 0);

      const totalRevenueMunth = revenueFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0) +
                               sharedRevenueFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);

      const totalExpenseMunth = expenseFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0) +
                               sharedExpenseFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);

      setTotalRevenueValue(totalRevenue);
      setTotalExpenseValue(totalExpense);
      setTotalRevenueValueMunth(totalRevenueMunth);
      setTotalExpenseValueMunth(totalExpenseMunth);
    }
  }, [uid, revenueData, expenseData, selectedMonth, sharedRevenueData, sharedExpenseData]);

  const totalValue = totalRevenueValue - totalExpenseValue;

  return {
    totalRevenue: totalRevenueValue,
    totalExpense: totalExpenseValue,
    tolalRevenueMunth: totalRevenueValueMunth,
    totalExpenseMunth: totalExpenseValueMunth,
    totalValue,
  };
}
