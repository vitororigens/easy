import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Toast } from 'react-native-toast-notifications';
import { DefaultContainer } from '../../components/DefaultContainer';
import { LoadData } from '../../components/LoadData';
import { Loading } from '../../components/Loading';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useMarket } from '../../contexts/MarketContext';
import { IMarket } from '../../interfaces/IMarket';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTheme } from 'styled-components/native';
import PersonImage from '../../assets/illustrations/marketplace.png';
import { FinishMarkets } from '../../components/FinishMarkets';
import { ItemMarket } from '../../components/ItemMarket';
import { useMonth } from '../../context/MonthProvider';
import useMarketplaceCollections from '../../hooks/useHistoryMarketsCollection';
import { Timestamp } from '@react-native-firebase/firestore';
import { HistoryMarketModal } from '../../components/HistoryMarketModal';
import { formatCurrency } from '../../utils/mask';
import { NativeAdComponent } from '../../components/NativeAd';
import { getFirestore, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

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
} from './styles';

const modalBottom = Platform.OS === 'ios' ? 90 : 70;

type ActiveButtonType = 'mercado' | 'historico';

interface HistoryItem {
  id: string;
  name: string;
  finishedDate: string;
  finishedTime: string;
  markets: {
    id: string;
    name: string;
    createdAt: string;
  }[];
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

  const [activeButton, setActiveButton] = useState<ActiveButtonType>('mercado');
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const marketplaceData = useMarketplaceCollections('Marketplace');

  // Filtrar apenas os itens do usuário atual
  const filteredMarketplaceData = useMemo(() => {
    if (!marketplaceData || !user?.user?.uid) return [];

    const filtered = marketplaceData.filter(item => item.uid === user.user?.uid);

    return filtered;
  }, [marketplaceData, user.user?.uid]);

  // Combinar todos os mercados em uma única lista
  const allMarkets = useMemo(() => {
    return markets || [];
  }, [markets]);

  // Adicionar informações úteis sobre os mercados
  const marketStats = useMemo(() => {
    // Garantir que todos os preços sejam números válidos
    const totalValue = allMarkets.reduce((acc, curr) => {
      // Converter o preço para número
      const price = typeof curr.price === 'number' ? curr.price : 0;
      return acc + price;
    }, 0);

    const stats = {
      totalItems: allMarkets.length,
      completedItems: allMarkets.filter(m => m.status).length,
      pendingItems: allMarkets.filter(m => !m.status).length,
      totalValue,
    };

    return stats;
  }, [allMarkets]);

  const handleButtonClick = (buttonName: ActiveButtonType) => {
    setActiveButton(buttonName);
  };

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  const handleEditMarket = (marketId: string) => {
    // @ts-ignore
    navigation.navigate('market-item', { selectedItemId: marketId });
  };

  const handleDeleteMarket = async (marketId: string) => {
    try {
      console.log('Tentando excluir mercado:', marketId);
      await deleteMarket(marketId);
      // Remove o item da lista de selecionados quando ele é excluído
      setSelectedMarkets(prev => prev.filter(id => id !== marketId));
      console.log('Mercado excluído com sucesso:', marketId);
    } catch (error) {
      console.error('Erro ao excluir mercado:', error);
      Toast.show('Erro ao excluir o item', { type: 'error' });
    }
  };

  const handleToggleCompletion = async (marketId: string) => {
    try {
      await toggleMarketCompletion(marketId);
    } catch (error) {
      Toast.show('Erro ao alternar status do item', { type: 'error' });
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
            createdAt: dateStr,
            price: market.price || 0,
            quantity: market.quantity || 1,
            measurement: market.measurement || 'un',
            category: market.category || 'outros',
          };
        }) || [];

      const now = new Date();
      const marketplaceData = {
        name: groupName,
        uid: user.user?.uid || '',
        finishedDate: format(now, 'dd/MM/yyyy'),
        finishedTime: format(now, 'HH:mm:ss'),
        markets: selectedMarketsInfo,
        createdAt: Timestamp.now(),
        totalValue: selectedMarketsInfo.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
      };

      // Primeiro, adiciona ao histórico
      await getFirestore().collection('Marketplace').add(marketplaceData);

      // Depois, exclui os itens selecionados da lista original
      for (const marketId of selectedMarkets) {
        try {
          await deleteMarket(marketId);
        } catch (error) {
          console.error(`Erro ao excluir mercado ${marketId}:`, error);
        }
      }

      setSelectedMarkets([]);
      Toast.show('Itens finalizados com sucesso!', { type: 'success' });
    } catch (error) {
      Toast.show('Erro ao finalizar itens', { type: 'error' });
    }
  };

  const handleDeleteHistoryItem = async (itemId: string) => {
    Alert.alert(
      'Excluir histórico',
      'Tem certeza que deseja excluir este item do histórico?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await getFirestore().collection('Marketplace').doc(itemId).delete();
              Toast.show('Item excluído do histórico!', { type: 'success' });
            } catch (error) {
              Toast.show('Erro ao excluir item do histórico', { type: 'error' });
            }
          },
        },
      ],
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
            onPress={() => handleButtonClick('mercado')}
            active={activeButton === 'mercado'}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Mercado</Title>
          </Button>
          <Button
            onPress={() => handleButtonClick('historico')}
            active={activeButton === 'historico'}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Histórico de compras</Title>
          </Button>
        </NavBar>
      </Header>

      {activeButton === 'mercado' && (
        <Content>
          {/* <ContentTitle type="PRIMARY" onPress={handleToggleSummary}>
            <HeaderContainer>
              <SectionIcon type="PRIMARY" name="chart-bar" />
              <Title type="PRIMARY">Resumo</Title>
            </HeaderContainer>
            <Icon name={isSummaryVisible ? "arrow-drop-up" : "arrow-drop-down"} type="PRIMARY" />
          </ContentTitle> */}
          {isSummaryVisible && (
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
          )}

          {/* <ContentTitle type="PRIMARY">
            <HeaderContainer>
              <SectionIcon type="PRIMARY" name="cart-variant" />
              <Title type="PRIMARY">Lista de Compras</Title>
            </HeaderContainer>
          </ContentTitle> */}
          <Container>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={allMarkets}
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
        </Content>
      )}

      {activeButton === 'historico' && (
        <Content>
          <ContentTitle type="PRIMARY">
            <HeaderContainer>
              <SectionIcon type="PRIMARY" name="history" />
              <Title type="PRIMARY">Histórico de compras</Title>
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
