import React from 'react';
import {
  Button,
  Container,
  ContainerMenu,
  Content,
  ContentItems,
  Divider,
  Icon,
  IconMenu,
  SubTitle,
  Title,
} from './styles';
import { AntDesign } from '@expo/vector-icons';
import { Popover } from 'react-native-popper';
import { TouchableOpacity } from 'react-native';
import { IMarketHistory } from '../../../services/firebase/market-history.firebase';
import { formatPrice } from '../../../utils/price';
import { format } from 'date-fns';

interface IMarketHistoryItemProps {
  marketHistory: IMarketHistory;
  handleDeleteMarketHistory: (marketHistory: IMarketHistory) => void;
}

export const MarketHistoryItem = ({
  marketHistory,
  handleDeleteMarketHistory,
}: IMarketHistoryItemProps) => {
  return (
    <Container>
      <Icon type="primary">
        <AntDesign name="infocirlce" size={24} color="white" />
      </Icon>
      <Content>
        <ContentItems>
          <Title type="primary">mercado</Title>
          <Title type="primary">
            {marketHistory.priceAmount
              ? formatPrice(marketHistory.priceAmount)
              : 'R$ 0,00'}
          </Title>
        </ContentItems>
        <Divider />
        <ContentItems>
          <SubTitle>
            {format(marketHistory.createdAt.toDate(), 'dd/MM/yyyy')}
          </SubTitle>
          <SubTitle>Pago</SubTitle>
        </ContentItems>
      </Content>
      <Popover
        trigger={
          <TouchableOpacity>
            <IconMenu type="primary" name="dots-three-vertical" />
          </TouchableOpacity>
        }
      >
        <Popover.Backdrop />
        <Popover.Content>
          <ContainerMenu>
            <Button onPress={() => handleDeleteMarketHistory(marketHistory)}>
              <IconMenu type="primary" name="trash" />
              <Title type="primary">Excluir</Title>
            </Button>
          </ContainerMenu>
        </Popover.Content>
      </Popover>
    </Container>
  );
};
