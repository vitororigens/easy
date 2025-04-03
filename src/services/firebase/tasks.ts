import { Optional } from "../../@types/optional";
import { database } from "../../libs/firebase";
import { Timestamp } from "firebase/firestore";
import { NewTask } from "../../screens/NewTask/index";

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface ITask {
  id: string;
  uid: string;
  createdAt: Timestamp;
  name: string;
  type: string;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

export const createTask = async (task: Omit<ITask, "id">) => {
  const docRef = await database.collection("Task").add(task);

  console.log("resultado:", docRef);
  return docRef;
};

export const updateNote = async ({
  id,
  ...rest
}: Omit<
  Optional<ITask, "name" | "shareInfo" | "shareWith">,
  "createdAt" | "uid"
>) => {
  await database.collection("Notes").doc(id).update(rest);
};

export const findNoteById = async (id: string) => {
  const doc = await database.collection("Notes").doc(id).get();

  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as ITask;
};

export const listNotes = async (uid: string) => {
  const data = await database.collection("Notes").where("uid", "==", uid).get();

  return (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as ITask[];
};

export const listTaskSharedWithMe = async (uid: string) => {
  const data = await database
    .collection("Task")
    .where("shareWith", "array-contains", uid)
    .get();

  const tasks = (data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) ?? []) as ITask[];

  const findTasks = tasks.filter((task) =>
    task.shareInfo.some(
      ({ uid, acceptedAt }) => uid === uid && acceptedAt !== null
    )
  );

  console.log("findTasks", findTasks);
  return findTasks;
};

export const listNotesSharedByMe = async (uid: string) => {
  const data = await database.collection("Notes").where("uid", "==", uid).get();

  const notes = data.docs
    .map((doc) => doc.data())
    .filter(
      (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as ITask[];

  return notes;
};

export const listTasksSharedByMe = async (uid: string): Promise<ITask[]> => {
  const data = await database.collection("Task").where("uid", "==", uid).get();

  const tasks = data.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as ITask))
    .filter(
      (doc) => Array.isArray(doc.shareWith) && doc.shareWith.length > 0
    ) as ITask[];

  return tasks;
};

export const deleteNote = async (documentId: string) => {
  await database.collection("Notes").doc(documentId).delete();
};
