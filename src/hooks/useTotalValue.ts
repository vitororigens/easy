import { useEffect, useState } from 'react';
import useFirestoreCollection, { ExpenseData } from './useFirestoreCollection';
import { useMonth } from '../context/MonthProvider';



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

  useEffect(() => {
    if (uid) {
      const revenueFiltered = revenueData.filter(item => item.uid === uid);
      const expenseFiltered = expenseData.filter(item => item.uid === uid);
      const revenueFilteredMunth = revenueData.filter(item => item.uid === uid && item.month === selectedMonth);
      const expenseFilteredMunth = expenseData.filter(item => item.uid === uid && item.month === selectedMonth);

      const totalRevenue = revenueFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction), 0);
      const totalExpense = expenseFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseFloat(curr.valueTransaction), 0);

      const totalRevenueMunth = revenueFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction), 0);
      const totalExpenseMunth = expenseFilteredMunth.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction), 0);

      setTotalRevenueValue(totalRevenue);
      setTotalExpenseValue(totalExpense);
      setTotalRevenueValueMunth(totalRevenueMunth)
      setTotalExpenseValueMunth(totalExpenseMunth)
    }
  }, [uid, revenueData, expenseData, selectedMonth]);

  const totalValue = totalRevenueValue - totalExpenseValue;

  return {
    totalRevenue: totalRevenueValue,
    totalExpense: totalExpenseValue,
    tolalRevenueMunth: totalRevenueValueMunth,
    totalExpenseMunth: totalExpenseValueMunth,
    totalValue: totalValue
  };
}
