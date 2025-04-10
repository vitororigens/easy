import { collection, onSnapshot, query } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";

export interface MarketplaceData {
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

const useMarketplaceCollections = (
  collectionName: string
): MarketplaceData[] => {
  const [data, setData] = useState<MarketplaceData[]>([]);

  useEffect(() => {
    // Usar Marketplace como coleção padrão
    const actualCollectionName = "Marketplace";
    const q = query(collection(database, actualCollectionName));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionData: MarketplaceData[] = [];
      snapshot.forEach((doc) => {
        collectionData.push({
          id: doc.id,
          ...doc.data(),
        } as MarketplaceData);
      });
      setData(collectionData);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

export default useMarketplaceCollections; 