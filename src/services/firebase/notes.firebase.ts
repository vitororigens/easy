import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, deleteDoc } from '@react-native-firebase/firestore';
import { database } from '../../libs/firebase';
import { Timestamp } from "@react-native-firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface INote {
  id: string;
  name: string;
  description: string;
  type: string;
  author: string;
  uid: string;
  createdAt: Date;
  shareWith: string[];
  shareInfo: {
    uid: string;
    acceptedAt: Date | null;
  }[];
}

type Optional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & {
  [P in K]?: T[P];
};

export const createNote = async (note: Omit<INote, "id">) => {
  console.log("note", note);
  const docRef = await addDoc(collection(database, "Notes"), note);
  return docRef;
};

export const updateNote = async ({
  id,
  ...rest
}: Omit<
  Optional<
    INote,
    "description" | "name" | "shareInfo" | "shareWith" | "type" | "author"
  >,
  "createdAt" | "uid"
>) => {
  const noteRef = doc(database, "Notes", id);
  await updateDoc(noteRef, rest);
};

export const findNoteById = async (id: string) => {
  const docRef = doc(database, "Notes", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as INote;
};

export const listNotes = async (uid: string) => {
  const q = query(collection(database, "Notes"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as INote[];
};

export const listNotesSharedWithMe = async (uid: string) => {
  const q = query(
    collection(database, "Notes"),
    where("shareWith", "array-contains", uid)
  );
  const querySnapshot = await getDocs(q);

  const notes = (querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as INote[];

  const filteredNotes = notes.filter((n) =>
    n.shareInfo.some(
      ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
    )
  );

  return filteredNotes;
};

export const listNotesSharedByMe = async (uid: string): Promise<INote[]> => {
  const q = query(collection(database, "Notes"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const notes = querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as INote))
    .filter(
      (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as INote[];

  return notes;
};

export const deleteNote = async (documentId: string) => {
  const noteRef = doc(database, "Notes", documentId);
  await deleteDoc(noteRef);
};
