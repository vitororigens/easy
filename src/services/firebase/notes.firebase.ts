import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, deleteDoc, getFirestore, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Timestamp } from "@react-native-firebase/firestore";
import firestore from '@react-native-firebase/firestore';

const database = getFirestore();

export interface INote {
  id: string;
  title?: string;
  name: string;
  description: string;
  type: string;
  author: string;
  uid: string;
  createdAt: Date;
  shareWith: string[];
  shareInfo: {
    uid: string;
    acceptedAt: Timestamp | null;
    userName: string;
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

  return (querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as INote[];
};

export const listNotesSharedWithMe = async (uid: string) => {
  console.log("Buscando notas compartilhadas para o usuário:", uid);
  
  try {
    // Primeiro, buscar todas as notas onde o usuário está em shareWith
    const q = query(
      collection(database, "Notes"),
      where("shareWith", "array-contains", uid)
    );
    const querySnapshot = await getDocs(q);

    const notes = querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as INote[];

    console.log("Total de notas encontradas:", notes.length);
    console.log("Notas encontradas:", notes);

    // Filtrar apenas as notas onde o usuário tem acceptedAt não nulo
    const filteredNotes = notes.filter((note: INote) => {
      const shareInfo = note.shareInfo?.find(info => info.uid === uid);
      console.log("Nota:", note.id, "ShareInfo:", shareInfo);
      return shareInfo && shareInfo.acceptedAt !== null;
    });

    console.log("Notas filtradas:", filteredNotes.length);
    console.log("Notas filtradas:", filteredNotes);

    // Adicionar a propriedade isShared
    const notesWithShared = filteredNotes.map(note => ({
      ...note,
      isShared: true
    }));

    return notesWithShared;
  } catch (error) {
    console.error("Erro ao buscar notas compartilhadas:", error);
    return [];
  }
};

export const listNotesSharedByMe = async (uid: string): Promise<INote[]> => {
  const q = query(collection(database, "Notes"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const notes = querySnapshot.docs
    .map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as INote))
    .filter(
      (doc: INote) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as INote[];

  return notes;
};

export const deleteNote = async (documentId: string, note?: INote, currentUid?: string) => {
  if (note && currentUid && note.uid !== currentUid) {
    // Se o item for compartilhado com você (não é seu), remova seu UID do array shareWith no Firestore
    const noteRef = doc(database, "Notes", documentId);
    await updateDoc(noteRef, {
      shareWith: firestore.FieldValue.arrayRemove(currentUid),
    });
  } else {
    // Se for seu, delete do banco normalmente
    const noteRef = doc(database, "Notes", documentId);
    await deleteDoc(noteRef);
  }
};
