import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IExpense {
  name: string;
  category?: string;
  uid?: string;
  date: string;
  valueTransaction: string;
  description?: string;
  repeat: boolean;
  type: string;
  month: number;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createRevenue = async (note: Omit<IExpense, "id">) => {
  const docRef = await database.collection("Revenue").add(note);

  return docRef;
};
