import { collection, onSnapshot, query, where } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../libs/firebase";
import { useUserAuth } from "./useUserAuth";

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
  const user = useUserAuth();

  useEffect(() => {
    if (!user?.uid) {
      console.log("Usuário não autenticado no hook useMarketplaceCollections");
      setData([]);
      return;
    }

    console.log("Iniciando consulta do Marketplace para usuário:", user.uid);
    
    // Usar Marketplace como coleção padrão e filtrar por uid
    const actualCollectionName = "Marketplace";
    const q = query(
      collection(database, actualCollectionName),
      where("uid", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot do Marketplace recebido");
      const collectionData: MarketplaceData[] = [];
      
      snapshot.forEach((doc) => {
        const docData = doc.data();
        console.log("Documento encontrado:", doc.id, docData.uid);
        collectionData.push({
          id: doc.id,
          ...docData,
        } as MarketplaceData);
      });
      
      console.log("Total de documentos encontrados:", collectionData.length);
      setData(collectionData);
    }, (error) => {
      console.error("Erro ao observar Marketplace:", error);
    });

    return () => {
      console.log("Limpando listener do Marketplace");
      unsubscribe();
    };
  }, [collectionName, user?.uid]);

  return data;
};

export default useMarketplaceCollections; 