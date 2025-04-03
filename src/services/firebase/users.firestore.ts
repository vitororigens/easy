import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { database } from "../../libs/firebase";

export interface IUser extends FirebaseAuthTypes.User {
  userName: string;
}

export const findUserByUsername = async (username: string, me: string) => {
  if (!username) {
    return [];
  }

  const result = await database
    .collection("User")
    .where("uid", "!=", me)
    .where("userName", ">=", username)
    .where("userName", "<", username + "\uf8ff")
    .get();

  return (result.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) ?? []) as IUser[];
};

export const findUserById = async (uid: string) => {
  const result = await database.collection("User").doc(uid).get();

  return result.data() as IUser;
}