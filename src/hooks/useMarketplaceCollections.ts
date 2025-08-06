import { collection, onSnapshot, query, getFirestore} from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

export interface MarketplaceData {
  uid: string;
  amount: number;
  category: string;
  description: string;
  measurements: string;
  name: string;
  valueItem: number;
  id: string;
  createdAt?: string;
  totalValue?: number;
  sharedWith?: string[];
}

export const useMarketplaceCollections = (
  collectionName: string,
): MarketplaceData[] => {
  const [data, setData] = useState<MarketplaceData[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: MarketplaceData[] = [];
      snapshot.forEach((doc: any) => {
        collectionData.push({ id: doc.id, ...doc.data() } as MarketplaceData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};
