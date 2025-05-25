import firestore from '@react-native-firebase/firestore';
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

export async function createEvent(event: Omit<ICalendarEvent, "id">) {
  try {
    const docRef = await database
      .collection('events')
      .add({
        ...event,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(id: string, event: Partial<ICalendarEvent>) {
  try {
    await database
      .collection('events')
      .doc(id)
      .update(event);
    return { id, ...event };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    await database
      .collection('events')
      .doc(id)
      .delete();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function listEvents(userId: string) {
  try {
    const querySnapshot = await database
      .collection('events')
      .where('userId', '==', userId)
      .get();
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ICalendarEvent[];
  } catch (error) {
    console.error("Error listing events:", error);
    throw error;
  }
}

export async function listSharedEvents(userId: string) {
  try {
    const querySnapshot = await database
      .collection('events')
      .where('sharedWith', 'array-contains', userId)
      .get();
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ICalendarEvent[];
  } catch (error) {
    console.error("Error listing shared events:", error);
    throw error;
  }
}

export async function findEventById(id: string) {
  try {
    const docRef = await database
      .collection('events')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return null;
    }

    return {
      id: docRef.id,
      ...docRef.data(),
    } as ICalendarEvent;
  } catch (error) {
    console.error("Error finding event:", error);
    throw error;
  }
} 