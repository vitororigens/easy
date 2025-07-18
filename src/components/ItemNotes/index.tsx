import React, { useState, useRef, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { INote } from "../../interfaces/INote";
import {
  Container,
  Content,
  Title,
  Description,
  Actions,
  ActionButton,
  ShareBadge,
  ShareIcon,
  ShareText,
  PopoverContainer,
  PopoverItem,
  PopoverItemText,
  PopoverDivider,
  MainContent,
  Row,
} from "./styles";
import Popover from "react-native-popover-view";
import { findUserById } from "../../services/firebase/users.firestore";

interface ItemNotesProps {
  note: INote;
  handleDelete: () => void;
  handleUpdate: () => void;
  isSharedByMe?: boolean;
}

export function ItemNotes({
  note,
  handleDelete,
  handleUpdate,
  isSharedByMe = false,
}: ItemNotesProps) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [sharedByUserName, setSharedByUserName] = useState<string>("");
  const popoverRef = useRef(null);

  // Verificar se é uma nota compartilhada
  const isShared = note.isShared || (note.sharedWith && note.sharedWith.length > 0) || isSharedByMe;

  // Buscar o nome do usuário que compartilhou
  useEffect(() => {
    const fetchSharedByUserName = async () => {
      if (isShared && !isSharedByMe && note.uid) {
        try {
          const userData = await findUserById(note.uid);
          if (userData) {
            setSharedByUserName(userData.userName);
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário que compartilhou:", error);
        }
      }
    };

    fetchSharedByUserName();
  }, [isShared, isSharedByMe, note.uid]);

  const handleEdit = () => {
    setIsPopoverVisible(false);
    handleUpdate();
  };

  const handleDeleteItem = () => {
    setIsPopoverVisible(false);
    handleDelete();
  };

  const handleShare = () => {
    setIsPopoverVisible(false);
    // Implementar funcionalidade de compartilhamento se necessário
  };

  return (
    <Container>
      <Content>
        <MainContent>
          <Row>
            <Title>{note.title || note.name}</Title>
            {isShared && (
              <ShareBadge>
                <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
              </ShareBadge>
            )}
          </Row>
          <Description>{note.description}</Description>
          {isShared && (
            <ShareText>
              {isSharedByMe 
                ? "Compartilhado por você" 
                : sharedByUserName 
                  ? `Compartilhado por ${sharedByUserName}` 
                  : "Compartilhado com você"
              }
            </ShareText>
          )}
        </MainContent>
        <Actions>
          <ActionButton onPress={() => setIsPopoverVisible(true)}>
            <MaterialIcons name="more-vert" size={24} color="#7201b5" />
          </ActionButton>
        </Actions>
        <Popover
          ref={popoverRef}
          isVisible={isPopoverVisible}
          onRequestClose={() => setIsPopoverVisible(false)}
          popoverStyle={{ borderRadius: 8 }}
          from={null}
        >
          <PopoverContainer>
            <PopoverItem onPress={handleEdit}>
              <MaterialIcons name="edit" size={20} color="#a7a9ac" />
              <PopoverItemText>Editar</PopoverItemText>
            </PopoverItem>
            {isShared && (
              <>
                <PopoverDivider />
                <PopoverItem onPress={handleShare}>
                  <MaterialIcons name="share" size={20} color="#a7a9ac" />
                  <PopoverItemText>Compartilhar</PopoverItemText>
                </PopoverItem>
              </>
            )}
            <PopoverDivider />
            <PopoverItem onPress={handleDeleteItem}>
              <MaterialIcons name="delete-outline" size={20} color="#b91c1c" />
              <PopoverItemText>Excluir</PopoverItemText>
            </PopoverItem>
          </PopoverContainer>
        </Popover>
      </Content>
    </Container>
  );
}
