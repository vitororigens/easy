import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IExpense {
  category: string,
  uid: string,
  createdAt: Timestamp,
  price: number,
  description?: string,
  isRecurrent: boolean,
  status: boolean,
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createExpense = async (note: Omit<IExpense, "id">) => {
  const docRef = await database.collection("Expenses").add(note);

  return docRef;
};

// export const updateExpense = async ({
//   id,
//   ...rest
// }: Omit<
//   Optional<IExpense, "description" | "name" | "shareInfo" | "shareWith">,
//   "createdAt" | "uid"
// >) => {
//   await database.collection("Expenses").doc(id).update(rest);
// };

// export const findExpenseById = async (id: string) => {
//   const doc = await database.collection("Expenses").doc(id).get();
//   if (!doc.exists) return null;
//   return { id: doc.id, ...doc.data() } as IExpense;
// };

// export const listExpenses = async (uid: string) => {
//   const data = await database.collection("Expenses").where("uid", "==", uid).get();
//   return (data.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) ?? []) as IExpense[];
// };

// export const listExpensesSharedWithMe = async (uid: string) => {
//   const data = await database
//     .collection("Expenses")
//     .where("shareWith", "array-contains", uid)
//     .get();

//   const notes = (data.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) ?? []) as IExpense[];

//   return notes.filter((n) =>
//     n.shareInfo.some(
//       ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
//     )
//   );
// };

// export const deleteExpense = async (documentId: string) => {
//   await database.collection("Expenses").doc(documentId).delete();
// };
