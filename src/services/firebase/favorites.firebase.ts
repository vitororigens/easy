import { collection, addDoc, doc, getDoc, getDocs, query, where, deleteDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';
import { Timestamp } from "@react-native-firebase/firestore";

export interface IFavorite {
  id: string;
  uid: string; // ID do usuário que adicionou o favorito
  favoriteUid: string; // ID do usuário favorito
  favoriteName: string; // Nome do usuário favorito
  createdAt: Timestamp;
}

export const addFavorite = async (favorite: Omit<IFavorite, "id">) => {
  const docRef = await addDoc(collection(database, "Favorites"), favorite);
  return docRef;
};

export const removeFavorite = async (id: string) => {
  const favoriteRef = doc(database, "Favorites", id);
  await deleteDoc(favoriteRef);
};

export const findFavoriteById = async (id: string) => {
  const docRef = doc(database, "Favorites", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as IFavorite;
};

export const listFavorites = async (uid: string) => {
  const q = query(collection(database, "Favorites"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as IFavorite[];
};

export const isFavorite = async (uid: string, favoriteUid: string) => {
  const q = query(
    collection(database, "Favorites"),
    where("uid", "==", uid),
    where("favoriteUid", "==", favoriteUid)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}; 