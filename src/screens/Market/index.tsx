import React, { useEffect, useState, useMemo } from "react";
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
import useMarketplaceCollections from "../../hooks/useHistoryMarketsCollection";
import { database } from "../../libs/firebase";
import { Timestamp } from "@react-native-firebase/firestore";
import { HistoryMarketModal } from "../../components/HistoryMarketModal";
import { formatCurrency } from "../../utils/mask";
import { NativeAdComponent } from "../../components/NativeAd";

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
  StatsContainer,
  StatItem,
  StatValue,
  StatLabel,
  ContainerHistory,
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

  console.log("Componente Market renderizado");
  console.log("Usuário atual:", user?.uid);
  console.log("Mercados carregados:", markets);
  console.log("Loading:", loading);

  // Adicionar logs para depuração
  useEffect(() => {
    console.log("useEffect no componente Market");
    console.log("Usuário atual:", user?.uid);
    console.log("Mercados carregados:", markets);
    console.log("Loading:", loading);
  }, [user, markets, loading]);

  const [activeButton, setActiveButton] = useState("mercado");
  const [isListVisible, setIsListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const marketplaceData = useMarketplaceCollections("Marketplace");

  // Filtrar apenas os itens do usuário atual
  const filteredMarketplaceData = useMemo(() => {
    if (!marketplaceData || !user?.uid) return [];
    
    console.log('Filtrando histórico para usuário:', user.uid);
    const filtered = marketplaceData.filter(item => item.uid === user.uid);
    console.log('Total de itens no histórico:', marketplaceData.length);
    console.log('Total após filtragem:', filtered.length);
    
    return filtered;
  }, [marketplaceData, user?.uid]);

  const personalMarkets = useMemo(() => {
    console.log("Filtrando mercados pessoais");
    console.log("Total de mercados:", markets?.length);
    const filtered = markets?.filter(market => market.isOwner) || [];
    console.log("Mercados pessoais encontrados:", filtered.map(m => ({ 
      id: m.id, 
      name: m.name,
      isOwner: m.isOwner,
      isShared: m.isShared
    })));
    return filtered;
  }, [markets]);

  const sharedMarkets = useMemo(() => {
    console.log("Filtrando mercados compartilhados");
    console.log("Total de mercados:", markets?.length);
    console.log("Mercados disponíveis:", markets?.map(m => ({
      id: m.id,
      name: m.name,
      isOwner: m.isOwner,
      isShared: m.isShared,
      shareInfo: m.shareInfo,
      shareWith: m.shareWith
    })));
    
    const filtered = markets?.filter(market => {
      const isShared = market.isShared && !market.isOwner;
      console.log("Verificando mercado:", {
        id: market.id,
        name: market.name,
        isShared: market.isShared,
        isOwner: market.isOwner,
        shareInfo: market.shareInfo,
        shareWith: market.shareWith
      });
      return isShared;
    }) || [];
    
    console.log("Mercados compartilhados encontrados:", filtered.map(m => ({ 
      id: m.id, 
      name: m.name,
      isOwner: m.isOwner,
      isShared: m.isShared,
      shareInfo: m.shareInfo,
      shareWith: m.shareWith
    })));
    return filtered;
  }, [markets]);

  // Adicionar informações úteis sobre os mercados
  const marketStats = useMemo(() => {
    console.log("Calculando estatísticas dos mercados");
    console.log("Mercados pessoais:", personalMarkets.length);
    console.log("Mercados compartilhados:", sharedMarkets.length);
    
    // Garantir que todos os preços sejam números válidos
    const allMarkets = [...personalMarkets, ...sharedMarkets];
    const totalValue = allMarkets.reduce((acc, curr) => {
      // Converter o preço para número
      const price = typeof curr.price === 'number' ? curr.price : 0;
      return acc + price;
    }, 0);
    
    const stats = {
      totalItems: allMarkets.length,
      completedItems: allMarkets.filter(m => m.status).length,
      pendingItems: allMarkets.filter(m => !m.status).length,
      totalValue: totalValue
    };
    
    console.log("Estatísticas calculadas:", stats);
    return stats;
  }, [personalMarkets, sharedMarkets]);

  // Adicionar logs para depuração
  useEffect(() => {
    console.log("Estatísticas dos mercados:", {
      total: marketStats.totalItems,
      completed: marketStats.completedItems,
      pending: marketStats.pendingItems,
      value: marketStats.totalValue
    });
  }, [marketStats]);

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
      // Remove o item da lista de selecionados quando ele é excluído
      setSelectedMarkets(prev => prev.filter(id => id !== marketId));
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
      // Pega as informações dos itens selecionados antes de finalizá-los
      const selectedMarketsInfo = markets
        ?.filter(market => selectedMarkets.includes(market.id))
        .map(market => {
          let dateStr: string;
          if (market.createdAt && typeof market.createdAt === 'object') {
            if ('seconds' in market.createdAt) {
              dateStr = new Date(market.createdAt.seconds * 1000).toISOString();
            } else {
              dateStr = new Date(market.createdAt).toISOString();
            }
          } else {
            dateStr = new Date().toISOString();
          }

          return {
            id: market.id,
            name: market.name,
            createdAt: dateStr
          };
        }) || [];

      const now = new Date();
      const marketplaceData = {
        name: groupName,
        uid: user?.uid,
        finishedDate: format(now, "dd/MM/yyyy"),
        finishedTime: format(now, "HH:mm:ss"),
        markets: selectedMarketsInfo,
        createdAt: Timestamp.now(),
      };

      // Primeiro, adiciona ao histórico
      await database.collection("Marketplace").add(marketplaceData);

      // Depois, exclui os itens selecionados da lista original
      for (const marketId of selectedMarkets) {
        await deleteMarket(marketId);
      }

      setSelectedMarkets([]);
      Toast.show("Itens finalizados com sucesso!", { type: "success" });
    } catch (error) {
      console.error("Erro ao finalizar itens:", error);
      Toast.show("Erro ao finalizar itens", { type: "error" });
    }
  };

  const handleDeleteHistoryItem = async (itemId: string) => {
    Alert.alert(
      "Excluir histórico",
      "Tem certeza que deseja excluir este item do histórico?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await database.collection("Marketplace").doc(itemId).delete();
              Toast.show("Item excluído do histórico!", { type: "success" });
            } catch (error) {
              console.error("Erro ao excluir item do histórico:", error);
              Toast.show("Erro ao excluir item do histórico", { type: "error" });
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <DefaultContainer newItemMarketplace monthButton title="Lista de Mercado">
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
          <ContentTitle>
            <HeaderContainer>
              <SectionIcon name="chart-bar" />
              <Title>Resumo</Title>
            </HeaderContainer>
          </ContentTitle>
          <Container>
            <StatsContainer>
              
              <StatItem>
                <StatValue>{marketStats.totalItems}</StatValue>
                <StatLabel>Total de itens</StatLabel>
              </StatItem>
              {selectedMarkets.length > 0 && (
                <StatItem>
                  <StatValue>{selectedMarkets.length}</StatValue>
                  <StatLabel>Itens selecionados</StatLabel>
                </StatItem>
              )}
              <StatItem>
                <StatValue>{marketStats.pendingItems}</StatValue>
                <StatLabel>Itens pendentes</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{formatCurrency(marketStats.totalValue).formatted}</StatValue>
                <StatLabel>Valor total</StatLabel>
              </StatItem>
            </StatsContainer>
          </Container>

          <ContentTitle type="PRIMARY" onPress={() => setIsListVisible(!isListVisible)}>
            <HeaderContainer>
              <SectionIcon type="PRIMARY" name="cart-variant" />
              <Title type="PRIMARY">Meus itens</Title>
            </HeaderContainer>
            <Icon type="PRIMARY" name={isListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={personalMarkets}
                renderItem={({ item, index }) => (
                  <View>
                    <ItemMarket
                      market={item}
                      handleDelete={() => handleDeleteMarket(item.id)}
                      handleUpdate={() => handleEditMarket(item.id)}
                      isSelected={selectedMarkets.includes(item.id)}
                      onSelect={() => handleSelectMarket(item.id)}
                    />
                    {index % 5 === 0 && index !== 0 && (
                      <NativeAdComponent style={{ marginVertical: 10 }} />
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
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

          <ContentTitle type="PRIMARY" onPress={() => setIsSharedListVisible(!isSharedListVisible)}>
            <HeaderContainer>
              <SectionIcon type="PRIMARY" name="share-variant" />
              <Title type="PRIMARY">Itens compartilhados</Title>
            </HeaderContainer>
            <Icon type="PRIMARY" name={isSharedListVisible ? "arrow-drop-up" : "arrow-drop-down"} />
          </ContentTitle>
          {isSharedListVisible && (
            <Container>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sharedMarkets}
                renderItem={({ item, index }) => (
                  <View>
                    <ItemMarket
                      market={item}
                      handleDelete={() => handleDeleteMarket(item.id)}
                      handleUpdate={() => handleEditMarket(item.id)}
                      isSelected={selectedMarkets.includes(item.id)}
                      onSelect={() => handleSelectMarket(item.id)}
                    />
                    {index % 5 === 0 && index !== 0 && (
                      <NativeAdComponent style={{ marginVertical: 10 }} />
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
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
          <ContainerHistory>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredMarketplaceData || []}
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
                    ✅ Total de itens: {item.markets?.length || 0}
                  </DateText>
                  <TouchableOpacity 
                    onPress={() => handleDeleteHistoryItem(item.id)}
                    style={{ position: 'absolute', right: 10, top: 10 }}
                  >
                    <Icon name="delete" size={24} color={COLORS.RED_700} />
                  </TouchableOpacity>
                </MarketCard>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
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
          </ContainerHistory>
        </Content>
      )}

      {selectedMarkets.length > 0 && (
        <FinishMarkets
          selectedCount={selectedMarkets.length}
          onFinish={(groupName: string) => handleFinishSelectedMarkets(groupName)}
        />
      )}

      {modalActive && selectedHistoryItem && (
        <HistoryMarketModal
          onClose={() => setModalActive(false)}
          groupName={selectedHistoryItem.name}
          finishedDate={selectedHistoryItem.finishedDate}
          finishedTime={selectedHistoryItem.finishedTime}
          markets={selectedHistoryItem.markets || []}
        />
      )}
    </DefaultContainer>
  );
}
