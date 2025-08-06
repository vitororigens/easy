import { collection, onSnapshot, query } from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { MarketplaceData } from './useMarketplaceCollections';
import { getFirestore } from '@react-native-firebase/firestore';

export interface HistoryMarketplaceData {
  id: string;
  uid: string;
  finishedDate: string;
  total: string;
  items: MarketplaceData[];
  idExpense: string;
}

const useHistoryMarketplaceCollections = (
  collectionName: string,
): HistoryMarketplaceData[] => {
  const [data, setData] = useState<HistoryMarketplaceData[]>([]);
  const db = getFirestore();
  useEffect(() => {
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: HistoryMarketplaceData[] = [];
      snapshot.forEach((doc: any) => {
        collectionData.push({
          id: doc.id,
          ...doc.data(),
        } as HistoryMarketplaceData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useHistoryMarketplaceCollections;
