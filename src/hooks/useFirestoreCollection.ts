import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { useUserAuth } from "./useUserAuth";
import { useMonth } from "../context/MonthProvider";
import { Alert, Linking } from "react-native";

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
  createdAt?: any;
  author?: string;
  shareWith?: string[];
  shareInfo?: {
    acceptedAt: any;
    uid: string;
    userName: string;
  }[];
}

const useFirestoreCollection = (collectionName: string) => {
  const [data, setData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserAuth();
  const { selectedMonth } = useMonth();

  const handleIndexError = (error: any, type: 'own' | 'shared') => {
    console.error(`Erro ao observar documentos ${type} de ${collectionName}:`, error);
    
    if (error.code === 'firestore/failed-precondition' && error.message.includes('index')) {
      const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0];
      
      if (indexUrl) {
        Alert.alert(
          'Índice necessário',
          'É necessário criar um índice no Firebase para esta consulta. Deseja criar agora?',
          [
            {
              text: 'Criar índice',
              onPress: () => Linking.openURL(indexUrl)
            },
            {
              text: 'Cancelar',
              style: 'cancel'
            }
          ]
        );
      }
    }
    
    setError(error.message);
  };

  useEffect(() => {
    let isMounted = true;
    
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      console.log(`Iniciando listener para coleção: ${collectionName}`);
      
      // Query for user's own documents
      const ownQuery = firestore()
        .collection(collectionName)
        .where('month', '==', selectedMonth)
        .where('uid', '==', user.uid)
        .orderBy('createdAt', 'desc');

      // Query for shared documents
      const sharedQuery = firestore()
        .collection(collectionName)
        .where('month', '==', selectedMonth)
        .where('shareWith', 'array-contains', user.uid)
        .orderBy('createdAt', 'desc');
      
      // Subscribe to both queries
      const unsubscribe1 = ownQuery.onSnapshot(
        (snapshot) => {
          if (!isMounted || !snapshot) return;
          
          console.log(`Snapshot recebido para ${collectionName} (próprios). Total de documentos: ${snapshot.size}`);
          
          const ownData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ExpenseData[];
          
          setData(prev => {
            const sharedDocs = prev.filter(doc => doc.shareWith?.includes(user.uid));
            return [...ownData, ...sharedDocs];
          });
        },
        (error) => handleIndexError(error, 'own')
      );

      const unsubscribe2 = sharedQuery.onSnapshot(
        (snapshot) => {
          if (!isMounted || !snapshot) return;

          console.log(`Snapshot recebido para ${collectionName} (compartilhados). Total de documentos: ${snapshot.size}`);

          const sharedData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ExpenseData[];

          setData(prev => {
            const ownDocs = prev.filter(doc => doc.uid === user.uid);
            return [...ownDocs, ...sharedData];
          });
        },
        (error) => handleIndexError(error, 'shared')
      );

      setLoading(false);

      return () => {
        console.log(`Limpando listeners da coleção: ${collectionName}`);
        isMounted = false;
        unsubscribe1();
        unsubscribe2();
      };
    } catch (err) {
      if (!isMounted) return;
      console.error(`Erro ao configurar listener para ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLoading(false);
    }
  }, [collectionName, user?.uid, selectedMonth]);

  return { data, loading, error };
};

export default useFirestoreCollection;
