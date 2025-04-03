import { OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";
import axios from "axios";

const ONESIGNAL_APP_ID = "04b5e397-b327-469b-a9f2-9ac8a22a039f";
const REST_API_KEY =
  "os_v2_app_as26hf5te5djxkpstlekekqdt4oahagr6xyejcez2hdgol5ykcixw7hqbz2qvittluo6sr5ihlq2kdzxbd5bal3uo2cx36jzpllwxxy";
const ONE_SIGNAL_BASE_URL = "https://api.onesignal.com";

interface ISendPushNotification {
  title: string;
  message: string;
  uid: string;
}

export const sendPushNotification = async ({
  title,
  message,
  uid,
}: ISendPushNotification) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${REST_API_KEY}`,
  };

  console.log("valor uid", uid);
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    filters: [
      {
        field: "tag",
        key: "id",
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
