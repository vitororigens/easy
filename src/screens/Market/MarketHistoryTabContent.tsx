import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
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

  // Limpar dados quando o usuário mudar
  useEffect(() => {
    if (!loggedUser?.uid) {
      console.log("Limpando dados do histórico - usuário deslogado");
      setMarketHistories([]);
      setSharedMarketHistories([]);
    }
  }, [loggedUser?.uid]);

  // Carregar dados quando o componente for montado
  useEffect(() => {
    if (loggedUser?.uid) {
      console.log("Carregando dados iniciais para o usuário:", loggedUser.uid);
      fetchMyMarketHistory();
      fetchSharedMarketHistory();
    }
  }, [loggedUser?.uid]);

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
    if (!loggedUser?.uid) {
      console.log("Usuário não autenticado ao buscar histórico");
      return;
    }
    try {
      console.log("Buscando histórico para o usuário:", loggedUser.uid);
      setIsRefreshingMarketHistory(true);
      const response = await listMarketHistories(loggedUser.uid);
      console.log("Histórico recebido:", response);
      setMarketHistories(response);
    } catch (error) {
      console.error("Erro ao buscar o histórico de compras: ", error);
      Toast.show("Erro ao carregar o histórico", { type: "error" });
    } finally {
      setIsRefreshingMarketHistory(false);
    }
  };

  const fetchSharedMarketHistory = async () => {
    if (!loggedUser?.uid) {
      console.log("Usuário não autenticado ao buscar histórico compartilhado");
      return;
    }
    try {
      console.log("Buscando histórico compartilhado para o usuário:", loggedUser.uid);
      setIsRefreshingSMarketHistory(true);
      const response = await listMarketHistoriesSharedWithMe(loggedUser.uid);
      console.log("Histórico compartilhado recebido:", response);
      setSharedMarketHistories(response);
    } catch (error) {
      console.error("Erro ao buscar o histórico compartilhado: ", error);
      Toast.show("Erro ao carregar o histórico compartilhado", { type: "error" });
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
        type="PRIMARY"
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
            style={{ marginTop: marketHistories.length ? 16 : 0 }}
            data={marketHistories}
            keyExtractor={(item) => item.id}
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
                title="Nenhum histórico encontrado"
                subtitle="Você ainda não possui histórico de compras. Comece adicionando itens no seu carrinho e crie sua lista de mercado."
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

      <ContentTitle
        type="PRIMARY"
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
            style={{ marginTop: sharedMarketHistories.length ? 16 : 0 }}
            data={sharedMarketHistories}
            keyExtractor={(item) => item.id}
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
                title="Nenhum histórico compartilhado"
                subtitle="Você ainda não possui histórico de compras compartilhado com você."
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
