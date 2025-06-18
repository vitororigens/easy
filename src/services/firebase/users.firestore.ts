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

// Função para garantir que a propriedade favorites existe no documento do usuário
const ensureFavoritesProperty = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(database, "User", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists) {
      console.error("Usuário não encontrado:", userId);
      return [];
    }
    
    const userData = userDoc.data();
    if (!userData) {
      console.error("Dados do usuário não encontrados:", userId);
      return [];
    }
    
    // Se a propriedade favorites não existe, inicializa com array vazio
    if (!Array.isArray(userData.favorites)) {
      console.log("Inicializando propriedade favorites para usuário:", userId);
      await updateDoc(userRef, {
        favorites: []
      });
      return [];
    }
    
    return userData.favorites;
  } catch (error) {
    console.error("Erro ao garantir propriedade favorites:", error);
    return [];
  }
};

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
  try {
    // Garantir que a propriedade favorites existe
    const favorites = await ensureFavoritesProperty(userId);
    
    if (!favorites.includes(favoriteUserId)) {
      const userRef = doc(database, "User", userId);
      await updateDoc(userRef, {
        favorites: [...favorites, favoriteUserId]
      });
      console.log("Favorito adicionado com sucesso");
    } else {
      console.log("Usuário já está nos favoritos");
    }
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, favoriteUserId: string) => {
  try {
    // Garantir que a propriedade favorites existe
    const favorites = await ensureFavoritesProperty(userId);
    
    const userRef = doc(database, "User", userId);
    await updateDoc(userRef, {
      favorites: favorites.filter(id => id !== favoriteUserId)
    });
    console.log("Favorito removido com sucesso");
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    throw error;
  }
};

export const getFavorites = async (userId: string): Promise<IUser[]> => {
  try {
    // Garantir que a propriedade favorites existe
    const favorites = await ensureFavoritesProperty(userId);
    
    if (favorites.length === 0) {
      console.log("Nenhum favorito encontrado");
      return [];
    }
    
    console.log("Buscando favoritos:", favorites);
    
    const favoritesUsers = await Promise.all(
      favorites.map(async (uid) => {
        try {
          const userDoc = await getDoc(doc(database, "User", uid));
          if (userDoc.exists()) {
            return { uid: userDoc.id, ...userDoc.data() } as IUser;
          }
          console.log("Usuário favorito não encontrado:", uid);
          return null;
        } catch (error) {
          console.error("Erro ao buscar usuário favorito:", uid, error);
          return null;
        }
      })
    );
    
    const validUsers = favoritesUsers.filter((user): user is IUser => user !== null);
    console.log("Favoritos encontrados:", validUsers.length);
    return validUsers;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
};