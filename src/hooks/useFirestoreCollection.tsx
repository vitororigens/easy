import { useState, useEffect } from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; 
import { database } from '../services';

interface ExpenseData {
  id: string;
  categoria: string;
  date: string;
  description: string;
  valueTransaction: string;
  repeat: boolean;
  uid: string;
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
