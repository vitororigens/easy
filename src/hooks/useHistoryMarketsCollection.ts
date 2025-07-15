import { collection, onSnapshot, query, where } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { useUserAuth } from "./useUserAuth";
import { getFirestore } from "@react-native-firebase/firestore";

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
  const db = getFirestore();
  useEffect(() => {
    if (!user.user?.uid) {
      console.log("Usuário não autenticado no hook useMarketplaceCollections");
      setData([]);
      return;
    }

    console.log("Iniciando consulta do Marketplace para usuário:", user.user?.uid);

    // Usar Marketplace como coleção padrão e filtrar por uid
    const actualCollectionName = "Marketplace";
    const q = query(
      collection(db, actualCollectionName),
      where("uid", "==", user.user?.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Snapshot do Marketplace recebido");
      const collectionData: MarketplaceData[] = [];

      querySnapshot.forEach((doc: any) => {
        const docData = doc.data();
        console.log("Documento encontrado:", doc.id, docData.uid);
        collectionData.push({
          id: doc.id,
          ...docData,
        } as MarketplaceData);
      });

      console.log("Total de documentos encontrados:", collectionData.length);
      setData(collectionData);
    }, (error: any) => {
      console.error("Erro ao observar Marketplace:", error);
    });

    return () => {
      console.log("Limpando listener do Marketplace");
      unsubscribe();
    };
  }, [collectionName, user.user?.uid]);

  return data;
};

export default useMarketplaceCollections;