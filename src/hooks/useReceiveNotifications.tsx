import { useState, useEffect } from "react";
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from '@react-native-firebase/firestore';
import { useUserAuth } from "./useUserAuth";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  hour: string;
  createdAt: Date;
}

export function useReceiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const db = getFirestore();
    const notificationsRef = collection(db, "User", user.uid, "Notifications");
    const notificationsQuery = query(notificationsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(notificationsQuery, snapshot => {
      const notificationsList: Notification[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        notificationsList.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          date: data.date,
          hour: data.hour,
          createdAt: data.createdAt.toDate(),
        });
      });
      setNotifications(notificationsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const markAsRead = async (notificationId: string) => {
    if (!user?.uid) return;

    try {
      const db = getFirestore();
      const notificationRef = doc(db, "User", user.uid, "Notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user?.uid) return;

    try {
      const db = getFirestore();
      const notificationRef = doc(db, "User", user.uid, "Notifications", notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    deleteNotification,
  };
}