import { useState } from "react";
import { FlatList, View } from "react-native";
import useHistoryMarketplaceCollections from "../../hooks/useHistoryMarketplaceCollection";
import { formatCurrency } from "../../utils/formatCurrency";
import { Container } from "../Container";
import { DefaultContainer } from "../DefaultContainer";
import { Items } from "../Items";
import { Button, ButtonClose, Title, TotalValue } from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  selectedItemId?: string;
  onSaveListAgain?: () => void
};

export function HistoryMarketplaceModal({
  closeBottomSheet,
  selectedItemId,
  onSaveListAgain
}: Props) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const historyData = useHistoryMarketplaceCollections("HistoryMarketplace");
  const selectedListMarketplace = historyData.find(
    (item) => item.id === selectedItemId
  );
  const items = selectedListMarketplace?.items;

  return (
    <>
      <DefaultContainer hasHeader={false}>
        <ButtonClose onPress={closeBottomSheet} style={{alignSelf: "flex-end", marginBottom: 32}}>
          <Title style={{ color: "white" }}>Fechar</Title>
        </ButtonClose>
        <Container title={"Produtos"}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Items
                showItemTask
                status={true}
                category={item.name}
                valueTransaction={formatCurrency(item.valueItem.toString())}
                hasEdit={false}
                hasAction={false}
                date={item.amount.toString()}
              />
            )}
            keyExtractor={(item) => item.id}
          />
          <View>
            <TotalValue>
              Valor total: {formatCurrency(selectedListMarketplace?.total)}
            </TotalValue>
          </View>
          <View style={{ marginBottom: 0, height: 60 }}>
            <Button onPress={onSaveListAgain}>
              <Title>Usar lista novamente</Title>
            </Button>
          </View>
        </Container>
      </DefaultContainer>
    </>
  );
}
