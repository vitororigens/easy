import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, setDoc, getFirestore } from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const database = getFirestore();

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
    console.log("ensureFavoritesProperty: Iniciando para usuário:", userId);
    const userRef = doc(database, "User", userId);
    
    console.log("ensureFavoritesProperty: Verificando se documento existe...");
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log("ensureFavoritesProperty: Documento não existe, criando...");
      
      // Criar o documento do usuário com a propriedade favorites
      const userData = {
        uid: userId,
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("ensureFavoritesProperty: Dados para criar:", userData);
      await setDoc(userRef, userData);
      
      console.log("ensureFavoritesProperty: Documento criado com sucesso");
      return [];
    }
    
    console.log("ensureFavoritesProperty: Documento existe, verificando dados...");
    const userData = userDoc.data();
    
    if (!userData) {
      console.log("ensureFavoritesProperty: Dados vazios, inicializando...");
      await updateDoc(userRef, {
        favorites: [],
        updatedAt: new Date()
      });
      return [];
    }
    
    console.log("ensureFavoritesProperty: Dados encontrados:", userData);
    
    // Se a propriedade favorites não existe, inicializa com array vazio
    if (!Array.isArray(userData['favorites'])) {
      console.log("ensureFavoritesProperty: Propriedade favorites não existe, inicializando...");
      await updateDoc(userRef, {
        favorites: [],
        updatedAt: new Date()
      });
      return [];
    }
    
    console.log("ensureFavoritesProperty: Favoritos encontrados:", userData['favorites']);
    return userData['favorites'];
  } catch (error) {
    console.error("ensureFavoritesProperty: Erro:", error);
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
      .map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        uid: docSnapshot.id,
        ...docSnapshot.data(),
      }))
      .filter((user: IUser) => user.uid !== me) as IUser[];
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
    console.log("addToFavorites: Iniciando para usuário:", userId, "favorito:", favoriteUserId);
    
    // Garantir que a propriedade favorites existe (e criar documento se necessário)
    const favorites = await ensureFavoritesProperty(userId);
    console.log("addToFavorites: Favoritos atuais:", favorites);
    
    if (!favorites.includes(favoriteUserId)) {
      console.log("addToFavorites: Adicionando favorito...");
      const userRef = doc(database, "User", userId);
      await updateDoc(userRef, {
        favorites: [...favorites, favoriteUserId],
        updatedAt: new Date()
      });
      console.log("addToFavorites: Favorito adicionado com sucesso");
    } else {
      console.log("addToFavorites: Usuário já está nos favoritos");
    }
  } catch (error) {
    console.error("addToFavorites: Erro:", error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, favoriteUserId: string) => {
  try {
    console.log("removeFromFavorites: Iniciando para usuário:", userId, "favorito:", favoriteUserId);
    
    // Garantir que a propriedade favorites existe (e criar documento se necessário)
    const favorites = await ensureFavoritesProperty(userId);
    console.log("removeFromFavorites: Favoritos atuais:", favorites);
    
    const userRef = doc(database, "User", userId);
    await updateDoc(userRef, {
      favorites: favorites.filter((id: string) => id !== favoriteUserId),
      updatedAt: new Date()
    });
    console.log("removeFromFavorites: Favorito removido com sucesso");
  } catch (error) {
    console.error("removeFromFavorites: Erro:", error);
    throw error;
  }
};

export const getFavorites = async (userId: string): Promise<IUser[]> => {
  try {
    console.log("getFavorites: Iniciando para usuário:", userId);
    
    // Garantir que a propriedade favorites existe (e criar documento se necessário)
    const favorites = await ensureFavoritesProperty(userId);
    console.log("getFavorites: Favoritos encontrados:", favorites);
    
    if (favorites.length === 0) {
      console.log("getFavorites: Nenhum favorito encontrado");
      return [];
    }
    
    console.log("getFavorites: Buscando dados dos usuários favoritos...");
    
    const favoritesUsers = await Promise.all(
      favorites.map(async (uid) => {
        try {
          const userDoc = await getDoc(doc(database, "User", uid));
          if (userDoc.exists()) {
            return { uid: userDoc.id, ...userDoc.data() } as IUser;
          }
          console.log("getFavorites: Usuário favorito não encontrado:", uid);
          return null;
        } catch (error) {
          console.error("getFavorites: Erro ao buscar usuário favorito:", uid, error);
          return null;
        }
      })
    );
    
    const validUsers = favoritesUsers.filter((user: IUser | null): user is IUser => user !== null);
    console.log("getFavorites: Usuários válidos encontrados:", validUsers.length);
    return validUsers;
  } catch (error) {
    console.error("getFavorites: Erro:", error);
    return [];
  }
};