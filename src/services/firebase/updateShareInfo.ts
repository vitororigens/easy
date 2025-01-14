import { database } from "../../libs/firebase";
export const updateNotes = async (sourceId: string, receiverId: string) => {
  const docRef = database.collection("Notes").doc(sourceId);
  const doc = await docRef.get();
  if (doc.exists) {
    const data = doc.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await docRef.update({
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};

export const updateExpenses = async (sourceId: string, receiverId: string) => {
  const docRef = database.collection("Expenses").doc(sourceId);
  const doc = await docRef.get();
  if (doc.exists) {
    const data = doc.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await docRef.update({
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};

export const updateMarkets = async (sourceId: string, receiverId: string) => {
  const docRef = database.collection("Markets").doc(sourceId);
  const doc = await docRef.get();
  if (doc.exists) {
    const data = doc.data();
    const updatedShareinfo = data?.shareInfo.map((item: any) => {
      if (item.uid === receiverId) {
        item.acceptedAt = new Date();
      }
      return item;
    });

    await docRef.update({
      shareInfo: updatedShareinfo,
    });
  } else {
    console.log("nenhum documento encontrado");
  }
};
