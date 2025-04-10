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
  
  return (querySnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as IMarket[];
};

export const listMarketsSharedWithMe = async (uid: string) => {
  const q = query(
    collection(database, "Markets"),
    where("shareWith", "array-contains", uid)
  );
  const querySnapshot = await getDocs(q);

  const markets = (querySnapshot.docs.map((doc) => ({
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
  const q = query(
    collection(database, "Markets"),
    where("uid", "==", uid)
  );
  const querySnapshot = await getDocs(q);

  const notes = querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as IMarket))
    .filter((doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0);

  return notes;
};

export const deleteMarket = async (id: string) => {
  const marketRef = doc(database, "Markets", id);
  await deleteDoc(marketRef);
};
