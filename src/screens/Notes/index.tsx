import { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, Platform, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotes } from "../../components/ItemNotes";
import { LoadData } from "../../components/LoadData";
import { useUserAuth } from "../../hooks/useUserAuth";
import { NewNotes } from "../NewNotes";
import {
  Container,
  Content,
  ContentTitle,
  DividerContent,
  Icon,
  SubTitle,
  Title,
} from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PersonImage from "../../assets/illustrations/notes.png";
import { Loading } from "../../components/Loading";
import {
  deleteNote,
  INote,
  listNotes,
  listNotesSharedWithMe,
} from "../../services/firebase/notes.firebase";

export function Notes({ route }: any) {
  const reload = route?.params?.reload;

  const [myNotes, setMyNotes] = useState<INote[]>([]);
  const [sharedNotes, setSharedNotes] = useState<INote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);

  const user = useUserAuth();
  const navigation = useNavigation();

  const uid = user?.uid;

  const handleEditItem = (documentId: string, isCreator: boolean) => {
    navigation.navigate("newnotes", { selectedItemId: documentId, isCreator });
  };

  const handleDeleteNote = async (documentId: string) => {
    try {
      await deleteNote(documentId);
      setMyNotes((prev) => prev.filter((n) => n.id !== documentId));
      Toast.show("Nota excluída!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a nota: ", error);
    }
  };

  const fetchNotes = async () => {
    if (!uid) return;
    try {
      setIsLoading(true);
      const [mNotes, sNotes] = await Promise.all([
        listNotes(uid),
        listNotesSharedWithMe(uid),
      ]);

      setMyNotes(mNotes);
      setSharedNotes(sNotes);
    } catch (error) {
      console.error("Erro ao buscar as notas: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      if (reload) {
        fetchNotes();
      }
    }, [reload])
  );

  if (isLoading || uid === undefined) {
    return <Loading />;
  }

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
              data={myNotes}
              renderItem={({ item }) => (
                <ItemNotes
                  handleDelete={() => handleDeleteNote(item.id)}
                  handleUpdate={() => handleEditItem(item.id, true)}
                  note={item}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
              ListEmptyComponent={
                <LoadData
                  imageSrc={PersonImage}
                  title="Comece agora!"
                  subtitle="Adicione uma nota clicando em +"
                />
              }
              ListFooterComponent={<View style={{ height: 90 }} />}
            />
          </Container>
        )}
        <ContentTitle
          onPress={() => setIsSharedListVisible(!isSharedListVisible)}
        >
          <Title>Notas compartilhada</Title>
          <DividerContent />
          <Icon
            name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"}
          />
        </ContentTitle>
        {isSharedListVisible && (
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={sharedNotes}
              renderItem={({ item }) => (
                <ItemNotes
                  handleDelete={() => handleDeleteNote(item.id)}
                  handleUpdate={() => handleEditItem(item.id, false)}
                  note={item}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
              ListFooterComponent={<View style={{ height: 90 }} />}
              ListEmptyComponent={
                <View
                  style={{
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SubTitle>
                    Você não possui notas compartilhada com você
                  </SubTitle>
                </View>
              }
            />
          </Container>
        )}
      </Content>
    </DefaultContainer>
  );
}
