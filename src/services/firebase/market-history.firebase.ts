import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp, collection, doc, getDoc, getDocs, query, where, runTransaction, updateDoc, deleteDoc } from "@react-native-firebase/firestore";
import { IMarket } from "./market.firebase";
import { IExpense } from "./expenses.firebase";
import { endOfMonth, startOfMonth } from "date-fns";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

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
  const now = Timestamp.now().toDate();
  const start = Timestamp.fromDate(startOfMonth(now));
  const end = Timestamp.fromDate(endOfMonth(now));

  const q = query(
    collection(database, "MarketHistory"),
    where("uid", "==", uid),
    where("createdAt", ">=", start),
    where("createdAt", "<=", end)
  );
  
  const querySnapshot = await getDocs(q);
  
  return (querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarketHistory[];
};

export const listMarketHistoriesSharedWithMe = async (uid: string) => {
  const q = query(
    collection(database, "MarketHistory"),
    where("shareWith", "array-contains", uid)
  );
  
  const querySnapshot = await getDocs(q);
  
  const marketHistories = (querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarketHistory[];

  return marketHistories.filter((n) =>
    n.shareInfo.some(
      ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
    )
  );
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
