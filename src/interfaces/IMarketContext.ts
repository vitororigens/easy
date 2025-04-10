import { IMarket } from "./IMarket";

export interface IMarketContext {
  markets: IMarket[];
  loading: boolean;
  addMarket: (market: Omit<IMarket, "id" | "createdAt">) => Promise<void>;
  updateMarket: (id: string, market: Partial<IMarket>) => Promise<void>;
  deleteMarket: (id: string) => Promise<void>;
  toggleMarketCompletion: (id: string) => Promise<void>;
} 