import { Timestamp, collection, addDoc, getFirestore } from '@react-native-firebase/firestore';
import { parseNaturalInput } from '../ai';

const database = getFirestore();

export interface AITransaction {
  type: 'input' | 'output';
  amount: number;
  category: string;
  description: string;
  date: string;
  uid: string;
  createdAt: Timestamp;
  processedByAI: boolean;
  aiConfidence?: number;
}

/**
 * Salva uma transação processada pela IA no Firebase
 */
export const saveAITransaction = async (
  transaction: Omit<AITransaction, 'createdAt' | 'processedByAI'>
): Promise<string> => {
  try {
    const transactionData: AITransaction = {
      ...transaction,
      createdAt: Timestamp.now(),
      processedByAI: true,
    };

    const docRef = await addDoc(collection(database, 'Transactions'), transactionData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving AI transaction:', error);
    throw new Error('Erro ao salvar transação processada pela IA');
  }
};

/**
 * Processa texto natural e salva a transação automaticamente
 */
export const processAndSaveNaturalInput = async (
  text: string,
  uid: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Processar o texto com IA
    const parsedTransaction = await parseNaturalInput(text);
    
    // Preparar dados para salvar
    const transactionData = {
      type: parsedTransaction.type,
      amount: parsedTransaction.amount,
      category: parsedTransaction.category,
      description: parsedTransaction.description,
      date: parsedTransaction.date,
      uid,
    };

    // Salvar no Firebase
    const transactionId = await saveAITransaction(transactionData);

    return {
      success: true,
      transactionId,
    };
  } catch (error) {
    console.error('Error processing and saving natural input:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Busca transações processadas pela IA de um usuário
 */
export const getAITransactions = async (uid: string): Promise<AITransaction[]> => {
  try {
    const querySnapshot = await database
      .collection('Transactions')
      .where('uid', '==', uid)
      .where('processedByAI', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as AITransaction));
  } catch (error) {
    console.error('Error fetching AI transactions:', error);
    throw new Error('Erro ao buscar transações processadas pela IA');
  }
};

/**
 * Estatísticas de transações processadas pela IA
 */
export const getAITransactionStats = async (uid: string) => {
  try {
    const transactions = await getAITransactions(uid);
    
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageConfidence = transactions.reduce((sum, t) => sum + (t.aiConfidence || 0), 0) / totalTransactions;
    
    const categoryStats = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTransactions,
      totalAmount,
      averageConfidence,
      categoryStats,
      topCategories: Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }))
    };
  } catch (error) {
    console.error('Error getting AI transaction stats:', error);
    throw new Error('Erro ao buscar estatísticas das transações de IA');
  }
}; 