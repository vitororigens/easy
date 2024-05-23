import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { database } from '../services';

export interface MarketplaceData {
  uid: string;
  amount: number;
  category: string;
  description: string;
  measurements: string;
  name: string;
  valueItem: number;
  id:string;
  createdAt?:string;
  totalValue?: number
}

const useMarketplaceCollections = (
  collectionName: string 
): MarketplaceData[] => {
  const [data, setData] = useState<MarketplaceData[]>([]);

  useEffect(() => {
    const unsubscribe = database.collection(collectionName).onSnapshot(
      (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const collectionData: MarketplaceData[] = [];
        snapshot.forEach(doc => {
          collectionData.push({ id: doc.id, ...doc.data() } as MarketplaceData);
        });
        setData(collectionData);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useMarketplaceCollections;
