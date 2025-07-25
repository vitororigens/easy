import React from "react";
import {
  Container,
  ContentTitle,
  DividerContent,
  Icon,
  SubTitle,
  Title,
} from "./styles";
import { FlatList, RefreshControl, View } from "react-native";
import { MarketItem } from "../../components/MarketItem";
import { IMarket } from "../../services/firebase/market.firebase";
import { useMarket } from "../../contexts/MarketContext";

interface ISharedMarketsTabContentProps {
  setIsSharedListVisible: (value: boolean) => void;
  isSharedListVisible: boolean;
  sharedMarkets: IMarket[];
  selectedItems: IMarket[];
  handleEditItem: (id: string) => void;
  handleRemoveItem: (item: IMarket) => void;
  handleAddItem: (item: IMarket) => void;
}

export const SharedMarketsTabContent = ({
  setIsSharedListVisible,
  isSharedListVisible,
  sharedMarkets,
  selectedItems,
  handleEditItem,
  handleRemoveItem,
  handleAddItem,
}: ISharedMarketsTabContentProps) => {
  const { loading } = useMarket();

  return (
    <>
      <ContentTitle
        onPress={() => setIsSharedListVisible(!isSharedListVisible)}
      >
        <Title>Lista de compras compartilhada</Title>
        <DividerContent />
        <Icon
          name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"}
        />
      </ContentTitle>

      {isSharedListVisible && (
        <Container>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={sharedMarkets}
            renderItem={({ item }) => (
              <MarketItem
                onEditItem={() => handleEditItem(item.id)}
                removeItem={() => handleRemoveItem(item)}
                addItem={() => handleAddItem(item)}
                measurement={item.measurement || ""}
                quantity={item.quantity || 0}
                title={item.name}
                price={item.price || 0}
                resetCountQuantity={!!selectedItems.length ? false : true}
              />
            )}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
            ListEmptyComponent={
              <View
                style={{
                  padding: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SubTitle>
                  Você não possui produtos compartilhado com você
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
