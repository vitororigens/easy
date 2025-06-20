import React from "react";
import { TouchableOpacity } from "react-native";
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
} from "./styles";
import { formatPrice } from "../../utils/price";

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
        <TouchableOpacity onPress={handleUpdate} style={{ flex: 1 }}>
          <Title status={isSelected}>{market.name}</Title>
          <Description status={!!market.status}>
            {market.quantity} {market.measurement} - {formatPrice(market.price || 0)}
          </Description>
        </TouchableOpacity>
        <Actions>
          <ActionButton onPress={handleUpdate}>
            <MaterialIcons name="edit" size={24} color="#6B7280" />
          </ActionButton>
          <ActionButton onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#EF4444" />
          </ActionButton>
        </Actions>
      </Content>
    </Container>
  );
} 