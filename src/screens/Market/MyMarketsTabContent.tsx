import React, { useState } from "react";
import { Container, ContentTitle, DividerContent, Icon, Title } from "./styles";
import { FlatList, RefreshControl, View } from "react-native";
import { MarketItem } from "../../components/MarketItem";
import { LoadData } from "../../components/LoadData";
import PersonImage from "../../assets/illustrations/marketplace.png";
import { IMarket, listMarkets } from "../../services/firebase/market.firebase";
import { useUserAuth } from "../../hooks/useUserAuth";

interface IMarketTabMyContentProps {
  myMarkets: IMarket[];
  setMyMarkets: (items: IMarket[]) => void;
  selectedItems: IMarket[];
  setSelectedItems: (items: IMarket[]) => void;
  handleEditItem: (id: string) => void;
  handleRemoveItem: (item: IMarket) => void;
  handleAddItem: (item: IMarket) => void;
  isMyListVisible: boolean;
  setIsMyListVisible: (value: boolean) => void;
}

export const MyMarketsTabContent = ({
  handleAddItem,
  handleEditItem,
  handleRemoveItem,
  myMarkets,
  setMyMarkets,
  selectedItems,
  setSelectedItems,
  isMyListVisible,
  setIsMyListVisible,
}: IMarketTabMyContentProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = useUserAuth();

  const fetchMarkets = async () => {
    if (!user?.user?.uid) return;
    try {
      setIsRefreshing(true);
      const mMarkets = await listMarkets(user.user.uid);

      setMyMarkets(mMarkets);
    } catch (error) {
      console.error("Erro ao buscar os mercados: ", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await fetchMarkets();
    setSelectedItems([]);
  };

  return (
    <>
      <ContentTitle onPress={() => setIsMyListVisible(!isMyListVisible)}>
        <Title>Minha lista de compras</Title>
        <DividerContent />
        <Icon name={isMyListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
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
                measurement={item.measurement ?? ""}
                quantity={item.quantity ?? 0}
                title={item.name}
                price={item.price ?? 0}
                resetCountQuantity={!!selectedItems.length ? false : true}
              />
            )}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
            ListEmptyComponent={
              <LoadData
                imageSrc={PersonImage}
                title="Comece agora!"
                subtitle="Adicione um item clicando em +"
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </Container>
      )}
    </>
  );
};
