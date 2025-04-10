import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';
import { Optional } from "../../@types/optional";
import { Timestamp } from "@react-native-firebase/firestore";

export type TSharingStatus = "accepted" | "pending" | "rejected";

export enum ESharingStatus {
  ACCEPTED = "accepted",
  PENDING = "pending",
  REJECTED = "rejected",
}

export const sharingStatusMapper: Record<TSharingStatus, string> = {
  accepted: "Aceito",
  pending: "Pendente",
  rejected: "Rejeitado",
};

export interface ISharing {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: TSharingStatus;
  invitedBy: string;
  target: string;
  //notificationTarget: string;
}

export const createSharing = async (sharing: Omit<ISharing, "id">) => {
  const docRef = await addDoc(collection(database, "Sharing"), sharing);
  return docRef;
};

export const updateSharing = async (id: string, sharing: Partial<ISharing>) => {
  const sharingRef = doc(database, "Sharing", id);
  await updateDoc(sharingRef, sharing);
};

export const findSharingById = async (id: string) => {
  const docRef = doc(database, "Sharing", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as ISharing;
};

interface IGetSharing {
  profile: string;
  uid: string;
  status?: boolean;
}

export const getSharing = async ({ uid, profile, status }: IGetSharing) => {
  let q = query(
    collection(database, "Sharing"),
    where(profile, "==", uid)
  );

  if (status !== undefined) {
    q = query(q, where("status", "==", status));
  }
  
  q = query(q, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ISharing[];
};

export const acceptSharing = async (id: string) => {
  const sharingRef = doc(database, "Sharing", id);
  await updateDoc(sharingRef, { status: ESharingStatus.ACCEPTED });
};

export const rejectSharing = async (id: string) => {
  const sharingRef = doc(database, "Sharing", id);
  await updateDoc(sharingRef, { status: ESharingStatus.REJECTED });
};

export const deleteSharing = async (id: string) => {
  const sharingRef = doc(database, "Sharing", id);
  await deleteDoc(sharingRef);
};
