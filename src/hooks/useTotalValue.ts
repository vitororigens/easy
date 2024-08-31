import { useMemo, useState } from "react";
import useFirestoreCollection, { ExpenseData } from "./useFirestoreCollection";
import { useFilters } from "../context/FiltersContext";

export interface TotalValues {
  totalRevenue: number;
  totalExpense: number;
  tolalRevenueMunth: number;
  totalExpenseMunth: number;
  totalValue: number;
}

export function useTotalValue(uid: string | null): TotalValues {
  const revenue = useFirestoreCollection("Revenue");
  const expense = useFirestoreCollection("Expense");
  const {
    selectedTab,
    selectedMonth,
    selectedCategory,
    values: { minValue, maxValue },
  } = useFilters();

  const [totalRevenueValue, setTotalRevenueValue] = useState<number>(0);
  const [totalExpenseValue, setTotalExpenseValue] = useState<number>(0);
  const [totalRevenueValueMunth, setTotalRevenueValueMunth] =
    useState<number>(0);
  const [totalExpenseValueMunth, setTotalExpenseValueMunth] =
    useState<number>(0);

  useMemo(() => {
    if (uid) {
      // Aplicando os mesmos filtros em todas as etapas
      const applyFilters = (item: ExpenseData) => {
        return (
          item.uid === uid &&
          item.month === selectedMonth &&
          (selectedCategory === "all" ||
            item.category.toUpperCase() === selectedCategory.toUpperCase()) &&
          (!minValue || Number(item.valueTransaction) >= minValue) &&
          (!maxValue || Number(item.valueTransaction) <= maxValue)
        );
      };

      const applyBasicFilters = (item: ExpenseData) =>
        item.uid === uid && item.month === selectedMonth;

      // Filtrando a receita e a despesa
      const revenueFiltered = revenue.filter(
        selectedTab === "receitas" || !selectedTab
          ? applyFilters
          : applyBasicFilters
      );
      const expenseFiltered = expense.filter(
        selectedTab === "despesas" ? applyFilters : applyBasicFilters
      );

      // Calculando valores totais
      const totalRevenue = revenueFiltered.reduce(
        (acc: number, curr: ExpenseData) =>
          acc + parseFloat(curr.valueTransaction),
        0
      );
      const totalExpense = expenseFiltered.reduce(
        (acc: number, curr: ExpenseData) =>
          acc + parseFloat(curr.valueTransaction),
        0
      );

      // Calculando valores mensais (usando os mesmos filtros aplicados)
      const totalRevenueMunth = revenueFiltered.reduce(
        (acc: number, curr: ExpenseData) =>
          acc + parseFloat(curr.valueTransaction),
        0
      );
      const totalExpenseMunth = expenseFiltered.reduce(
        (acc: number, curr: ExpenseData) =>
          acc + parseFloat(curr.valueTransaction),
        0
      );

      setTotalRevenueValue(totalRevenue);
      setTotalExpenseValue(totalExpense);
      setTotalRevenueValueMunth(totalRevenueMunth);
      setTotalExpenseValueMunth(totalExpenseMunth);
    }
  }, [
    uid,
    revenue,
    expense,
    selectedMonth,
    selectedCategory,
    minValue,
    maxValue,
    selectedTab,
  ]);

  const totalValue = totalRevenueValue - totalExpenseValue;

  return {
    totalRevenue: totalRevenueValue,
    totalExpense: totalExpenseValue,
    tolalRevenueMunth: totalRevenueValueMunth,
    totalExpenseMunth: totalExpenseValueMunth,
    totalValue: totalValue,
  };
}
