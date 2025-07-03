import { IFinancial } from "./IFinancial";

export interface IFinancialContext {
  financials: IFinancial[];
  loading: boolean;
  addFinancial: (financial: Omit<IFinancial, "id" | "createdAt">) => Promise<void>;
  updateFinancial: (id: string, financial: Partial<IFinancial>) => Promise<void>;
  deleteFinancial: (id: string) => Promise<void>;
  toggleFinancialStatus: (id: string) => Promise<void>;
} 