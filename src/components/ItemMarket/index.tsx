import React, { useState, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IMarket } from "../../interfaces/IMarket";
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
  Unit,
  Price,
} from "./styles";
import { formatPrice } from "../../utils/price";
import { useUserAuth } from "../../hooks/useUserAuth";
import Popover from "react-native-popover-view";
import { findUserById } from "../../services/firebase/users.firestore";

interface ItemMarketProps {
  market: IMarket;
  handleDelete: () => void;
  handleUpdate: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function ItemMarket({
  market,
  handleDelete,
  handleUpdate,
  isSelected,
  onSelect,
}: ItemMarketProps) {
  const { user } = useUserAuth();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [sharedByUserName, setSharedByUserName] = useState<string>("");
  const popoverRef = useRef(null);
  
  // Verificar se o usuário pode excluir este item
  // Pode excluir se for o criador (uid) OU se for o proprietário (isOwner)
  const isCreator = market.uid === user?.uid;
  const canDelete = isCreator || market.isOwner;

  // Verificar se é um item compartilhado
  const isShared = market.isShared;
  const isSharedByMe = isShared && isCreator;

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

  useEffect(() => {
    const fetchSharedByUserName = async () => {
      if (isShared && !isSharedByMe && market.uid) {
        try {
          const userData = await findUserById(market.uid);
          if (userData) {
            setSharedByUserName(userData.userName);
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário que compartilhou:", error);
        }
      }
    };

    fetchSharedByUserName();
  }, [isShared, isSharedByMe, market.uid]);

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
            <Title>{market.name}</Title>
            {isShared && (
              <ShareBadge>
                <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
              </ShareBadge>
            )}
          </Row>
          <Description>
            <Unit>{market.quantity} {market.measurement}</Unit>
            <Price> - {formatPrice(market.price || 0)}</Price>
          </Description>
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