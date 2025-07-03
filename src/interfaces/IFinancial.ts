import { Timestamp } from "@react-native-firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IFinancial {
  id: string;
  uid: string;
  name: string;
  category: string;
  description?: string;
  valueTransaction: string;
  date: string;
  month: number;
  repeat: boolean;
  status: boolean;
  type: "input" | "output";
  createdAt: Timestamp;
  shareWith: string[];
  shareInfo: TShareInfo[];
} 