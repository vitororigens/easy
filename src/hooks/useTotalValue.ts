import { useEffect, useState } from 'react';
import useFirestoreCollection, { ExpenseData } from './useFirestoreCollection';


export interface TotalValues {
  totalRevenue: number;
  totalExpense: number;
  totalValue: number;
}

export function useTotalValue(uid: string | null): TotalValues {
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');

  const [totalRevenueValue, setTotalRevenueValue] = useState<number>(0);
  const [totalExpenseValue, setTotalExpenseValue] = useState<number>(0);

  useEffect(() => {
    if (uid) {
      const revenueFiltered = revenue.filter(item => item.uid === uid);
      const expenseFiltered = expense.filter(item => item.uid === uid);

      const totalRevenue = revenueFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseInt(curr.valueTransaction), 0);
      const totalExpense = expenseFiltered.reduce((acc: number, curr: ExpenseData) => acc + parseFloat(curr.valueTransaction), 0);

      setTotalRevenueValue(totalRevenue);
      setTotalExpenseValue(totalExpense);
    }
  }, [uid, revenue, expense]);

  const totalValue = totalRevenueValue - totalExpenseValue;

  return {
    totalRevenue: totalRevenueValue,
    totalExpense: totalExpenseValue,
    totalValue: totalValue
  };
}
