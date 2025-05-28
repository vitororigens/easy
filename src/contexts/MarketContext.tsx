import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { IMarket } from "../interfaces/IMarket";
import { useUserAuth } from "../hooks/useUserAuth";
import { Timestamp } from "@react-native-firebase/firestore";
import { database } from "../libs/firebase";
import { IMarketContext } from "../interfaces/IMarketContext";
import { listMarkets, listMarketsSharedWithMe, listMarketsSharedByMe } from "../services/firebase/market.firebase";

const MarketContext = createContext<IMarketContext>({} as IMarketContext);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [markets, setMarkets] = useState<IMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserAuth();

  // Carregar mercados do Firebase
  useEffect(() => {
    if (!user.user?.uid) {
      console.log("Usuário não autenticado");
      return;
    }
    
    console.log("Iniciando carregamento de mercados para o usuário:", user.user.uid);
    setLoading(true);
    
    const fetchMarkets = async () => {
      try {
        console.log("Buscando mercados...");
        const [myMarkets, sharedWithMe, sharedByMe] = await Promise.all([
          listMarkets(user.user?.uid || ""),
          listMarketsSharedWithMe(user.user?.uid || ""),
          listMarketsSharedByMe(user.user?.uid || ""),
        ]);

        console.log("Resultados da busca:", {
          meusMercados: myMarkets.map(m => ({ id: m.id, name: m.name })),
          compartilhadosComigo: sharedWithMe.map(m => ({ id: m.id, name: m.name, shareInfo: m.shareInfo })),
          compartilhadosPorMim: sharedByMe.map(m => ({ id: m.id, name: m.name }))
        });

        // Combinar todos os mercados
        const allMarkets = [
          ...myMarkets,
          ...sharedWithMe,
          ...sharedByMe.map(market => ({
            ...market,
            isOwner: true,
            isShared: true
          }))
        ];

        console.log("Total de mercados combinados:", allMarkets.length);
        console.log("Mercados combinados:", allMarkets.map(m => ({ 
          id: m.id, 
          name: m.name,
          isOwner: m.isOwner,
          isShared: m.isShared,
          shareInfo: m.shareInfo
        })));
        
        setMarkets(allMarkets);
      } catch (error) {
        console.error("Erro ao carregar mercados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [user.user?.uid]);

  const addMarket = useCallback(async (market: Omit<IMarket, "id" | "createdAt">) => {
    if (!user.user?.uid) return;
    
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
      if (doc.exists()) {
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