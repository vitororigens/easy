import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { IMarket } from "../interfaces/IMarket";
import { useUserAuth } from "../hooks/useUserAuth";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  Timestamp 
} from "@react-native-firebase/firestore";
import { IMarketContext } from "../interfaces/IMarketContext";

const MarketContext = createContext<IMarketContext>({} as IMarketContext);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [markets, setMarkets] = useState<IMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUserAuth();
  const db = getFirestore();

  // Real-time listener for markets
  useEffect(() => {
    if (!user.user?.uid) {
      console.log("Usuário não autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    // Query for user's own markets
    const myMarketsQuery = query(
      collection(db, "Markets"),
      where("uid", "==", user.user.uid)
    );

    // Query for shared markets
    const sharedMarketsQuery = query(
      collection(db, "Markets"),
      where("shareWith", "array-contains", user.user.uid)
    );

    // Set up real-time listeners
    const unsubscribeMyMarkets = onSnapshot(
      myMarketsQuery,
      (snapshot) => {
        const myMarkets = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          isOwner: true,
        })) as IMarket[];

        setMarkets((prevMarkets) => {
          // Remove old markets owned by user
          const filteredMarkets = prevMarkets.filter(
            (market) => market.uid !== user.user?.uid
          );
          return [...filteredMarkets, ...myMarkets];
        });
      },
      (error) => {
        console.error("Erro ao carregar mercados:", error);
        setError("Erro ao carregar mercados");
      }
    );

    const unsubscribeSharedMarkets = onSnapshot(
      sharedMarketsQuery,
      (snapshot) => {
        const sharedMarkets = snapshot.docs
          .map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
            isShared: true,
            isOwner: false,
          }))
          .filter((market: any) => market.id !== user.user?.uid) as IMarket[];

        setMarkets((prevMarkets) => {
          // Remove old shared markets
          const filteredMarkets = prevMarkets.filter(
            (market) => !market.shareWith?.includes(user.user?.uid || "")
          );
          return [...filteredMarkets, ...sharedMarkets];
        });
      },
      (error) => {
        console.error("Erro ao carregar mercados compartilhados:", error);
        setError("Erro ao carregar mercados compartilhados");
      }
    );

    setLoading(false);

    // Cleanup listeners
    return () => {
      unsubscribeMyMarkets();
      unsubscribeSharedMarkets();
    };
  }, [user.user?.uid]);

  const addMarket = useCallback(async (market: Omit<IMarket, "id" | "createdAt">) => {
    if (!user.user?.uid) return;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, "Markets"), {
        ...market,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar mercado:", error);
      setError("Erro ao adicionar mercado");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateMarket = useCallback(async (id: string, market: Partial<IMarket>) => {
    setLoading(true);
    setError(null);
    try {
      const marketRef = doc(db, "Markets", id);
      await updateDoc(marketRef, market);
    } catch (error) {
      console.error("Erro ao atualizar mercado:", error);
      setError("Erro ao atualizar mercado");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMarket = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('deleteMarket chamado para ID:', id, 'usuário:', user.user?.uid);
      const marketRef = doc(db, "Markets", id);
      const docSnap = await getDoc(marketRef);
      
      if (!docSnap.exists()) {
        throw new Error("Mercado não encontrado");
      }

      const marketData = docSnap.data();
      if (!marketData) {
        throw new Error("Dados do mercado não encontrados");
      }
      
      console.log('Dados do mercado:', { uid: marketData['uid'], shareWith: marketData['shareWith'], meuUid: user.user?.uid });
      
      // Se o usuário é o proprietário, excluir completamente
      if (marketData['uid'] === user.user?.uid) {
        console.log('Usuário é proprietário, deletando documento');
        await deleteDoc(marketRef);
      } else {
        // Se não é o proprietário, apenas remover do compartilhamento
        console.log('Usuário não é proprietário, removendo do shareWith');
        const updatedShareWith = marketData['shareWith']?.filter(
          (uid: string) => uid !== user.user?.uid
        ) || [];
        await updateDoc(marketRef, { shareWith: updatedShareWith });
      }
      console.log('Operação concluída com sucesso');
    } catch (error) {
      console.error("Erro ao deletar mercado:", error);
      setError("Erro ao deletar mercado");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user.user?.uid]);

  const toggleMarketCompletion = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const marketRef = doc(db, "Markets", id);
      const docSnap = await getDoc(marketRef);
      if (docSnap.exists()) {
        const marketData = docSnap.data();
        await updateDoc(marketRef, {
          status: !marketData?.['status'],
        });
      }
    } catch (error) {
      console.error("Erro ao alternar status do mercado:", error);
      setError("Erro ao alternar status do mercado");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MarketContext.Provider value={{
      markets,
      loading,
      error,
      addMarket,
      updateMarket,
      deleteMarket,
      toggleMarketCompletion,
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
} 