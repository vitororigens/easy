import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { MarketplaceData } from "./useMarketplaceCollections";
import { database } from "../libs/firebase";

export interface HistoryMarketplaceData {
  id: string;
  uid: string;
  finishedDate: string;
  total: string;
  items: MarketplaceData[];
  idExpense: string;
}

const useHistoryMarketplaceCollections = (
  collectionName: string
): HistoryMarketplaceData[] => {
  const [data, setData] = useState<HistoryMarketplaceData[]>([]);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: HistoryMarketplaceData[] = [];
      snapshot.forEach((doc) => {
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
