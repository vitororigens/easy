import React, { useState } from "react";
import { View } from "react-native";
import Popover from "react-native-popover-view";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { ICalendar } from "../../interfaces/ICalendar";
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

type EventItemProps = {
  event: ICalendar;
  onDelete: (id: string) => void;
  onUpdate: (event: ICalendar) => void;
  isSharedByMe?: boolean;
};

export function EventItem({ event, onDelete, onUpdate, isSharedByMe }: EventItemProps) {
  const [showPopover, setShowPopover] = useState(false);

  const formattedDate = (() => {
    try {
      let date: Date;
      
      if (event.createdAt instanceof Date) {
        date = event.createdAt;
      } else if (event.createdAt && typeof event.createdAt === 'object') {
        // Verifica se é um objeto Timestamp do Firestore
        if ('seconds' in event.createdAt && 'nanoseconds' in event.createdAt) {
          date = new Date(
            (event.createdAt as any).seconds * 1000 + 
            (event.createdAt as any).nanoseconds / 1000000
          );
        } else {
          date = new Date(event.createdAt as any);
        }
      } else {
        date = new Date(event.createdAt as any);
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
    <Container isShared={!!event.isShared} onPress={() => onUpdate(event)}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Title numberOfLines={1}>{event.name}</Title>
          {event.isShared && (
            <ShareBadge isSharedByMe={!!isSharedByMe}>
              <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
            </ShareBadge>
          )}
        </View>
        <SubTitle numberOfLines={2}>{event.description}</SubTitle>
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
            onUpdate(event);
          }}>
            <Icon name="edit" />
            <SubTitle style={{ marginLeft: 8 }}>Editar</SubTitle>
          </Button>
          <Button onPress={() => {
            setShowPopover(false);
            onDelete(event.id);
          }}>
            <Icon name="trash" />
            <SubTitle style={{ marginLeft: 8 }}>Excluir</SubTitle>
          </Button>
        </ContainerMenu>
      </Popover>
    </Container>
  );
}
