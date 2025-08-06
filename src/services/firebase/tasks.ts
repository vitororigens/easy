import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, getFirestore } from '@react-native-firebase/firestore';
import { Optional } from '../../@types/optional';
import { Timestamp, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

const database = getFirestore();

export interface ITask {
  id: string;
  uid: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createTask = async (task: Omit<ITask, 'id'>) => {
  const docRef = await addDoc(collection(database, 'Tasks'), task);
  return docRef;
};

export const updateTask = async (id: string, task: Partial<ITask>) => {
  const taskRef = doc(database, 'Tasks', id);
  await updateDoc(taskRef, task);
};

export const findTaskById = async (id: string) => {
  const docRef = doc(database, 'Tasks', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as ITask;
};

export const listTasks = async (uid: string) => {
  const q = query(collection(database, 'Tasks'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ITask[];
};

export const deleteTask = async (id: string) => {
  const taskRef = doc(database, 'Tasks', id);
  await deleteDoc(taskRef);
};

export const updateNote = async ({
  id,
  ...rest
}: Omit<
  Optional<ITask, 'name' | 'shareInfo' | 'shareWith'>,
  'createdAt' | 'uid'
>) => {
  const noteRef = doc(database, 'Notes', id);
  await updateDoc(noteRef, rest);
};

export const findNoteById = async (id: string) => {
  const docRef = doc(database, 'Notes', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as ITask;
};

export const listNotes = async (uid: string) => {
  const q = query(collection(database, 'Notes'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ITask[];
};

export const listTaskSharedWithMe = async (uid: string) => {
  const q = query(
    collection(database, 'Task'),
    where('shareWith', 'array-contains', uid),
  );
  const querySnapshot = await getDocs(q);

  const tasks = (querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ITask[];

  const findTasks = tasks.filter((task: ITask) =>
    task.shareInfo.some(
      (shareInfo: TShareInfo) => shareInfo.uid === uid && shareInfo.acceptedAt !== null,
    ),
  );

  return findTasks;
};

export const listNotesSharedByMe = async (uid: string) => {
  const q = query(
    collection(database, 'Notes'),
    where('uid', '==', uid),
    where('shareWith', '!=', []),
  );
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ITask[];
};

export const listTasksSharedByMe = async (uid: string): Promise<ITask[]> => {
  const q = query(
    collection(database, 'Task'),
    where('uid', '==', uid),
    where('shareWith', '!=', []),
  );
  const querySnapshot = await getDocs(q);

  return (querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  })) ?? []) as ITask[];
};

export const deleteNote = async (documentId: string) => {
  const noteRef = doc(database, 'Notes', documentId);
  await deleteDoc(noteRef);
};

export const createHistoryTasks = async (groupName: string) => {
  const now = new Date();
  const historyTask = {
    name: groupName,
    createdAt: Timestamp.now(),
    finishedDate: now.toLocaleDateString(),
    finishedTime: now.toLocaleTimeString(),
    tasks: [],
  };

  const docRef = await addDoc(collection(database, 'HistoryTasks'), historyTask);
  return docRef;
};
