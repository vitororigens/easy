import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { IMarket } from "../interfaces/IMarket";
import { useUserAuth } from "../hooks/useUserAuth";
import { Timestamp } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";
import { IMarketContext } from "../interfaces/IMarketContext";

const MarketContext = createContext<IMarketContext>({} as IMarketContext);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [markets, setMarkets] = useState<IMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserAuth();

  // Carregar mercados do Firebase
  useEffect(() => {
    if (!user?.uid) {
      console.log("Usuário não autenticado");
      return;
    }
    
    console.log("Iniciando carregamento de mercados para o usuário:", user.uid);
    setLoading(true);
    
    // Simplificar a consulta para depuração
    const marketsRef = database.collection("Markets");
    
    // Consulta simples para todos os mercados do usuário
    const unsubscribe = marketsRef
      .where("uid", "==", user.uid)
      .onSnapshot((snapshot) => {
        console.log("Snapshot recebido do Firebase");
        const marketData: IMarket[] = [];
        
        if (snapshot.empty) {
          console.log("Nenhum documento encontrado");
        } else {
          snapshot.forEach((doc) => {
            console.log("Documento encontrado:", doc.id, doc.data());
            marketData.push({ id: doc.id, ...doc.data() } as IMarket);
          });
        }
        
        console.log("Total de mercados carregados:", marketData.length);
        setMarkets(marketData);
        setLoading(false);
      }, (error) => {
        console.error("Erro ao carregar mercados:", error);
        setLoading(false);
      });

    return () => {
      console.log("Limpando listener de mercados");
      unsubscribe();
    };
  }, [user?.uid]);

  const addMarket = useCallback(async (market: Omit<IMarket, "id" | "createdAt">) => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      await database.collection("Markets").add({
        ...market,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao adicionar mercado:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateMarket = useCallback(async (id: string, market: Partial<IMarket>) => {
    setLoading(true);
    try {
      await database.collection("Markets").doc(id).update(market);
    } catch (error) {
      console.error("Erro ao atualizar mercado:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMarket = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await database.collection("Markets").doc(id).delete();
    } catch (error) {
      console.error("Erro ao deletar mercado:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMarketCompletion = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const marketRef = database.collection("Markets").doc(id);
      const doc = await marketRef.get();
      if (doc.exists) {
        const marketData = doc.data();
        await marketRef.update({
          status: !marketData?.status,
        });
      }
    } catch (error) {
      console.error("Erro ao alternar status do mercado:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MarketContext.Provider value={{
      markets,
      loading,
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