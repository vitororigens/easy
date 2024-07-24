import { getMonth, parse } from "date-fns";
import { useState } from "react";
import { Dimensions, FlatList, Modal, Platform, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotes } from "../../components/ItemNotes";
import { LoadData } from "../../components/LoadData";
import { useMonth } from "../../context/MonthProvider";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { NewNotes } from "../NewNotes";
import { Content } from "./styles";

import { useNavigation } from "@react-navigation/native";
import PersonImage from "../../assets/illustrations/notes.png";

const screenWidth = Dimensions.get("screen").width;

export function Notes() {
  const { selectedMonth } = useMonth();
  const [showNotesModal, setShowNotesModal] = useState(false);
  const data = useMarketplaceCollections("Notes");
  const user = useUserAuth();
  const uid = user?.uid;
  const notesUser = data.filter((item) => item.uid === uid);

  const navigation = useNavigation();

  const notesUserMonth = notesUser.filter((item) => {
    const month =
      getMonth(parse(item.createdAt ?? "", "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  function closeModals() {
    setShowNotesModal(false);
  }

  function handleEditItem(documentId: string) {
    navigation.navigate("newnotes", { selectedItemId: documentId });
  }

  function handleDeleteItem(documentId: string) {
    database
      .collection("Notes")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Nota excluída!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a nota: ", error);
      });
  }

  return (
    <DefaultContainer newNotes monthButton title="Bloco de Notas">
      <Content>
        <FlatList
          data={notesUserMonth}
          renderItem={({ item }) => (
            <ItemNotes
              onDelete={() => handleDeleteItem(item.id)}
              onEdit={() => handleEditItem(item.id)}
              title={item.name}
              date={item.createdAt}
              description={item.description}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 90 }}
          ListEmptyComponent={
            <View style={{ marginTop: 60 }}>
              <LoadData
                imageSrc={PersonImage}
                title="Comece agora!"
                subtitle="Adicione uma nota clicando em +"
              />
            </View>
          }
        />
      </Content>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <NewNotes closeBottomSheet={closeModals} />
        </View>
      </Modal>
    </DefaultContainer>
  );
}
