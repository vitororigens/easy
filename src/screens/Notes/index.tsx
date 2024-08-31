import { getMonth, parse } from "date-fns";
import { useEffect, useState } from "react";
import { FlatList, Modal, Platform, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotes } from "../../components/ItemNotes";
import { LoadData } from "../../components/LoadData";
import { useFilters } from "../../context/FiltersContext";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { NewNotes } from "../NewNotes";
import { Container, Content, ContentTitle, DividerContent, Icon, SubTitle, Title } from "./styles";
import { useNavigation } from "@react-navigation/native";
import PersonImage from "../../assets/illustrations/notes.png";
import { Loading } from "../../components/Loading";


export function Notes() {
  const { selectedMonth } = useFilters();
  const [showNotesModal, setShowNotesModal] = useState(false);
  const data = useMarketplaceCollections("Notes");
  const user = useUserAuth();

  const navigation = useNavigation()
  const uid = user?.uid;

  const [isLoaded, setIsLoaded] = useState(false);

  const notesUser = data.filter((item) => item.uid === uid);
  const notesUserShared = data.filter((item) =>
    item.sharedWith?.some((sharedUser) => sharedUser.uid === uid)
  );

  const notesUserMonth = notesUser.filter((item) => {
    const month = getMonth(parse(item.createdAt ?? "", "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });
  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);

  const notesUserMonthShared = notesUserShared.filter((item) => {
    const month = getMonth(parse(item.createdAt ?? "", "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  const closeModals = () => setShowNotesModal(false);

  const handleEditItem = (documentId: string) => {
    navigation.navigate("newnotes", { selectedItemId: documentId });
  };

  const handleDeleteItem = (documentId: string) => {
    database
      .collection("Notes")
      .doc(documentId)
      .delete()
      .then(() => Toast.show("Nota excluída!", { type: "success" }))
      .catch((error) => console.error("Erro ao excluir a nota: ", error));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  const renderNoteItem = ({ item }: { item: any }) => (
    <ItemNotes
      onDelete={() => handleDeleteItem(item.id)}
      onEdit={() => handleEditItem(item.id)}
      title={item.name}
      date={item.createdAt}
      description={item.description}
    />
  );

  const ListEmptyComponent = (
    <LoadData
      imageSrc={PersonImage}
      title="Comece agora!"
      subtitle="Adicione uma nota clicando em +"
    />

  );

  return (
    <DefaultContainer newNotes monthButton title="Bloco de Notas">
      <Content>
        <ContentTitle onPress={() => setIsMyListVisible(!isMyListVisible)}>
          <Title>Minhas notas</Title>
          <DividerContent />
          <Icon name={isMyListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
        </ContentTitle>
        {isMyListVisible && (
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={notesUserMonth}
              renderItem={renderNoteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={<View style={{ height: 90 }} />}
            />
          </Container>
        )}
        <ContentTitle onPress={() => setIsSharedListVisible(!isSharedListVisible)}>
          <Title>Notas compartilhada</Title>
          <DividerContent />
          <Icon name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
        </ContentTitle>
        {isSharedListVisible && (
          <>
           <Container>
           <FlatList
              showsVerticalScrollIndicator={false}
              data={notesUserMonthShared}
              renderItem={renderNoteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
              ListFooterComponent={<View style={{ height: 90 }} />}
              ListEmptyComponent={
                <View style={{
                  padding: 40,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <SubTitle>
                    Você não possui notas compartilhada com você
                  </SubTitle>
                </View>
              }
            />
           </Container>
          </>
        )}
      </Content>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 20 : 0 }}>
          <NewNotes closeBottomSheet={closeModals} />
        </View>
      </Modal>
    </DefaultContainer>
  );
}
