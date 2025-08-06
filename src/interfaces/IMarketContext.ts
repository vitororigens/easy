import { IMarket } from './IMarket';

export interface IMarketContext {
  markets: IMarket[];
  loading: boolean;
  error: string | null;
  addMarket: (market: Omit<IMarket, 'id' | 'createdAt'>) => Promise<string | undefined>;
  updateMarket: (id: string, market: Partial<IMarket>) => Promise<void>;
  deleteMarket: (id: string) => Promise<void>;
  toggleMarketCompletion: (id: string) => Promise<void>;
}
