import { database } from "../../libs/firebase";
import { doc, getDoc, updateDoc } from "@react-native-firebase/firestore";

export const updateNotes = async (sourceId: string, receiverId: string) => {
  const docRef = doc(database, "Notes", sourceId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    const data = docSnap.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await updateDoc(docRef, {
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};

export const updateExpenses = async (sourceId: string, receiverId: string) => {
  const docRef = doc(database, "Expenses", sourceId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    const data = docSnap.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await updateDoc(docRef, {
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};

export const updateMarkets = async (sourceId: string, receiverId: string) => {
  const docRef = doc(database, "Markets", sourceId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    const data = docSnap.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await updateDoc(docRef, {
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};
