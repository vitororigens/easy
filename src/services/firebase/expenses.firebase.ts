import { Timestamp, collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, deleteDoc, getFirestore, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

const database = getFirestore();

export interface IExpense {
  id?: string;
  category: string;
  uid: string;
  createdAt: Timestamp;
  price: number;
  description?: string;
  isRecurrent: boolean;
  status: boolean;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createExpense = async (note: Omit<IExpense, "id">) => {
  const docRef = await addDoc(collection(database, "Expenses"), note);
  return docRef;
};

export const updateExpense = async (id: string, data: Partial<Omit<IExpense, "id" | "createdAt" | "uid">>) => {
  const expenseRef = doc(database, "Expenses", id);
  await updateDoc(expenseRef, data);
};

export const findExpenseById = async (id: string) => {
  const docRef = doc(database, "Expenses", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists) return null;
  const data = docSnap.data();
  return { id: docSnap.id, ...data } as IExpense;
};

export const listExpenses = async (uid: string) => {
  const q = query(collection(database, "Expenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
  } as IExpense));
};

export const listExpensesSharedWithMe = async (uid: string) => {
  const q = query(
    collection(database, "Expenses"),
    where("shareWith", "array-contains", uid)
  );
  const querySnapshot = await getDocs(q);

  const expenses = querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
  } as IExpense));

  return expenses.filter((n: IExpense) =>
    n.shareInfo.some(
      ({ uid: shareUid, acceptedAt }: { uid: string, acceptedAt: Timestamp | null }) => shareUid === uid && acceptedAt !== null
    )
  );
};

export const deleteExpense = async (documentId: string) => {
  const expenseRef = doc(database, "Expenses", documentId);
  await deleteDoc(expenseRef);
};
