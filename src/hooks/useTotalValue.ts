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
  const { selectedMonth } = useMonth()

  const [totalRevenueValue, setTotalRevenueValue] = useState<number>(0);
  const [totalExpenseValue, setTotalExpenseValue] = useState<number>(0);
  const [totalRevenueValueMunth, setTotalRevenueValueMunth] = useState<number>(0);
  const [totalExpenseValueMunth, setTotalExpenseValueMunth] = useState<number>(0);
  const [sharedRevenueData, setSharedRevenueData] = useState<ExpenseData[]>([]);
  const [sharedExpenseData, setSharedExpenseData] = useState<ExpenseData[]>([]);

  // Buscar dados compartilhados
  useEffect(() => {
    if (!uid) return;

    const fetchSharedData = async () => {
      try {
        // Buscar receitas compartilhadas com o usuário
        const sharedRevenues = await database
          .collection("Revenue")
          .where("shareWith", "array-contains", uid)
          .get();

        const sharedRevenuesData = sharedRevenues.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as ExpenseData))
          .filter((item) => 
            item.shareInfo?.some(
              ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null
            )
          );

        // Buscar despesas compartilhadas com o usuário
        const sharedExpenses = await database
          .collection("Expense")
          .where("shareWith", "array-contains", uid)
          .get();

        const sharedExpensesData = sharedExpenses.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as ExpenseData))
          .filter((item) => 
            item.shareInfo?.some(
              ({ uid: shareUid, acceptedAt }) => shareUid === uid && acceptedAt !== null
            )
          );

        setSharedRevenueData(sharedRevenuesData);
        setSharedExpenseData(sharedExpensesData);
      } catch (error) {
        console.error("Erro ao buscar dados compartilhados:", error);
      }
    };

    fetchSharedData();
  }, [uid]);

  useEffect(() => {
    if (uid) {
      // Dados do usuário atual
      const revenueFiltered = revenueData.filter(item => item.uid === uid);
      const expenseFiltered = expenseData.filter(item => item.uid === uid);
      const revenueFilteredMunth = revenueData.filter(item => item.uid === uid && item.month === selectedMonth);
      const expenseFilteredMunth = expenseData.filter(item => item.uid === uid && item.month === selectedMonth);

      // Dados compartilhados filtrados por mês
      const sharedRevenueFilteredMunth = sharedRevenueData.filter(item => item.month === selectedMonth);
      const sharedExpenseFilteredMunth = sharedExpenseData.filter(item => item.month === selectedMonth);

      // Calcular totais incluindo dados compartilhados
      const totalRevenue = revenueFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);
      const totalExpense = expenseFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseFloat(curr.valueTransaction || '0'), 0);

      const totalRevenueMunth = revenueFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0) +
                               sharedRevenueFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);
      
      const totalExpenseMunth = expenseFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0) +
                               sharedExpenseFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction || '0'), 0);

      setTotalRevenueValue(totalRevenue);
      setTotalExpenseValue(totalExpense);
      setTotalRevenueValueMunth(totalRevenueMunth)
      setTotalExpenseValueMunth(totalExpenseMunth)
    }
  }, [uid, revenueData, expenseData, selectedMonth, sharedRevenueData, sharedExpenseData]);

  const totalValue = totalRevenueValue - totalExpenseValue;

  return {
    totalRevenue: totalRevenueValue,
    totalExpense: totalExpenseValue,
    tolalRevenueMunth: totalRevenueValueMunth,
    totalExpenseMunth: totalExpenseValueMunth,
    totalValue: totalValue
  };
}
