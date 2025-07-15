import { useState, useRef, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ITask } from "../../interfaces/ITask";
import {
  Container,
  Content,
  Title,
  Description,
  Actions,
  ActionButton,
  Checkbox,
  CheckboxContainer,
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
import { useUserAuth } from "../../hooks/useUserAuth";
import Popover from "react-native-popover-view";
import { findUserById } from "../../services/firebase/users.firestore";

interface ItemTaskProps {
  task: ITask;
  handleDelete: () => void;
  handleUpdate: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function ItemTask({
  task,
  handleDelete,
  handleUpdate,
  isSelected,
  onSelect,
}: ItemTaskProps) {
  const { user } = useUserAuth();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [sharedByUserName, setSharedByUserName] = useState<string>("");
  const popoverRef = useRef(null);
  
  console.log("ItemTask recebeu a tarefa:", task);

  // Verificar se é uma tarefa compartilhada
  const isShared = task.shareWith && task.shareWith.length > 0;
  const isSharedByMe = isShared && task.uid === user?.uid;

  useEffect(() => {
    const fetchSharedByUserName = async () => {
      if (isShared && !isSharedByMe && task.uid) {
        try {
          const userData = await findUserById(task.uid);
          if (userData) {
            setSharedByUserName(userData.userName);
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário que compartilhou:", error);
        }
      }
    };

    fetchSharedByUserName();
  }, [isShared, isSharedByMe, task.uid]);

  const handleEdit = () => {
    setIsPopoverVisible(false);
    handleUpdate();
  };

  const handleDeleteItem = () => {
    setIsPopoverVisible(false);
    handleDelete();
  };

  const handleToggleStatus = () => {
    setIsPopoverVisible(false);
    onSelect(); // Usar o onSelect para marcar como concluída
  };

  const handleShare = () => {
    setIsPopoverVisible(false);
    // Implementar funcionalidade de compartilhamento se necessário
  };

  return (
    <Container>
      <Content>
        <CheckboxContainer onPress={onSelect}>
          <Checkbox checked={isSelected}>
            {isSelected && (
              <MaterialIcons name="check" size={16} color="#FFF" />
            )}
          </Checkbox>
        </CheckboxContainer>
        <MainContent>
          <Row>
            <Title>{task.name}</Title>
            {isShared && (
              <ShareBadge>
                <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
              </ShareBadge>
            )}
          </Row>
          <Description>{task.description}</Description>
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
            <PopoverItem onPress={handleToggleStatus}>
              <MaterialIcons 
                name={task.status ? "check-circle-outline" : "radio-button-unchecked"} 
                size={20} 
                color={task.status ? "#16a34a" : "#a7a9ac"} 
              />
              <PopoverItemText>
                {task.status ? "Marcar como não concluída" : "Marcar como concluída"}
              </PopoverItemText>
            </PopoverItem>
            <PopoverDivider />
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
