import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

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

export const createSharing = async (
  sharing: Optional<Omit<ISharing, "id">, "createdAt" | "updatedAt">
): Promise<ISharing> => {
  const data = {
    status: ESharingStatus.PENDING,
    invitedBy: sharing.invitedBy,
    //  notificationTarget: sharing.notificationTarget,
    target: sharing.target,
    updatedAt: sharing.updatedAt ?? Timestamp.now(),
    createdAt: sharing.createdAt ?? Timestamp.now(),
  };
  const ref = await database.collection("Sharing").add(data);

  return {
    ...data,
    id: ref.id,
  };
};

interface IGetSharing {
  profile: keyof Pick<ISharing, "invitedBy" | "target">;
  uid: string;
  status?: TSharingStatus;
}

export const getSharing = async ({ uid, profile, status }: IGetSharing) => {
  let query = database.collection("Sharing").where(profile, "==", uid);

  if (status) {
    query = query.where("status", "==", status);
  }
  const result = await query.orderBy("createdAt", "desc").get();

  const Results = (result.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as ISharing[];
  console.log("resultados", Results);
  return Results;
};

export const acceptSharing = async (id: string) => {
  await database
    .collection("Sharing")
    .doc(id)
    .update({ status: ESharingStatus.ACCEPTED });
};

export const rejectSharing = async (id: string) => {
  await database
    .collection("Sharing")
    .doc(id)
    .update({ status: ESharingStatus.REJECTED });
};

export const deleteSharing = async (id: string) => {
  await database.collection("Sharing").doc(id).delete();
};
