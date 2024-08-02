import { useNavigation } from "@react-navigation/native";
import { format, getMonth, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import PersonImage from "../../assets/illustrations/marketplace.png";
import { Cart } from "../../components/Cart";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemMarketplace } from "../../components/ItemMarketplace";
import { Items } from "../../components/Items";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useMonth } from "../../context/MonthProvider";
import useHistoryMarketplaceCollections, {
  HistoryMarketplaceData,
} from "../../hooks/useHistoryMarketplaceCollection";
import useMarketplaceCollections, {
  MarketplaceData,
} from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { formatCurrency } from "../../utils/formatCurrency";
import { NewItem } from "../NewItem";
import { Button, Header, NavBar, Title } from "./styles";

const modalBottom = Platform.OS === "ios" ? 50 : 60;

export function Marketplace() {
  const { selectedMonth } = useMonth();
  const [activeButton, setActiveButton] = useState("lista");
  const [confirmItemVisible, setConfirmItemVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [selectedListData, setSelectedListData] =
    useState<HistoryMarketplaceData | null>(null);
  const [selectedItemData, setSelectedItemData] = useState("");
  const [selectedItems, setSelectedItems] = useState<MarketplaceData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const data = useMarketplaceCollections("Marketplace");
  const selectedItemsId = selectedItems.map((item) => item.id);

  const navigation = useNavigation();

  const user = useUserAuth();
  const uid = user?.uid;
  const { COLORS } = useTheme();

  const history = useHistoryMarketplaceCollections("HistoryMarketplace").filter(
    (item) => item.uid === uid
  );

  const historyMonth = history.filter((item) => {
    const month =
      getMonth(parse(item.finishedDate, "dd/MM/yyyy", new Date())) + 1;
    return month === selectedMonth;
  });

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.amount,
    0
  );
  const totalValue = selectedItems.reduce(
    (total, item) => total + (item.totalValue || 0),
    0
  );

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "items") {
      setModalActive(false);
      setSelectedItems([]);
    }
    setActiveButton(buttonName);
  };

  const handleAddItem = (item: MarketplaceData) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );
    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex].amount += 1;
      updatedItems[itemIndex].totalValue =
        updatedItems[itemIndex].valueItem * updatedItems[itemIndex].amount;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        { ...item, amount: 1, totalValue: item.valueItem },
      ]);
    }
  };

  const handleRemoveItem = (item: MarketplaceData) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );
    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];
      if (updatedItems[itemIndex].amount > 1) {
        updatedItems[itemIndex].amount -= 1;
        updatedItems[itemIndex].totalValue =
          updatedItems[itemIndex].valueItem * updatedItems[itemIndex].amount;
        setSelectedItems(updatedItems);
      } else {
        // Remove the item if amount is 1
        updatedItems.splice(itemIndex, 1);
        setSelectedItems(updatedItems);
      }
    }
  };

  const handleDeleteList = async (idExpense: string, idHistory: string) => {
    const expenseRef = database.collection("Expense").doc(idExpense);
    const historyMarketplaceRef = database
      .collection("HistoryMarketplace")
      .doc(idHistory);

    try {
      await database.runTransaction(async (transaction) => {
        // Excluir o documento na coleção 'Expense'
        transaction.delete(expenseRef);

        // Excluir o documento na coleção 'HistoryMarketplace'
        transaction.delete(historyMarketplaceRef);
      });

      Toast.show("Lista excluída!", { type: "success" });
    } catch (error) {
      console.error("Erro ao excluir a lista: ", error);
    }
  };

  const handleSaveListAgain = async () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const expenseRef = database.collection("Expense").doc();
    const historyMarketplaceRef = database
      .collection("HistoryMarketplace")
      .doc();

    try {
      await database.runTransaction(async (transaction) => {
        transaction.set(expenseRef, {
          category: "mercado",
          uid: uid,
          date: formattedDate,
          valueTransaction: selectedListData?.total,
          description: "",
          repeat: false,
          type: "output",
          month: month,
          status: true,
        });

        transaction.set(historyMarketplaceRef, {
          idExpense: expenseRef.id,
          finishedDate: formattedDate,
          uid: uid,
          items: selectedListData?.items,
          total: selectedListData?.total,
        });
      });

      Toast.show("Lista de compras adicionada!", { type: "success" });
      setModalActive(false);
      setSelectedItems([]);
      closeModals();
    } catch (error) {
      console.error("Erro ao adicionar Lista de compras: ", error);
    }
  };

  const handleSaveList = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const formattedDate = format(currentDate, "dd/MM/yyyy");

    const expenseRef = database.collection("Expense").doc();
    const historyMarketplaceRef = database
      .collection("HistoryMarketplace")
      .doc();

    try {
      await database.runTransaction(async (transaction) => {
        transaction.set(expenseRef, {
          category: "mercado",
          uid: uid,
          date: formattedDate,
          valueTransaction: totalValue,
          description: "",
          repeat: false,
          type: "output",
          month: month,
          status: true,
        });

        transaction.set(historyMarketplaceRef, {
          idExpense: expenseRef.id,
          finishedDate: formattedDate,
          uid: uid,
          items: selectedItems,
          total: totalValue,
        });
      });

      Toast.show("Lista de compras adicionada!", { type: "success" });
      setModalActive(false);
      setSelectedItems([]);
      removeItemsMarketplace(selectedItemsId);
    } catch (error) {
      console.error("Erro ao adicionar lista de compras: ", error);
    }
  };

  function handleEditItem(documentId: string) {
    navigation.navigate("newitem", { selectedItemId: documentId });
  }

  function removeItemsMarketplace(documentIds: string[]) {
    const batch = database.batch();

    documentIds.forEach((documentId) => {
      const docRef = database.collection("Marketplace").doc(documentId);
      batch.delete(docRef);
    });

    batch.commit().catch((error) => {
      console.error("Erro ao excluir os produtos: ", error);
    });
  }

  const handleListSelected = (documentId: string) => {
    navigation.navigate("historymarketplace", { selectedItemId: documentId });
  };

  const closeModals = () => {
    setSelectedListData(null);
    setShowHistory(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!totalAmount) return setModalActive(false);

    setModalActive(true);
  }, [totalAmount]);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer
      monthButton
      newItemMarketplace
      title="Lista de Mercado"
      type="PRIMARY"
      
    >
      <Header>
        <NavBar>
          <Button
            onPress={() => handleButtonClick("lista")}
            active={activeButton !== "lista"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Carrinho</Title>
          </Button>
          <Button
            onPress={() => handleButtonClick("items")}
            active={activeButton !== "items"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Histórico de compra</Title>
          </Button>
        </NavBar>
      </Header>
      {activeButton === "lista" && (
        <FlatList
          data={data.filter((item) => item.uid === uid)}
          renderItem={({ item }) => (
            <ItemMarketplace
              onEditItem={() => handleEditItem(item.id)}
              removeItem={() => handleRemoveItem(item)}
              addItem={() => handleAddItem(item)}
              measurements={item.measurements}
              quantity={item.amount}
              title={item.name}
              value={item.valueItem}
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
        />
      )}

      {activeButton === "items" && (
        <FlatList
          style={{ marginTop: !!historyMonth.length ? 16 : 0 }}
          data={historyMonth}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleListSelected(item.id)}>
              <Items
                showItemTask
                status={true}
                category="mercado"
                date={item.finishedDate}
                valueTransaction={
                  item.total ? formatCurrency(item.total) : "R$ 0,00"
                }
                onDelete={() => handleDeleteList(item.idExpense, item.id)}
                hasEdit={false}
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
        />
      )}

      <Modal
        visible={confirmItemVisible}
        onRequestClose={() => setConfirmItemVisible(false)}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <NewItem
            selectedItemId={selectedItemData}
            closeBottomSheet={() => setConfirmItemVisible(false)}
            onCloseModal={() => setConfirmItemVisible(false)}
            showButtonSave
            showButtonRemove
          />
        </View>
      </Modal>

      {modalActive && (
        <View
          style={{
            position: "absolute",
            bottom: modalBottom,
            left: 0,
            backgroundColor: COLORS.TEAL_600,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 100,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
          }}
        >
          <Cart
            buttonSave={handleSaveList}
            itemsCount={totalAmount}
            totalValue={totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
        </View>
      )}
    </DefaultContainer>
  );
}
