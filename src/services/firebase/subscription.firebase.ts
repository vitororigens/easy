import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface Subscription {
  id?: string;
  name: string;
  value: number;
  dueDate: string;
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
      status: true,
    };

    const docRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
    return { id: docRef.id, ...subscriptionData };
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    throw error;
  }
};

export const getSubscriptions = async (userId: string) => {
  try {
    const q = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
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
    await deleteDoc(doc(db, 'subscriptions', subscriptionId));
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, data: Partial<Subscription>) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(subscriptionRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    throw error;
  }
}; 