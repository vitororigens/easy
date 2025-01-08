import { OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";
import axios from "axios";

const ONESIGNAL_APP_ID = Constants.expoConfig?.extra?.oneSignalAppId;
const REST_API_KEY =  Constants.expoConfig?.extra?.restApiKey;
const ONE_SIGNAL_BASE_URL = "https://api.onesignal.com";

interface ISendPushNotification {
  title: string;
  message: string;
  uid: string;
}

export const sendPushNotification = async ({ title, message, uid }:ISendPushNotification) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${REST_API_KEY}`,
  };

  const payload = {
    app_id: ONESIGNAL_APP_ID,
    filters: [
      {
        field: "tag",
        key: "user_id",
        relation: "=",
        value: uid,
      },
    ],
    headings: { en: title },
    contents: { en: message },
    
  };

  try {
    const response = await axios.post(
      `${ONE_SIGNAL_BASE_URL}/notifications`,
      payload,
      { headers }
    );
    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

interface ICreateUserTag {
  tag: string;
  value: string;
}

export const createUserTag = async ({ tag, value }: ICreateUserTag) => {
  OneSignal.User.addTag(tag, value);
};
