import React, { Dispatch, SetStateAction, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { LoadData } from "../../components/LoadData";
import {
  deleteMarketHistory,
  IMarketHistory,
  listMarketHistories,
  listMarketHistoriesSharedWithMe,
} from "../../services/firebase/market-history.firebase";
import { Toast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { MarketHistoryItem } from "./MarketHistoryItem";
import PersonImage from "../../assets/illustrations/marketplace.png";
import { Container, ContentTitle, DividerContent, Icon, Title } from "./styles";
import { useUserAuth } from "../../hooks/useUserAuth";

interface IMarketHistoryTabContentProps {
  marketHistories: IMarketHistory[];
  setMarketHistories: Dispatch<SetStateAction<IMarketHistory[]>>;
  sharedMarketHistories: IMarketHistory[];
  setSharedMarketHistories: Dispatch<SetStateAction<IMarketHistory[]>>;
}

export const MarketHistoryTabContent = ({
  marketHistories,
  setMarketHistories,
  sharedMarketHistories,
  setSharedMarketHistories,
}: IMarketHistoryTabContentProps) => {
  const navigation = useNavigation();
  const loggedUser = useUserAuth();

  const [isRefreshingMarketHistory, setIsRefreshingMarketHistory] =
    useState(false);
  const [isRefreshingSMarketHistory, setIsRefreshingSMarketHistory] =
    useState(false);
  const [isMarketHistoryVisible, setIsMarketHistoryVisible] = useState(true);
  const [isSharedMarketHistoryVisible, setIsSharedMarketHistoryVisible] =
    useState(false);

  const handleDeleteMarketHistory = async (marketHistory: IMarketHistory) => {
    try {
      await deleteMarketHistory({
        expenseId: marketHistory.expenseId,
        marketHistoryId: marketHistory.id,
      });

      setMarketHistories((p) => p.filter((p) => p.id !== marketHistory.id));

      Toast.show("Histórico de compras excluído", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a lista: ", error);
    }
  };

  const handleDeleteSharedMarketHistory = async (
    marketHistory: IMarketHistory
  ) => {
    try {
      await deleteMarketHistory({
        expenseId: marketHistory.expenseId,
        marketHistoryId: marketHistory.id,
      });

      setSharedMarketHistories((p) =>
        p.filter((p) => p.id !== marketHistory.id)
      );

      Toast.show("Histórico de compras excluído", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a lista: ", error);
    }
  };

  const handleNavigateToMarketHistoryDetails = (id: string) => {
    navigation.navigate("market-history-item", { selectedItemId: id });
  };

  const fetchMyMarketHistory = async () => {
    if (!loggedUser?.uid) return;
    try {
      setIsRefreshingMarketHistory(true);
      const response = await listMarketHistories(loggedUser.uid);

      setMarketHistories(response);
    } catch (error) {
      console.error("Erro ao buscar os mercados: ", error);
    } finally {
      setIsRefreshingMarketHistory(false);
    }
  };

  const fetchSharedMarketHistory = async () => {
    if (!loggedUser?.uid) return;
    try {
      setIsRefreshingSMarketHistory(true);
      const response = await listMarketHistoriesSharedWithMe(loggedUser.uid);

      setSharedMarketHistories(response);
    } catch (error) {
      console.error("Erro ao buscar os mercados: ", error);
    } finally {
      setIsRefreshingSMarketHistory(false);
    }
  };

  const handleRefreshMarketHistory = async () => {
    await fetchMyMarketHistory();
  };

  const handleRefreshSharedMarketHistory = async () => {
    await fetchSharedMarketHistory();
  };

  return (
    <>
      <ContentTitle
        onPress={() => setIsMarketHistoryVisible(!isMarketHistoryVisible)}
      >
        <Title>Meu histórico de compras</Title>
        <DividerContent />
        <Icon
          name={isMarketHistoryVisible ? "arrow-drop-up" : "arrow-drop-down"}
        />
      </ContentTitle>
      {isMarketHistoryVisible && (
        <Container>
          <FlatList
            style={{ marginTop: !!marketHistories.length ? 16 : 0 }}
            data={marketHistories}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleNavigateToMarketHistoryDetails(item.id)}
              >
                <MarketHistoryItem
                  marketHistory={item}
                  handleDeleteMarketHistory={handleDeleteMarketHistory}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
            ListEmptyComponent={
              <LoadData
                imageSrc={PersonImage}
                title="Oops!"
                subtitle="Você ainda não possui dados para exibir aqui! Comece adicionando itens no seu carrinho e crie sua lista de mercado."
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingMarketHistory}
                onRefresh={handleRefreshMarketHistory}
              />
            }
          />
        </Container>
      )}

      {/* TODO: Create component to tab */}
      <ContentTitle
        onPress={() =>
          setIsSharedMarketHistoryVisible(!isSharedMarketHistoryVisible)
        }
      >
        <Title>Histórico de compras compartilhado</Title>
        <DividerContent />
        <Icon
          name={
            isSharedMarketHistoryVisible ? "arrow-drop-up" : "arrow-drop-down"
          }
        />
      </ContentTitle>
      {isSharedMarketHistoryVisible && (
        <Container>
          <FlatList
            style={{ marginTop: !!marketHistories.length ? 16 : 0 }}
            data={sharedMarketHistories}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleNavigateToMarketHistoryDetails(item.id)}
              >
                <MarketHistoryItem
                  marketHistory={item}
                  handleDeleteMarketHistory={handleDeleteSharedMarketHistory}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
            ListEmptyComponent={
              <LoadData
                imageSrc={PersonImage}
                title="Oops!"
                subtitle="Você ainda não possui dados para exibir aqui!."
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingSMarketHistory}
                onRefresh={handleRefreshSharedMarketHistory}
              />
            }
          />
        </Container>
      )}
    </>
  );
};
