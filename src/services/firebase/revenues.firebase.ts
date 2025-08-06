import { Timestamp, collection, addDoc, getFirestore} from '@react-native-firebase/firestore';

const database = getFirestore();

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IExpense {
  name: string;
  category?: string;
  uid?: string;
  date: string;
  valueTransaction: string;
  description?: string;
  repeat: boolean;
  type: string;
  month: number;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createRevenue = async (note: Omit<IExpense, 'id'>) => {
  const docRef = await addDoc(collection(database, 'Revenue'), note);
  return docRef;
};
