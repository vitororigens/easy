import React, { useState, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Container,
  Title,
  Description,
  Actions,
  ActionButton,
  PopoverContainer,
  PopoverItem,
  PopoverItemText,
  PopoverDivider,
} from "./styles";
import Popover from "react-native-popover-view";

interface ItemsListProps {
  title: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

export function ItemsList({
  title,
  description,
  onEdit,
  onDelete,
  onPress,
}: ItemsListProps) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const popoverRef = useRef(null);

  const handleEdit = () => {
    setIsPopoverVisible(false);
    onEdit && onEdit();
  };

  const handleDelete = () => {
    setIsPopoverVisible(false);
    onDelete && onDelete();
  };

  return (
    <Container>
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </TouchableOpacity>
        
        <Actions>
          <View>
            <Popover
              ref={popoverRef}
              isVisible={isPopoverVisible}
              onRequestClose={() => setIsPopoverVisible(false)}
              popoverStyle={{ borderRadius: 8 }}
              from={
                <ActionButton onPress={() => setIsPopoverVisible(true)}>
                  <MaterialIcons name="more-vert" size={24} color="#a7a9ac" />
                </ActionButton>
              }
            >
              <PopoverContainer>
                {onEdit && (
                  <PopoverItem onPress={handleEdit}>
                    <MaterialIcons name="edit" size={20} color="#a7a9ac" />
                    <PopoverItemText>Editar</PopoverItemText>
                  </PopoverItem>
                )}
                
                {onDelete && (
                  <>
                    {onEdit && <PopoverDivider />}
                    <PopoverItem onPress={handleDelete}>
                      <MaterialIcons name="delete-outline" size={20} color="#b91c1c" />
                      <PopoverItemText>Excluir</PopoverItemText>
                    </PopoverItem>
                  </>
                )}
              </PopoverContainer>
            </Popover>
          </View>
        </Actions>
    </Container>
  );
}
