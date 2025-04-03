import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";

export interface HistoryTasksData {
  id: string;
  uid: string;
  finishedDate: string;
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

  useEffect(() => {
    const unsubscribe = database
      .collection(collectionName)
      .onSnapshot((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
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
