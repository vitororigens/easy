import { FlatList, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import useHistoryMarketplaceCollections from "../../hooks/useHistoryMarketplaceCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { formatCurrency } from "../../utils/formatCurrency";
import { DefaultContainer } from "../DefaultContainer";
import { Items } from "../Items";
import { Button, Content, Title, TotalValue } from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  selectedItemId?: string;
  onSaveListAgain?: () => void;
};

export function HistoryMarketplaceModal({
  closeBottomSheet,
  selectedItemId,
}: Props) {
  const user = useUserAuth();

  const historyData = useHistoryMarketplaceCollections("HistoryMarketplace");
  const selectedListMarketplace = historyData.find(
    (item) => item.id === selectedItemId
  );
  const items = selectedListMarketplace?.items;

  const handleSaveListAgain = () => {
    if (!items || items.length === 0) return;

    const batch = database.batch(); // Usar batch para executar múltiplas operações de uma vez

    items.forEach((item) => {
      const itemRef = database.collection("Marketplace").doc(); // Referência para cada novo documento
      batch.set(itemRef, {
        category: item.category,
        measurements: item.measurements,
        valueItem: item.valueItem,
        name: item.name,
        amount: item.amount,
        description: item.description,
        uid: item.uid,
      });
    });

    batch
      .commit()
      .then(() => {
        Toast.show("Itens adicionados!", { type: "success" });
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        console.error("Erro ao adicionar os itens:", error);
      });
  };

  return (
    <>
      <DefaultContainer hasHeader={false} title="Produtos" closeModalFn={closeBottomSheet}>
        <Content>
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
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <View>
            <TotalValue>
              Valor total: {selectedListMarketplace?.total ? formatCurrency(selectedListMarketplace?.total) : "R$ 0,00"}
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
