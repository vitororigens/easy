import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";
import { updateExpenses, updateMarkets, updateNotes } from "./updateShareInfo";

export type TNotificationType =
  | "sharing_invite"
  | "due_account"
  | "overdue_account";

export type TNotificationStatus =
  | "pending"
  | "sharing_accepted"
  | "sharing_rejected"
  | "read";

export type TNotificationSource =
  | "task"
  | "expense"
  | "revenue"
  | "note"
  | "market"
  | "notification";

export interface INotification {
  id: string;
  type: TNotificationType;
  status: TNotificationStatus;
  sender: string;
  receiver: string;
  createdAt: Timestamp;
  title: string;
  description: string;
  source: {
    id: string;
    type: TNotificationSource;
  };
}

export const createNotification = async (
  notification: Optional<Omit<INotification, "id">, "createdAt">
) => {
  const ref = await database.collection("Notifications").add({
    type: notification.type,
    status: notification.status,
    sender: notification.sender,
    receiver: notification.receiver,
    source: notification.source,
    createdAt: notification.createdAt ?? Timestamp.now(),
    title: notification.title,
    description: notification.description,
  });

  return ref;
};

interface IGetNotifications {
  profile: keyof Pick<INotification, "sender" | "receiver">;
  uid: string;
  type?: TNotificationType;
  status?: TNotificationStatus;
}

export const getNotifications = async ({ uid, profile }: IGetNotifications) => {
  const result = await database
    .collection("Notifications")
    .where(profile, "==", uid)
    .get();

  return (result.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as INotification[];
};

export const readNotification = async (id: string) => {
  await database.collection("Notifications").doc(id).update({ status: "read" });
};

export const acceptSharingNotification = async (id: string) => {
  // const notification = await database
  //   .collection("Notifications")
  //   .doc(id)
  //   .update({ status: "sharing_accepted" });

  const docRef = database.collection("Notifications").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("Documento não encontrado!");
  } else {
    const notification = doc.data();
    const sourceType = notification?.source.type;
    const senderId = notification?.sender;
    const sourceId = notification?.source.id;
    const receiverId = notification?.receiver;

    await docRef.update({ status: "sharing_accepted" });

    console.log("senderId", senderId);
    console.log("receiverId", receiverId);

    const sharingRef = database.collection("Sharing");

    const sharingSnapshot = await sharingRef
      .where("invitedBy", "==", senderId)
      .where("target", "==", receiverId)
      .get();

    for (const doc of (await sharingSnapshot).docs) {
      await sharingRef.doc(doc.id).update({
        status: "accepted",
      });
    }

    if (sourceType === "note") {
      updateNotes(sourceId, receiverId);

      // const docRef = database.collection("Notes").doc(sourceId);
      // const doc = await docRef.get();
      // if (doc.exists) {
      //   const data = doc.data();
      //   const updatedShareinfo = data?.shareInfo.map((item: any) => {
      //     if (item.uid === receiverId) {
      //       item.acceptedAt = new Date();
      //     }
      //     return item;
      //   });

      //   await docRef.update({
      //     shareInfo: updatedShareinfo,
      //   });
      // } else {
      //   console.log("nenhum documento encontrado");
      // }
    } else if (sourceType === "expense") {
      updateExpenses(sourceId, receiverId);
    } else if (sourceType === "market") {
      updateMarkets(sourceId, receiverId);
    }
  }
};

export const rejectSharingNotification = async (id: string) => {
  await database
    .collection("Notifications")
    .doc(id)
    .update({ status: "sharing_rejected" });
};
