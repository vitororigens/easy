import React, { useState } from "react";
import { View } from "react-native";
import Popover from "react-native-popover-view";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { INote } from "../../interfaces/INote";
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

type ItemNotesProps = {
  note: INote;
  onDelete: (id: string) => void;
  onUpdate: (note: INote) => void;
  isSharedByMe?: boolean;
};

export function ItemNotes({ note, onDelete, onUpdate, isSharedByMe }: ItemNotesProps) {
  const [showPopover, setShowPopover] = useState(false);

  const formattedDate = (() => {
    try {
      const date = note.createdAt instanceof Date 
        ? note.createdAt 
        : new Date(note.createdAt);
      
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
          <Title numberOfLines={1}>{note.title}</Title>
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
