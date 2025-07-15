import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../DefaultContainer";
import { Button, Content, Title, TotalValue } from "./styles";
import { useEffect, useState } from "react";
import {
  findMarketHistoryById,
  IMarketHistory,
} from "../../services/firebase/market-history.firebase";
import { MarketHistoryItem } from "./historyItem";
import { formatPrice } from "../../utils/price";
import { createManyMarkets } from "../../services/firebase/market.firebase";

export function HistoryMarketplaceModal() {
  const route = useRoute();

  const [marketHistory, setMarketHistory] = useState<IMarketHistory | null>(
    null
  );

  const { selectedItemId } = route.params as { selectedItemId?: string };

  const navigation = useNavigation();

  const handleSaveListAgain = async () => {
    if (!marketHistory?.markets || marketHistory.markets.length === 0) return;

    try {
      await createManyMarkets(
        marketHistory.markets.map(({ id, ...rest }) => ({
          ...rest,
        }))
      );
      Toast.show("Itens adicionados!", { type: "success" });
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
    } catch (error) {
      console.error("Erro ao criar os itens: ", error);
    }
  };

  const findMarketHistory = async () => {
    if (!selectedItemId) return;
    try {
      const mh = await findMarketHistoryById(selectedItemId);
      setMarketHistory(mh);
    } catch (error) {
      console.error("Erro ao buscar o histórico de compras: ", error);
    }
  };

  useEffect(() => {
    findMarketHistory();
  }, [selectedItemId]);
  return (
    <>
      <DefaultContainer title="Produtos" backButton>
        <Content>
          <FlatList
            data={marketHistory?.markets || []}
            renderItem={({ item }) => <MarketHistoryItem market={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={<View style={{ height: 90 }} />}
          />
          <View>
            <TotalValue>
              Valor total: {formatPrice(marketHistory?.priceAmount || 0)}
            </TotalValue>
          </View>
          <View style={{ marginBottom: 0, height: 60 }}>
            <Button onPress={handleSaveListAgain}>
              <Title>Usar lista novamente</Title>
            </Button>
          </View>
        </Content>
      </DefaultContainer>
    </>
  );
}
