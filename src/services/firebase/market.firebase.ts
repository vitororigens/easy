import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

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
}

export const createMarket = async (market: Omit<IMarket, "id">) => {
  const docRef = await database.collection("Markets").add(market);

  return docRef;
};

export const createManyMarkets = async (markets: Omit<IMarket, "id">[]) => {
  const batch = database.batch();

  markets.forEach((market) => {
    const itemRef = database.collection("Markets").doc();
    batch.set(itemRef, market);
  });

  await batch.commit();
};

export const updateMarket = async ({
  id,
  ...rest
}: Omit<
  Optional<IMarket, "name" | "shareInfo" | "shareWith">,
  "createdAt" | "uid"
>) => {
  await database.collection("Markets").doc(id).update(rest);
};

export const findMarketById = async (id: string) => {
  const doc = await database.collection("Markets").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as IMarket;
};

export const listMarkets = async (uid: string) => {
  const data = await database
    .collection("Markets")
    .where("uid", "==", uid)
    .get();
  return (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarket[];
};

export const listMarketsSharedWithMe = async (uid: string) => {
  const data = await database
    .collection("Markets")
    .where("shareWith", "array-contains", uid)
    .get();

  const markets = (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IMarket[];

  return markets.filter((n) =>
    n.shareInfo.some(
      (shareInfo) => shareInfo.uid === uid && shareInfo.acceptedAt !== null
    )
  );
};

export const listMarketsSharedByMe = async (uid: string) => {
  const data = await database
    .collection("Markets")
    .where("uid", "==", uid)
    .get();

  const notes = data.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as IMarket))
    .filter((doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0);

  return notes;
};

export const deleteMarket = async (documentId: string) => {
  console.log(documentId);
  await database.collection("Markets").doc(documentId).delete();
};
