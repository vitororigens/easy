import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";

export interface HistoryMarketsData {
  id: string;
  uid: string;
  name: string;
  finishedDate: string;
  finishedTime: string;
  markets: {
    createdAt: string;
    id: string;
    name: string;
  }[];
}

const useHistoryMarketsCollections = (
  collectionName: string
): HistoryMarketsData[] => {
  const [data, setData] = useState<HistoryMarketsData[]>([]);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: HistoryMarketsData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({
          id: doc.id,
          ...doc.data(),
        } as HistoryMarketsData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useHistoryMarketsCollections; 