import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface INote {
  id: string;
  uid: string;
  createdAt: Timestamp;
  name: string;
  author: string;
  type: string;
  description: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createNote = async (note: Omit<INote, "id">) => {
  console.log("note", note);
  const docRef = await database.collection("Notes").add(note);

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
  await database.collection("Notes").doc(id).update(rest);
};

export const findNoteById = async (id: string) => {
  const doc = await database.collection("Notes").doc(id).get();

  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as INote;
};

export const listNotes = async (uid: string) => {
  const data = await database.collection("Notes").where("uid", "==", uid).get();

  return (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as INote[];
};

export const listNotesSharedWithMe = async (uid: string) => {
  const data = await database
    .collection("Notes")
    .where("shareWith", "array-contains", uid)
    .get();

  const notes = (data.docs.map((doc) => ({
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
  const data = await database.collection("Notes").where("uid", "==", uid).get();

  const notes = data.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as INote))
    .filter(
      (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as INote[];

  return notes;
};

export const deleteNote = async (documentId: string) => {
  await database.collection("Notes").doc(documentId).delete();
};
