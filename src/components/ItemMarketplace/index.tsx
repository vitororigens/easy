import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components/native";
import {
    Button,
    CartIcon,
    Container,
    ContainerQuantity,
    Contant,
    Icon,
    SubTitle,
    Title,
    ViewLeft,
    ViewRight,
} from "./styles";
import { formatCurrency } from "../../utils/formatCurrency";
import { currencyMask } from "../../utils/currency";

type ItemMarketplaceProps = {
  title: string;
  quantity: number;
  value: number;
  measurements: string;
  addItem: (value: number) => void;
  removeItem: (value: number) => void;
  onEditItem: () => void;
  resetCountQuantity?: boolean;
};

export function ItemMarketplace({
  title,
  quantity,
  resetCountQuantity,
  value,
  measurements,
  addItem,
  removeItem,
  onEditItem,
}: ItemMarketplaceProps) {
  const { COLORS } = useTheme();
  const [isTyping, setIsTyping] = useState(false);
  const [quantityValue, setQuantityValue] = useState(1);

  const handleClickAddItem = () => {
    setIsTyping(true);
    addItem(value);
  };

  const handleDecreaseQuantity = () => {
    if (quantityValue > 1) {
      setQuantityValue(quantityValue - 1);
    }
    removeItem(value);

    if (quantityValue === 1) {
      setIsTyping(false);
      removeItem(value);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantityValue(quantityValue + 1);
    addItem(value);
  };

  useEffect(() => {
    if (resetCountQuantity) {
      setQuantityValue(1);
      setIsTyping(false);
    }
  }, [resetCountQuantity]);

  return (
    <Container>
      <ViewLeft>
        <CartIcon name="cart-variant" />

        <Contant>
          <Button onPress={onEditItem}>
            <Title
              style={{
                textDecorationLine: isTyping ? "line-through" : "none",
                color: isTyping ? COLORS.GRAY_400 : COLORS.GRAY_600,
              }}
            >
              {title}
            </Title>
            <SubTitle>
              {quantity} {measurements}
            </SubTitle>
          </Button>
        </Contant>
      </ViewLeft>

      <ViewRight>
        <Contant style={{ justifyContent: "center", alignItems: "center" }}>
          {isTyping ? (
            <ContainerQuantity>
              <Button onPress={handleDecreaseQuantity}>
                <Icon name="minus" />
              </Button>
              <Title>{quantityValue}</Title>
              <Button onPress={handleIncreaseQuantity}>
                <Icon name="plus" />
              </Button>
            </ContainerQuantity>
          ) : (
            <Button onPress={handleClickAddItem}>
              <Icon name="circle-with-plus" />
            </Button>
          )}
          <Title style={{ textAlign: "center", width: 100 }}> {formatCurrency(String(value ?? "0"))}</Title>
        </Contant>
      </ViewRight>
    </Container>
  );
}
