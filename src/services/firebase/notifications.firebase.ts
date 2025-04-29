import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc, Timestamp } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';
import { Optional } from "../../@types/optional";
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

export const createNotification = async (notification: Omit<INotification, "id">) => {
  const notificationData = {
    ...notification,
    createdAt: notification.createdAt || Timestamp.now()
  };
  
  const docRef = await addDoc(collection(database, "Notifications"), notificationData);
  return docRef;
};

export const updateNotification = async (id: string, notification: Partial<INotification>) => {
  const notificationRef = doc(database, "Notifications", id);
  await updateDoc(notificationRef, notification);
};

export const findNotificationById = async (id: string) => {
  const docRef = doc(database, "Notifications", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as INotification;
};

interface IGetNotifications {
  uid: string;
  profile: string;
}

export const getNotifications = async ({ uid, profile }: IGetNotifications) => {
  const q = query(
    collection(database, "Notifications"),
    where(profile, "==", uid),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);

  const notifications = querySnapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data();
      if (!data.createdAt) {
        data.createdAt = Timestamp.now();
      }
      return {
        id: docSnapshot.id,
        ...data
      } as INotification;
    })
    .filter(notification => notification.createdAt)
    .sort((a, b) => {
      try {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      } catch (error) {
        return 0;
      }
    });

  return notifications;
};

export const deleteNotification = async (id: string) => {
  const notificationRef = doc(database, "Notifications", id);
  await deleteDoc(notificationRef);
};

export const readNotification = async (id: string) => {
  const notificationRef = doc(database, "Notifications", id);
  await updateDoc(notificationRef, { status: "read" });
};

export const acceptSharingNotification = async (id: string) => {
  const notificationRef = doc(database, "Notifications", id);
  const notificationDoc = await getDoc(notificationRef);
  
  if (!notificationDoc.exists) {
    throw new Error("Notification not found");
  }
  
  const notification = notificationDoc.data() as INotification;
  
  // Atualizar o status da notificação
  await updateDoc(notificationRef, { 
    status: "sharing_accepted" 
  });
  
  // Atualizar o status do compartilhamento
  const sharingRef = doc(database, "Sharing", notification.source.id);
  await updateDoc(sharingRef, { 
    status: "accepted" 
  });
  
  // Atualizar o status do item compartilhado
  if (notification.source.type === "expense") {
    await updateExpenses(notification.source.id, notification.receiver);
  } else if (notification.source.type === "market") {
    await updateMarkets(notification.source.id, notification.receiver);
  } else if (notification.source.type === "note") {
    await updateNotes(notification.source.id, notification.receiver);
  }
  
  return notification;
};

export const rejectSharingNotification = async (id: string) => {
  const notificationRef = doc(database, "Notifications", id);
  const notificationDoc = await getDoc(notificationRef);
  
  if (!notificationDoc.exists) {
    throw new Error("Notification not found");
  }
  
  const notification = notificationDoc.data() as INotification;
  
  // Atualizar o status da notificação
  await updateDoc(notificationRef, { 
    status: "sharing_rejected" 
  });
  
  // Atualizar o status do compartilhamento
  const sharingRef = doc(database, "Sharing", notification.source.id);
  await updateDoc(sharingRef, { 
    status: "rejected" 
  });
  
  return notification;
};
