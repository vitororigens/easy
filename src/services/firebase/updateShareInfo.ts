import { database } from "../../libs/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "@react-native-firebase/firestore";

export const updateNotes = async (sourceId: string, receiverId: string) => {
  console.log("Atualizando nota:", { sourceId, receiverId });
  
  try {
    const docRef = doc(database, "Notes", sourceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as { shareInfo?: any[] };
      console.log("Dados atuais da nota:", data);
      
      if (!data.shareInfo) {
        console.log("Nota não tem shareInfo");
        return;
      }

      const updatedShareinfo = data.shareInfo.map((item: any) => {
        if (item.uid === receiverId) {
          console.log("Atualizando acceptedAt para usuário:", item.uid);
          return {
            ...item,
            acceptedAt: Timestamp.now()
          };
        }
        return item;
      });

      console.log("ShareInfo atualizado:", updatedShareinfo);

      await updateDoc(docRef, {
        shareInfo: updatedShareinfo
      });
      
      console.log("Nota atualizada com sucesso");
    } else {
      console.log("Nota não encontrada:", sourceId);
    }
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
  }
};

export const updateExpenses = async (sourceId: string, receiverId: string) => {
  const docRef = doc(database, "Expenses", sourceId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
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
  if (docSnap.exists()) {
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
