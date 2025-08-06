import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';
import {
  Button,
  CartIcon,
  Container,
  ContainerQuantity,
  Content,
  Icon,
  SubTitle,
  Title,
  ViewLeft,
  ViewRight,
} from './styles';
import { formatPrice } from '../../utils/price';

type IMarketItemProps = {
  title: string;
  quantity: number;
  price: number;
  measurement: string;
  addItem?: () => void;
  removeItem?: () => void;
  onEditItem?: () => void;
  resetCountQuantity?: boolean;
};

export const MarketItem = ({
  title,
  quantity,
  resetCountQuantity,
  price,
  measurement,
  addItem,
  removeItem,
  onEditItem,
}: IMarketItemProps) => {
  const { COLORS } = useTheme();
  const [isTyping, setIsTyping] = useState(false);
  const [quantityValue, setQuantityValue] = useState(1);

  const handleClickAddItem = () => {
    setIsTyping(true);
    addItem && addItem();
  };

  const handleDecreaseQuantity = () => {
    if (quantityValue > 1) {
      setQuantityValue(quantityValue - 1);
    }
    removeItem && removeItem();

    if (quantityValue === 1) {
      setIsTyping(false);
      removeItem && removeItem();
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantityValue(quantityValue + 1);
    addItem && addItem();
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

        <Content>
          <Button onPress={onEditItem}>
            <Title
              style={{
                textDecorationLine: isTyping ? 'line-through' : 'none',
                color: isTyping ? COLORS.GRAY_400 : COLORS.GRAY_600,
              }}
            >
              {title}
            </Title>
            <SubTitle>
              {quantity} {measurement}
            </SubTitle>
          </Button>
        </Content>
      </ViewLeft>

      <ViewRight>
        <Content style={{ justifyContent: 'center', alignItems: 'center' }}>
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
          <Title style={{ textAlign: 'center', width: 100 }}>
            {formatPrice(price)}
          </Title>
        </Content>
      </ViewRight>
    </Container>
  );
};
