import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";
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
  const marketHistoryRef = database.collection("MarketHistory").doc();
  const expenseRef = database.collection("Expenses").doc();

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

  await database.runTransaction(async (transaction) => {
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
  await database.collection("MarketHistory").doc(id).update(rest);
};

export const findMarketHistoryById = async (id: string) => {
  const doc = await database.collection("MarketHistory").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as IMarketHistory;
};

export const listMarketHistories = async (uid: string) => {
  const now = Timestamp.now().toDate();
  const start = Timestamp.fromDate(startOfMonth(now));
  const end = Timestamp.fromDate(endOfMonth(now));

  const data = await database
    .collection("MarketHistory")
    .where("uid", "==", uid)
    .where("createdAt", ">=", start)
    .where("createdAt", "<=", end)
    .orderBy("createdAt", "desc")
    .get();
  return (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarketHistory[];
};

export const listMarketHistoriesSharedWithMe = async (uid: string) => {
  const data = await database
    .collection("MarketHistory")
    .where("shareWith", "array-contains", uid)
    .get();

  const markets = (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarketHistory[];

  return markets.filter((n) =>
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
  const expenseRef = database.collection("Expenses").doc(expenseId);
  const marketHistoryRef = database
    .collection("MarketHistory")
    .doc(marketHistoryId);
  await database.runTransaction(async (t) => {
    t.delete(expenseRef);
    t.delete(marketHistoryRef);
  });
};
