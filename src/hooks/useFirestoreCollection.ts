import { useState, useEffect } from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; 
import { database } from '../services';

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
}


const useFirestoreCollection = (
  collectionName: string 
): ExpenseData[] => {
  const [data, setData] = useState<ExpenseData[]>([]);

  useEffect(() => {
    const unsubscribe = database.collection(collectionName).onSnapshot(
      (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const collectionData: ExpenseData[] = [];
        snapshot.forEach(doc => {
          collectionData.push({ id: doc.id, ...doc.data() } as ExpenseData);
        });
        setData(collectionData);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useFirestoreCollection;
