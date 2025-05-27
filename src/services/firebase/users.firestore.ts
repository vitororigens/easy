import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';

export interface IUser {
  uid: string;
  userName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  favorites?: string[]; // Array de UIDs dos usuários favoritos
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
  if (!username || !me) {
    return [];
  }

  try {
    const q = query(
      collection(database, "User"),
      where("userName", ">=", username.toLowerCase()),
      where("userName", "<=", username.toLowerCase() + "\uf8ff")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map((docSnapshot) => ({
        uid: docSnapshot.id,
        ...docSnapshot.data(),
      }))
      .filter(user => user.uid !== me) as IUser[];
  } catch (error) {
    console.error("Error in findUserByUsername:", error);
    return [];
  }
};

export const deleteUser = async (uid: string) => {
  const userRef = doc(database, "User", uid);
  await deleteDoc(userRef);
};

export const addToFavorites = async (userId: string, favoriteUserId: string) => {
  const userRef = doc(database, "User", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists) return;
  
  const userData = userDoc.data() as IUser;
  const favorites = userData.favorites || [];
  
  if (!favorites.includes(favoriteUserId)) {
    await updateDoc(userRef, {
      favorites: [...favorites, favoriteUserId]
    });
  }
};

export const removeFromFavorites = async (userId: string, favoriteUserId: string) => {
  const userRef = doc(database, "User", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists) return;
  
  const userData = userDoc.data() as IUser;
  const favorites = userData.favorites || [];
  
  await updateDoc(userRef, {
    favorites: favorites.filter(id => id !== favoriteUserId)
  });
};

export const getFavorites = async (userId: string): Promise<IUser[]> => {
  const userRef = doc(database, "User", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists) return [];
  
  const userData = userDoc.data() as IUser;
  const favorites = userData.favorites || [];
  
  if (favorites.length === 0) return [];
  
  const favoritesUsers = await Promise.all(
    favorites.map(async (uid) => {
      const userDoc = await getDoc(doc(database, "User", uid));
      if (userDoc.exists()) {
        return { uid: userDoc.id, ...userDoc.data() } as IUser;
      }
      return null;
    })
  );
  
  return favoritesUsers.filter((user): user is IUser => user !== null);
};