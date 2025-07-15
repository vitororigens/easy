import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, getFirestore } from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const database = getFirestore();

export interface Subscription {
  id?: string;
  name: string;
  value: number;
  dueDay: number;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const subscriptionData = {
      ...subscription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(database, 'subscriptions'), subscriptionData);
    return { id: docRef.id, ...subscriptionData };
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    throw error;
  }
};

export const getSubscriptions = async (userId: string) => {
  try {
    const q = query(collection(database, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    })) as Subscription[];
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    throw error;
  }
};

export const deleteSubscription = async (subscriptionId: string) => {
  try {
    await deleteDoc(doc(database, 'subscriptions', subscriptionId));
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, data: Partial<Subscription>) => {
  try {
    const subscriptionRef = doc(database, 'subscriptions', subscriptionId);
    await updateDoc(subscriptionRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    throw error;
  }
}; 