import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";

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
  collectionName: string
): MarketplaceData[] => {
  const [data, setData] = useState<MarketplaceData[]>([]);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: MarketplaceData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({ id: doc.id, ...doc.data() } as MarketplaceData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};
