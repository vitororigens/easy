import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore } from "@react-native-firebase/firestore";

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
  const db = getFirestore();
  useEffect(() => {
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      const collectionData: HistoryTasksData[] = [];
      snapshot.forEach((doc: any) => {
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
