import React from 'react';
import {
  Container,
  ContentTitle,
  DividerContent,
  Icon,
  SubTitle,
  Title,
} from './styles';
import { FlatList, RefreshControl, View } from 'react-native';
import { MarketItem } from '../../components/MarketItem';
import { IMarket } from '../../services/firebase/market.firebase';
import { useMarket } from '../../contexts/MarketContext';

interface IMarketTabMyContentProps {
  setIsMyListVisible: (value: boolean) => void;
  isMyListVisible: boolean;
  myMarkets: IMarket[];
  selectedItems: IMarket[];
  handleEditItem: (id: string) => void;
  handleRemoveItem: (item: IMarket) => void;
  handleAddItem: (item: IMarket) => void;
}

export const MyMarketsTabContent = ({
  setIsMyListVisible,
  isMyListVisible,
  myMarkets,
  selectedItems,
  handleEditItem,
  handleRemoveItem,
  handleAddItem,
}: IMarketTabMyContentProps) => {
  const { loading } = useMarket();

  return (
    <>
      <ContentTitle
        onPress={() => setIsMyListVisible(!isMyListVisible)}
      >
        <Title>Minha lista de compras</Title>
        <DividerContent />
        <Icon
          name={isMyListVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
        />
      </ContentTitle>

      {isMyListVisible && (
        <Container>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={myMarkets}
            renderItem={({ item }) => (
              <MarketItem
                onEditItem={() => handleEditItem(item.id)}
                removeItem={() => handleRemoveItem(item)}
                addItem={() => handleAddItem(item)}
                measurement={item.measurement || ''}
                quantity={item.quantity || 0}
                title={item.name}
                price={item.price || 0}
                resetCountQuantity={selectedItems.length ? false : true}
              />
            )}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
            ListEmptyComponent={
              <View
                style={{
                  padding: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SubTitle>
                  Você não possui produtos na sua lista
                </SubTitle>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {}}
              />
            }
          />
        </Container>
      )}
    </>
  );
};
