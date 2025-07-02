import { useCallback, useEffect, useState, useMemo } from "react";
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
import { Timestamp } from "@react-native-firebase/firestore";

export function Notes({ route }: any) {
  const reload = route?.params?.reload;

  const [myNotes, setMyNotes] = useState<INote[]>([]);
  const [sharedNotesByMe, setSharedNotesByMe] = useState<INote[]>([]);
  const [sharedNotesWithMe, setSharedNotesWithMe] = useState<INote[]>([]);
  console.log("compartilhadas", sharedNotesByMe, sharedNotesWithMe)
  const [isLoading, setIsLoading] = useState(true);

  const user = useUserAuth();
  const uid = user.user?.uid;

  const navigation = useNavigation();

  const handleEditItem = (documentId: string, isCreator: boolean) => {
    navigation.navigate("newnotes", { selectedItemId: documentId, isCreator });
  };

  const handleDeleteNote = async (documentId: string, note?: INote) => {
    try {
      await deleteNote(documentId, note, uid);
      setMyNotes((prev) => prev.filter((n) => n.id !== documentId));
      setSharedNotesWithMe((prev) => prev.filter((n) => n.id !== documentId));
      setSharedNotesByMe((prev) => prev.filter((n) => n.id !== documentId));
      Toast.show(note && note.uid !== uid ? "Item removido da sua lista!" : "Nota excluída!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a nota: ", error);
      Toast.show("Erro ao excluir a nota", { type: "error" });
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

  // Combinar todas as notas em uma única lista
  const allNotes = useMemo(() => {
    const ensureTimestamp = (date: any) => {
      if (!date) return Timestamp.now();
      if (date instanceof Timestamp) return date;
      if (date instanceof Date) return Timestamp.fromDate(date);
      if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        return new Timestamp(date.seconds, date.nanoseconds);
      }
      return Timestamp.now();
    };
    const myNotesWithFlag = myNotes.map(note => ({ ...note, isShared: false, title: note.title || "", createdAt: ensureTimestamp(note.createdAt) }));
    const sharedNotesWithFlag = [...sharedNotesWithMe, ...sharedNotesByMe].map(note => ({ ...note, isShared: true, title: note.title || "", createdAt: ensureTimestamp(note.createdAt) }));
    return [...myNotesWithFlag, ...sharedNotesWithFlag];
  }, [myNotes, sharedNotesWithMe, sharedNotesByMe]);

  if (isLoading || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer newNotes monthButton title="Bloco de Notas" backButton>
      <Content>
        <ContentTitle>
          <HeaderContainer>
            <SectionIcon name="notebook-outline" />
            <Title>Bloco de Notas</Title>
          </HeaderContainer>
        </ContentTitle>
        <Container>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={allNotes}
            renderItem={({ item }) => {
              const isSharedByMe = sharedNotesByMe.some(note => note.id === item.id);
              return (
                <ItemNotes
                  handleDelete={() => handleDeleteNote(item.id, item)}
                  handleUpdate={() => handleEditItem(item.id, !item.isShared)}
                  note={item}
                  isSharedByMe={isSharedByMe}
                />
              );
            }}
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
      </Content>
    </DefaultContainer>
  );
}
