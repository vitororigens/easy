import { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, Platform, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotes } from "../../components/ItemNotes";
import { LoadData } from "../../components/LoadData";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  Container,
  Content,
  ContentTitle,
  DividerContent,
  Icon,
  SubTitle,
  Title,
  HeaderContainer,
  SectionIcon,
  EmptyContainer,
} from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PersonImage from "../../assets/illustrations/notes.png";
import { Loading } from "../../components/Loading";
import {
  deleteNote,
  INote,
  listNotes,
  listNotesSharedWithMe,
  listNotesSharedByMe,
} from "../../services/firebase/notes.firebase";

export function Notes({ route }: any) {
  const reload = route?.params?.reload;

  const [myNotes, setMyNotes] = useState<INote[]>([]);
  const [sharedNotesByMe, setSharedNotesByMe] = useState<INote[]>([]);
  const [sharedNotesWithMe, setSharedNotesWithMe] = useState<INote[]>([]);
  console.log("compartilhadas", sharedNotesByMe, sharedNotesWithMe)
  const [isLoading, setIsLoading] = useState(true);
  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);

  const user = useUserAuth();
  const uid = user.user?.uid;

  const navigation = useNavigation();

  const handleEditItem = (documentId: string, isCreator: boolean) => {
    navigation.navigate("newnotes", { selectedItemId: documentId, isCreator });
  };

  const handleDeleteNote = async (documentId: string) => {
    try {
      await deleteNote(documentId);
      setMyNotes((prev) => prev.filter((n) => n.id !== documentId));
      setSharedNotesWithMe((prev) => prev.filter((n) => n.id !== documentId));
      setSharedNotesByMe((prev) => prev.filter((n) => n.id !== documentId));
      Toast.show("Nota excluída!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a nota: ", error);
    }
  };

  const fetchNotes = async () => {
    if (!uid) return;
    try {
      setIsLoading(true);
      const [mNotes, sNotes, sbNotes] = await Promise.all([
        listNotes(uid),
        listNotesSharedWithMe(uid),
        listNotesSharedByMe(uid),
      ]);

      setMyNotes(mNotes);

      setSharedNotesWithMe(sNotes);
      setSharedNotesByMe(sbNotes);
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
    <DefaultContainer newNotes monthButton title="Bloco de Notas" backButton>
      <Content>
        <ContentTitle onPress={() => setIsMyListVisible(!isMyListVisible)}>
          <HeaderContainer>
            <SectionIcon name="notebook-outline" />
            <Title>Minhas notas</Title>
          </HeaderContainer>
          <Icon name={isMyListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
        </ContentTitle>
        {isMyListVisible && (
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={myNotes}
              renderItem={({ item }) => (
                <ItemNotes
                  onDelete={() => handleDeleteNote(item.id)} 
                  onUpdate={() => handleEditItem(item.id, true)}
                  note={item}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <EmptyContainer>
                  <LoadData
                    imageSrc={PersonImage}
                    title="Comece agora!"
                    subtitle="Adicione uma nota clicando em +"
                  />
                </EmptyContainer>
              }
            />
          </Container>
        )}

        <ContentTitle
          isMysharedNotes
          onPress={() => setIsSharedListVisible(!isSharedListVisible)}
        >
          <HeaderContainer>
            <SectionIcon name="share-variant" isMysharedNotes />
            <Title>Notas compartilhadas</Title>
          </HeaderContainer>
          <Icon name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
        </ContentTitle>

        {isSharedListVisible && (
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={[...sharedNotesWithMe, ...sharedNotesByMe]}
              renderItem={({ item }) => {
                const isSharedByMe = sharedNotesByMe.some(note => note.id === item.id);
                const noteWithShared = {
                  ...item,
                  isShared: true
                };
                return (
                  <ItemNotes
                    onDelete={() => handleDeleteNote(item.id)}
                    onUpdate={() => handleEditItem(item.id, false)}
                    note={noteWithShared}
                    isSharedByMe={isSharedByMe}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <EmptyContainer>
                  <SubTitle>
                    Você não possui notas compartilhadas
                  </SubTitle>
                </EmptyContainer>
              }
            />
          </Container>
        )}
      </Content>
    </DefaultContainer>
  );
}
