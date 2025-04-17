import React, { useState } from "react";
import { View } from "react-native";
import Popover from "react-native-popover-view";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { INote } from "../../services/firebase/notes.firebase";
import {
  Container,
  Title,
  SubTitle,
  DateNote,
  Icon,
  Button,
  ContainerMenu,
  ShareBadge,
  ShareIcon,
} from "./styles";

// Estendendo a interface INote para incluir propriedades do Firebase
interface ExtendedNote extends INote {
  isShared?: boolean;
  sharedWith?: string[];
}

type ItemNotesProps = {
  note: ExtendedNote;
  onDelete: (id: string) => void;
  onUpdate: (note: ExtendedNote) => void;
  isSharedByMe?: boolean;
};

export function ItemNotes({ note, onDelete, onUpdate, isSharedByMe }: ItemNotesProps) {
  const [showPopover, setShowPopover] = useState(false);

  const formattedDate = (() => {
    try {
      let date: Date;
      
      if (note.createdAt instanceof Date) {
        date = note.createdAt;
      } else if (note.createdAt && typeof note.createdAt === 'object') {
        // Verifica se é um objeto Timestamp do Firestore
        if ('seconds' in note.createdAt && 'nanoseconds' in note.createdAt) {
          date = new Date(
            (note.createdAt as any).seconds * 1000 + 
            (note.createdAt as any).nanoseconds / 1000000
          );
        } else {
          date = new Date(note.createdAt as any);
        }
      } else {
        date = new Date(note.createdAt as any);
      }
      
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return format(date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data indisponível";
    }
  })();

  return (
    <Container isShared={note.isShared} onPress={() => onUpdate(note)}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Title numberOfLines={1}>{note.name}</Title>
          {note.isShared && (
            <ShareBadge isSharedByMe={isSharedByMe}>
              <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
            </ShareBadge>
          )}
        </View>
        <SubTitle numberOfLines={2}>{note.description}</SubTitle>
        <DateNote>{formattedDate}</DateNote>
      </View>

      <Popover
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        from={
          <Button onPress={() => setShowPopover(true)}>
            <Icon name="dots-three-vertical" />
          </Button>
        }
      >
        <ContainerMenu>
          <Button onPress={() => {
            setShowPopover(false);
            onUpdate(note);
          }}>
            <Icon name="edit" />
            <SubTitle style={{ marginLeft: 8 }}>Editar</SubTitle>
          </Button>
          <Button onPress={() => {
            setShowPopover(false);
            onDelete(note.id);
          }}>
            <Icon name="trash" />
            <SubTitle style={{ marginLeft: 8 }}>Excluir</SubTitle>
          </Button>
        </ContainerMenu>
      </Popover>
    </Container>
  );
}
