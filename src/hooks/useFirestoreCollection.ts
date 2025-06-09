import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";
import { Timestamp } from "firebase/firestore";

export interface ExpenseData {
  id: string;
  category: string;
  date: string;
  description: string;
  valueTransaction: string;
  repeat: boolean;
  uid: string;
  type: string;
  month: number;
  status: boolean;
  alert: boolean;
  name: string;
  valueItem: string;
  listAccounts: boolean;
  income: boolean;
  createdAt?: Timestamp;
  author?: string;
  shareWith?: string[];
  shareInfo?: {
    acceptedAt: Timestamp | null;
    uid: string;
    userName: string;
  }[];
}

const useFirestoreCollection = (collectionName: string) => {
  const [data, setData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    try {
      console.log(`Iniciando listener para coleção: ${collectionName}`);
      const q = query(
        collection(database, collectionName),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          if (!isMounted) return;
          
          console.log(`Snapshot recebido para ${collectionName}. Total de documentos: ${snapshot.docs.length}`);
          const collectionData: ExpenseData[] = [];
          
          snapshot.docChanges().forEach((change) => {
            const docData = { id: change.doc.id, ...change.doc.data() } as ExpenseData;
            
            if (change.type === "added") {
              console.log(`Novo documento adicionado: ${docData.id}`);
              collectionData.push(docData);
            } else if (change.type === "modified") {
              console.log(`Documento modificado: ${docData.id}`);
              const index = collectionData.findIndex(item => item.id === docData.id);
              if (index !== -1) {
                collectionData[index] = docData;
              }
            } else if (change.type === "removed") {
              console.log(`Documento removido: ${docData.id}`);
              const index = collectionData.findIndex(item => item.id === docData.id);
              if (index !== -1) {
                collectionData.splice(index, 1);
              }
            }
          });
          
          setData(collectionData);
          setLoading(false);
        },
        (error) => {
          if (!isMounted) return;
          console.error(`Erro ao observar coleção ${collectionName}:`, error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log(`Limpando listener da coleção: ${collectionName}`);
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      if (!isMounted) return;
      console.error(`Erro ao configurar listener para ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  }, [collectionName]);

  return { data, loading, error };
};

export default useFirestoreCollection;
