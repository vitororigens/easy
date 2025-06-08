import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";
import { Timestamp } from "firebase/firestore";

export interface ExpenseData {
  id: string;
  category: string;
  date: string;
  description: string;
  valueTransaction: string;
  repeat: boolean;
  uid: string;
  type: string;
  month: number;
  status: boolean;
  alert: boolean;
  name: string;
  valueItem: string;
  listAccounts: boolean;
  income: boolean;
  createdAt?: Timestamp;
  author?: string;
  shareWith?: string[];
  shareInfo?: {
    acceptedAt: Timestamp | null;
    uid: string;
    userName: string;
  }[];
}

const useFirestoreCollection = (collectionName: string) => {
  const [data, setData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: ExpenseData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({ id: doc.id, ...doc.data() } as ExpenseData);
      });
      setData(collectionData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
};

export default useFirestoreCollection;
