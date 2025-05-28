import { 
  Timestamp, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc 
} from "@react-native-firebase/firestore";
import { database } from "../../libs/firebase";

export interface ICalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  userId: string;
  sharedWith?: string[];
}

const EVENTS_COLLECTION = 'events';

export async function createEvent(event: Omit<ICalendarEvent, "id">) {
  try {
    const colRef = collection(database, EVENTS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...event,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(id: string, event: Partial<ICalendarEvent>) {
  try {
    const docRef = doc(database, EVENTS_COLLECTION, id);
    await updateDoc(docRef, event);
    return { id, ...event };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    const docRef = doc(database, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function listEvents(userId: string) {
  try {
    const colRef = collection(database, EVENTS_COLLECTION);
    const q = query(colRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ICalendarEvent[];
  } catch (error) {
    console.error("Error listing events:", error);
    throw error;
  }
}

export async function listSharedEvents(userId: string) {
  try {
    const colRef = collection(database, EVENTS_COLLECTION);
    const q = query(colRef, where('sharedWith', 'array-contains', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ICalendarEvent[];
  } catch (error) {
    console.error("Error listing shared events:", error);
    throw error;
  }
}

export async function findEventById(id: string) {
  try {
    const docRef = doc(database, EVENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as ICalendarEvent;
  } catch (error) {
    console.error("Error finding event:", error);
    throw error;
  }
}