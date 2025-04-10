import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';

export interface IUser {
  uid: string;
  userName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createUser = async (user: Omit<IUser, "uid">) => {
  const docRef = await addDoc(collection(database, "User"), user);
  return docRef;
};

export const updateUser = async (uid: string, user: Partial<IUser>) => {
  const userRef = doc(database, "User", uid);
  await updateDoc(userRef, user);
};

export const findUserById = async (uid: string) => {
  const docRef = doc(database, "User", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { uid: docSnap.id, ...docSnap.data() } as IUser;
};

export const findUserByUsername = async (username: string, me: string) => {
  if (!username) {
    return [];
  }

  const q = query(
    collection(database, "User"),
    where("uid", "!=", me),
    where("userName", ">=", username),
    where("userName", "<", username + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot) => ({
    uid: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as IUser[];
};

export const deleteUser = async (uid: string) => {
  const userRef = doc(database, "User", uid);
  await deleteDoc(userRef);
};