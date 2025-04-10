import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useMarket } from "../../contexts/MarketContext";
import { IMarket } from "../../interfaces/IMarket";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useTheme } from "styled-components/native";
import PersonImage from "../../assets/illustrations/marketplace.png";
import { FinishMarkets } from "../../components/FinishMarkets";
import { ItemMarket } from "../../components/ItemMarket";
import { useMonth } from "../../context/MonthProvider";
import useHistoryMarketsCollections from "../../hooks/useHistoryMarketsCollection";
import { database } from "../../libs/firebase";
import { Timestamp } from "@react-native-firebase/firestore";
import { HistoryMarketModal } from "../../components/HistoryMarketModal";

import {
  Title,
  ContentTitle,
  Icon,
  Container,
  Content,
  HeaderContainer,
  SectionIcon,
  EmptyContainer,
  Header,
  NavBar,
  Button,
  SubTitle,
  MarketCard,
  MarketName,
  DateText,
} from "./styles";

const modalBottom = Platform.OS === "ios" ? 90 : 70;

interface HistoryItem {
  id: string;
  name: string;
  finishedDate: string;
  finishedTime: string;
  markets: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

interface ShareInfo {
  uid: string;
  acceptedAt: Timestamp | null;
}

export function Market({ route }: any) {
  const reload = route?.params?.reload;
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const { selectedMonth } = useMonth();
  const user = useUserAuth();
  const { markets, loading, deleteMarket, toggleMarketCompletion } = useMarket();

  const [activeButton, setActiveButton] = useState("mercado");
  const [isListVisible, setIsListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const historyUserMonth = useHistoryMarketsCollections("HistoryMarkets");

  const personalMarkets = markets.filter((market) => market.uid === user?.uid);
  const sharedMarkets = markets.filter(
    (market) =>
      market.shareWith.includes(user?.uid || "") &&
      market.shareInfo.some(
        (info: ShareInfo) => info.uid === user?.uid && info.acceptedAt !== null
      )
  );

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleEditMarket = (marketId: string) => {
    // @ts-ignore
    navigation.navigate("market-item", { selectedItemId: marketId });
  };

  const handleDeleteMarket = async (marketId: string) => {
    try {
      await deleteMarket(marketId);
      Toast.show("Item excluído!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir o item: ", error);
      Toast.show("Erro ao excluir o item", { type: "error" });
    }
  };

  const handleToggleCompletion = async (marketId: string) => {
    try {
      await toggleMarketCompletion(marketId);
    } catch (error) {
      console.error("Erro ao alternar status do item: ", error);
      Toast.show("Erro ao alternar status do item", { type: "error" });
    }
  };

  const handleSelectMarket = (marketId: string) => {
    setSelectedMarkets(prev => {
      if (prev.includes(marketId)) {
        return prev.filter(id => id !== marketId);
      }
      return [...prev, marketId];
    });
  };

  const handleFinishSelectedMarkets = async (groupName: string) => {
    try {
      // Primeiro, finaliza todos os itens selecionados
      for (const marketId of selectedMarkets) {
        await toggleMarketCompletion(marketId);
      }

      // Pega as informações dos itens selecionados
      const selectedMarketsInfo = markets
        .filter(market => selectedMarkets.includes(market.id))
        .map(market => {
          let dateStr: string;
          if (market.createdAt && typeof market.createdAt === 'object') {
            if ('seconds' in market.createdAt) {
              // É um Timestamp do Firestore
              dateStr = new Date(market.createdAt.seconds * 1000).toISOString();
            } else {
              // É um objeto Date
              dateStr = new Date(market.createdAt).toISOString();
            }
          } else {
            // É uma string ou outro formato
            dateStr = new Date().toISOString();
          }

          return {
            id: market.id,
            name: market.name,
            createdAt: dateStr
          };
        });

      const now = new Date();
      const historyData = {
        name: groupName,
        uid: user?.uid,
        finishedDate: format(now, "dd/MM/yyyy"),
        finishedTime: format(now, "HH:mm:ss"),
        markets: selectedMarketsInfo,
        createdAt: Timestamp.now(),
      };

      await database.collection("HistoryMarkets").add(historyData);

      setSelectedMarkets([]);
      Toast.show("Itens finalizados com sucesso!", { type: "success" });
    } catch (error) {
      console.error("Erro ao finalizar itens:", error);
      Toast.show("Erro ao finalizar itens", { type: "error" });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <DefaultContainer newItem monthButton title="Lista de Mercado">
      <Header>
        <NavBar>
          <Button
            onPress={() => handleButtonClick("mercado")}
            active={activeButton === "mercado"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Mercado</Title>
          </Button>
          <Button
            onPress={() => handleButtonClick("historico")}
            active={activeButton === "historico"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Histórico de compras</Title>
          </Button>
        </NavBar>
      </Header>

      {activeButton === "mercado" && (
        <Content>
          <ContentTitle onPress={() => setIsListVisible(!isListVisible)}>
            <HeaderContainer>
              <SectionIcon name="cart-variant" />
              <Title>Meus itens</Title>
            </HeaderContainer>
            <Icon name={isListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={personalMarkets}
                renderItem={({ item }) => (
                  <ItemMarket
                    market={item}
                    handleDelete={() => handleDeleteMarket(item.id)}
                    handleUpdate={() => handleEditMarket(item.id)}
                    isSelected={selectedMarkets.includes(item.id)}
                    onSelect={() => handleSelectMarket(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <LoadData
                      imageSrc={PersonImage}
                      title="Comece agora!"
                      subtitle="Adicione um item clicando em +"
                    />
                  </EmptyContainer>
                }
              />
            </Container>
          )}

          <ContentTitle onPress={() => setIsSharedListVisible(!isSharedListVisible)}>
            <HeaderContainer>
              <SectionIcon name="share-variant" />
              <Title>Itens compartilhados</Title>
            </HeaderContainer>
            <Icon name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isSharedListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sharedMarkets}
                renderItem={({ item }) => (
                  <ItemMarket
                    market={item}
                    handleDelete={() => handleDeleteMarket(item.id)}
                    handleUpdate={() => handleEditMarket(item.id)}
                    isSelected={selectedMarkets.includes(item.id)}
                    onSelect={() => handleSelectMarket(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                  <EmptyContainer>
                    <SubTitle>Nenhum item compartilhado</SubTitle>
                  </EmptyContainer>
                }
              />
            </Container>
          )}
        </Content>
      )}

      {activeButton === "historico" && (
        <Content>
          <ContentTitle>
            <HeaderContainer>
              <SectionIcon name="history" />
              <Title>Histórico de compras</Title>
            </HeaderContainer>
          </ContentTitle>
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={historyUserMonth}
              renderItem={({ item }) => (
                <MarketCard onPress={() => {
                  setModalActive(true);
                  setSelectedHistoryItem(item);
                }}>
                  <MarketName>{item.name}</MarketName>
                  <DateText>
                    📅 Finalizado em: {item.finishedDate} às {item.finishedTime}
                  </DateText>
                  <DateText>
                    ✅ Total de itens: {item.markets.length}
                  </DateText>
                </MarketCard>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <EmptyContainer>
                  <LoadData
                    imageSrc={PersonImage}
                    title="Nenhum conjunto de itens"
                    subtitle="Finalize alguns itens para ver seu histórico"
                  />
                </EmptyContainer>
              }
            />
          </Container>
        </Content>
      )}

      <FinishMarkets
        selectedCount={selectedMarkets.length}
        onFinish={(groupName: string) => handleFinishSelectedMarkets(groupName)}
      />

      {modalActive && selectedHistoryItem && (
        <HistoryMarketModal
          onClose={() => setModalActive(false)}
          groupName={selectedHistoryItem.name}
          finishedDate={selectedHistoryItem.finishedDate}
          finishedTime={selectedHistoryItem.finishedTime}
          markets={selectedHistoryItem.markets}
        />
      )}
    </DefaultContainer>
  );
}
