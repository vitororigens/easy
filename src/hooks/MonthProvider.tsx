import React, { createContext, useContext, useState, ReactNode } from "react";

type MonthContextType = {
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
};

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const useMonth = () => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
};

type MonthProviderProps = {
  children: ReactNode;
};

export const MonthProvider = ({ children }: MonthProviderProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};
