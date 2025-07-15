import { Optional } from "../../@types/optional";
import { Timestamp, collection, doc, getDoc, getDocs, query, where, runTransaction, updateDoc, getFirestore, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { IMarket } from "./market.firebase";
import { IExpense } from "./expenses.firebase";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

const database = getFirestore();

export interface IMarketHistory {
  id: string;
  markets: IMarket[];
  shareWith: string[];
  shareInfo: TShareInfo[];
  uid: string;
  priceAmount: number;
  expenseId: string;
  createdAt: Timestamp;
}

export const createMarketHistory = async ({
  markets,
  shareInfo,
  shareWith,
  uid,
  createdAt,
}: Omit<IMarketHistory, "id" | "priceAmount" | "expenseId">) => {
  const marketHistoryRef = doc(collection(database, "MarketHistory"));
  const expenseRef = doc(collection(database, "Expenses"));

  const priceAmount = markets.reduce(
    (acc, market) => acc + (market.price ?? 0) * (market.quantity ?? 0),
    0
  );

  const newExpenseObj: IExpense = {
    category: "mercado",
    createdAt,
    isRecurrent: false,
    price: priceAmount,
    shareInfo,
    shareWith,
    status: true,
    uid,
    description: "Compras de mercado",
  };

  const marketHistoryObj: Omit<IMarketHistory, "id"> = {
    markets,
    shareWith,
    shareInfo,
    uid,
    priceAmount,
    expenseId: expenseRef.id,
    createdAt,
  };

  await runTransaction(database, async (transaction) => {
    transaction.set(expenseRef, newExpenseObj);
    transaction.set(marketHistoryRef, marketHistoryObj);
  });

  console.log(marketHistoryRef.id);

  return {
    id: marketHistoryRef.id,
    ...marketHistoryObj,
  };
};

export const updateMarketHistory = async ({
  id,
  ...rest
}: Omit<
  Optional<IMarket, "name" | "shareInfo" | "shareWith">,
  "createdAt" | "uid"
>) => {
  const marketHistoryRef = doc(database, "MarketHistory", id);
  await updateDoc(marketHistoryRef, rest);
};

export const findMarketHistoryById = async (id: string) => {
  const docRef = doc(database, "MarketHistory", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as IMarketHistory;
};

export const listMarketHistories = async (uid: string) => {
  try {
    console.log('Buscando histórico para o usuário:', uid);
    
    // Consulta direta apenas pelos documentos do usuário
    const q = query(
      collection(database, "MarketHistory"),
      where("uid", "==", uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    const histories = querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const data = doc.data();
      console.log('Documento encontrado:', doc.id, data);
      return {
        id: doc.id,
        ...data,
        markets: data['markets'] || [],
      } as IMarketHistory;
    });

    console.log('Total de históricos encontrados:', histories.length);
    
    // Filtra novamente para garantir que só retorne do usuário correto
    const filteredHistories = histories.filter((history: IMarketHistory) => {
      const isOwner = history.uid === uid;  
      if (!isOwner) {
        console.log('Histórico ignorado - UID diferente:', history.id, history.uid);
      }
      return isOwner;
    });

    console.log('Total após filtragem:', filteredHistories.length);
    return filteredHistories;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};

export const listMarketHistoriesSharedWithMe = async (uid: string) => {
  try {
    console.log('Buscando histórico compartilhado para o usuário:', uid);
    
    // Consulta por documentos compartilhados com o usuário
    const q = query(
      collection(database, "MarketHistory"),
      where("shareWith", "array-contains", uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    const marketHistories = querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const data = doc.data();
      console.log('Documento compartilhado encontrado:', doc.id, data);
      return {
        id: doc.id,
        ...data,
        markets: data['markets'] || [],
      } as IMarketHistory;
    });

    console.log('Total de históricos compartilhados encontrados:', marketHistories.length);
    
    // Filtra para garantir que:
    // 1. O histórico NÃO é do próprio usuário
    // 2. O usuário está na lista de compartilhamento E aceitou
    const filteredHistories = marketHistories.filter((history: IMarketHistory) => {
      const isNotOwner = history.uid !== uid;
      const hasAccepted = history.shareInfo?.some(
        (info: TShareInfo) => info.uid === uid && info.acceptedAt !== null
      );

      if (!isNotOwner) {
        console.log('Histórico ignorado - é do próprio usuário:', history.id);
      }
      if (!hasAccepted) {
        console.log('Histórico ignorado - não aceito:', history.id);
      }

      return isNotOwner && hasAccepted;
    });

    console.log('Total após filtragem:', filteredHistories.length);
    return filteredHistories;
  } catch (error) {
    console.error('Erro ao buscar histórico compartilhado:', error);
    return [];
  }
};

interface IDeleteMarketHistoryProps {
  expenseId: string;
  marketHistoryId: string;
}

export const deleteMarketHistory = async ({
  expenseId,
  marketHistoryId,
}: IDeleteMarketHistoryProps) => {
  const expenseRef = doc(database, "Expenses", expenseId);
  const marketHistoryRef = doc(database, "MarketHistory", marketHistoryId);
  
  await runTransaction(database, async (transaction) => {
    transaction.delete(expenseRef);
    transaction.delete(marketHistoryRef);
  });
};
