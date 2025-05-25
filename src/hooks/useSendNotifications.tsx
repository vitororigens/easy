import { useState, useEffect } from "react";
import axios from "axios";
import { OneSignal } from 'react-native-onesignal';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  addDoc 
} from '@react-native-firebase/firestore';
import { useUserAuth } from "./useUserAuth";

interface NotificationData {
  title: string;
  message: string;
  subscriptionsIds: string[];
  date: string;
  hour: string;
}

const useSendNotifications = () => {
  const ONE_SIGNAL_APP_ID = "3b16368c-774d-4731-99e9-1913fcf06041";
  const ONE_SIGNAL_REST_API_KEY = "MGRmY2Q3MzAtN2E4ZC00ODViLWI0NDYtMGUwNjQ2YmUzMzg2";

  const [load, setLoad] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null); 
  const [notificationId, setNotificationId] = useState<string | null>(null);

  const user = useUserAuth();
  const db = getFirestore();

  const api = axios.create({
    baseURL: "https://api.onesignal.com/",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
    },
  });

  useEffect(() => {
    OneSignal.Notifications.requestPermission(true);
    OneSignal.initialize(ONE_SIGNAL_APP_ID);

    OneSignal.User.pushSubscription.getIdAsync().then(id => {
      if (id) {
        console.log("Push Subscription ID:", id);
        setSubscriptionId(id);
      }
    });

    OneSignal.User.getOnesignalId().then(async (id) => {
      console.log("OneSignal ID:", id);
      setPlayerId(id); 

      if (user?.uid && id) {
        const userRef = doc(db, "User", user.uid);
        await setDoc(userRef, { playerId: id }, { merge: true });
      }
    });
  }, []);

  const sendNotification = async (data: NotificationData) => {
    const sendAfter = (() => {
      try {
        return new Date(`${data.date.split('/').reverse().join('-')}T${data.hour}:00-03:00`).toISOString();
      } catch (e) {
        console.warn("Data inválida:", data.date, data.hour);
        return null;
      }
    })();
  
    if (!data.subscriptionsIds?.length || !sendAfter) {
      console.warn("Notificação não enviada. Faltando dados obrigatórios.");
      return;
    }

    const notificationData = {
      app_id: ONE_SIGNAL_APP_ID,
      include_player_ids: data.subscriptionsIds,
      headings: { en: data.title },
      contents: { en: data.message },
      target_channel: "push",
      send_after: sendAfter,
    };

    try {
      setLoad(true);
      const response = await api.post("notifications", notificationData);
      console.log("Notificação enviada com sucesso:", response.data);

      for (const userId of data.subscriptionsIds) {
        const notificationsRef = collection(db, "User", userId, "Notifications");
        await addDoc(notificationsRef, {
          title: data.title,
          message: data.message,
          date: data.date,
          hour: data.hour,
          createdAt: new Date(),
        });
      }

      setNotificationId(response.data.id);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    } finally {
      setLoad(false);
    }
  };

  return {
    api,
    sendNotification,
    load,
    playerId,
    subscriptionId,
    notificationId
  };
};

export default useSendNotifications;
