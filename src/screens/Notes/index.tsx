import { getMonth, parse } from "date-fns";
import { useState } from "react";
import { Dimensions, FlatList, Modal } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotes } from "../../components/ItemNotes";
import { LoadData } from "../../components/LoadData";
import { useMonth } from "../../context/MonthProvider";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { NewNotes } from "../NewNotes";

const screenWidth = Dimensions.get("screen").width;

export function Notes() {
  const { selectedMonth } = useMonth();
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const data = useMarketplaceCollections("Notes");
  const user = useUserAuth();
  const uid = user?.uid;
  const notesUser = data.filter((item) => item.uid === uid);

  const notesUserMonth = notesUser.filter((item) => {
    const month =
      getMonth(parse(item.createdAt ?? "", "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  function closeModals() {
    setShowNotesModal(false);
  }

  function handleEditItem(documentId: string) {
    setShowNotesModal(true);
    setSelectedItemId(documentId);
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
    <DefaultContainer newNotes monthButton>
      <Container type="SECONDARY" title="Notas">
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
            <LoadData
              image="PRIMARY"
              title="Desculpe!"
              subtitle="Você ainda não possui dados para exibir aqui! Comece adicionando uma nova anotação clicando em Adicione +."
            />
          }
        />
      </Container>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <NewNotes
          selectedItemId={selectedItemId}
          showButtonSave
          showButtonRemove
          closeBottomSheet={closeModals}
        />
      </Modal>
    </DefaultContainer>
  );
}
