import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";

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
}

const useFirestoreCollection = (collectionName: string): ExpenseData[] => {
  const [data, setData] = useState<ExpenseData[]>([]);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: ExpenseData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({ id: doc.id, ...doc.data() } as ExpenseData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useFirestoreCollection;
