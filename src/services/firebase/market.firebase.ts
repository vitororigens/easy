import { collection, addDoc, doc, getDoc, getDocs, query, where, writeBatch, deleteDoc, updateDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';
import { Optional } from "../../@types/optional";
import { Timestamp } from "@react-native-firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IMarket {
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  category?: string;
  measurement?: string;
  observation?: string;
  uid: string;
  createdAt: Timestamp;
  shareWith: string[];
  shareInfo: TShareInfo[];
  status?: boolean;
  isOwner?: boolean;
  isShared?: boolean;
}

export const createMarket = async (market: Omit<IMarket, "id">) => {
  const docRef = await addDoc(collection(database, "Markets"), market);
  return docRef;
};

export const createManyMarkets = async (markets: Omit<IMarket, "id">[]) => {
  const batch = writeBatch(database);

  markets.forEach((market) => {
    const docRef = doc(collection(database, "Markets"));
    batch.set(docRef, market);
  });

  await batch.commit();
};

export const updateMarket = async (id: string, market: Partial<IMarket>) => {
  const marketRef = doc(database, "Markets", id);
  await updateDoc(marketRef, market);
};

export const findMarketById = async (id: string) => {
  const docRef = doc(database, "Markets", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as IMarket;
};

export const listMarkets = async (uid: string) => {
  const q = query(collection(database, "Markets"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  
  const markets = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    isOwner: true
  })) as IMarket[];

  return markets;
};

export const listMarketsSharedWithMe = async (uid: string) => {
  console.log("Buscando mercados compartilhados para o usuário:", uid);
  
  try {
    // Primeiro, buscar todos os mercados onde o usuário está em shareWith
  const q = query(
    collection(database, "Markets"),
    where("shareWith", "array-contains", uid)
  );
  const querySnapshot = await getDocs(q);

    const markets = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Documento encontrado:", {
        id: doc.id,
        shareWith: data.shareWith,
        shareInfo: data.shareInfo,
        uid: data.uid
      });
      return {
    id: doc.id,
        ...data,
      };
    }) as IMarket[];

    console.log("Total de mercados encontrados:", markets.length);
    console.log("Mercados encontrados:", markets);

    // Filtrar apenas os mercados onde o usuário está em shareWith
    const filteredMarkets = markets.filter((market) => {
      const shareInfo = market.shareInfo?.find(info => info.uid === uid);
      console.log("Verificando mercado:", {
        id: market.id,
        shareWith: market.shareWith,
        shareInfo: shareInfo,
        uid: market.uid
      });
      return shareInfo !== undefined;
    });

    console.log("Mercados filtrados:", filteredMarkets.length);
    console.log("Mercados filtrados:", filteredMarkets);

    // Adicionar a propriedade isShared
    const marketsWithShared = filteredMarkets.map(market => ({
      ...market,
      isShared: true,
      isOwner: false
    }));

    return marketsWithShared;
  } catch (error) {
    console.error("Erro ao buscar mercados compartilhados:", error);
    return [];
  }
};

export const listMarketsSharedByMe = async (uid: string): Promise<IMarket[]> => {
  const q = query(collection(database, "Markets"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const markets = querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as IMarket))
    .filter(
      (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as IMarket[];

  return markets;
};

export const deleteMarket = async (id: string) => {
  const marketRef = doc(database, "Markets", id);
  await deleteDoc(marketRef);
};
