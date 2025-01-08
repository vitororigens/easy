import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

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
  console.log("notification", notification);
  const ref = await database.collection("Notifications").add({
    type: notification.type,
    status: notification.status,
    sender: notification.sender,
    receiver: notification.receiver,
    source: notification.source,
    createdAt: notification.createdAt ?? Timestamp.now(),
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
  await database
    .collection("Notifications")
    .doc(id)
    .update({ status: "sharing_accepted" });
};

export const rejectSharingNotification = async (id: string) => {
  await database
    .collection("Notifications")
    .doc(id)
    .update({ status: "sharing_rejected" });
};
