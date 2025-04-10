import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";

export interface HistoryTasksData {
  id: string;
  uid: string;
  name: string;
  finishedDate: string;
  finishedTime: string;
  tasks: {
    createdAt: string;
    id: string;
    name: string;
  }[];
}

const useHistoryTasksCollections = (
  collectionName: string
): HistoryTasksData[] => {
  const [data, setData] = useState<HistoryTasksData[]>([]);
  console.log(data);

  useEffect(() => {
    const q = query(collection(database, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: HistoryTasksData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({
          id: doc.id,
          ...doc.data(),
        } as HistoryTasksData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useHistoryTasksCollections;
