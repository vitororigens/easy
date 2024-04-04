import { useState, useEffect } from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; 
import { database } from '../services';

export interface MarketplaceData {
  uid: string;
  amount: number;
  category: string;
  description: string;
  measurements: string;
  name: string;
  valueItem: string;
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
          collectionData.push({ uid: doc.id, ...doc.data() } as MarketplaceData);
        });
        setData(collectionData);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useMarketplaceCollections;
