import { createContext, useContext, useState, ReactNode } from "react";

type ValuesType = {
  minValue: number | null;
  maxValue: number | null;
};

type FiltersContextType = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  values: ValuesType;
  setValues: ({ minValue, maxValue }: ValuesType) => void;
};

const FiltersContext = createContext({} as FiltersContextType);

export const useFilters = () => {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFilters must be used within a FiltersContext");
  }
  return context;
};

type FiltersProviderProps = {
  children: ReactNode;
};

export const FiltersProvider = ({ children }: FiltersProviderProps) => {
  // Obter o mês atual (0-11) e adicionar 1 para obter o formato 1-12
  const currentMonth = new Date().getMonth() + 1;

  // States
  const [selectedTab, setSelectedTab] = useState("")

  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth
  );

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [values, setValues] = useState<ValuesType>({
    minValue: null,
    maxValue: null,
  });

  return (
    <FiltersContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        selectedMonth,
        setSelectedMonth,
        selectedCategory,
        setSelectedCategory,
        values,
        setValues,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
