import React, { useEffect, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle, ButtonClose } from "./styles";
import { LoadData } from "../../components/LoadData";
import { ItemMarketplace } from "../../components/ItemMarketplace";
import useMarketplaceCollections, { MarketplaceData } from "../../hooks/useMarketplaceCollections";
import { FlatList, Modal, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useTheme } from "styled-components/native";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";
import { Cart } from "../../components/Cart";
import useFirestoreCollection, { ExpenseData } from "../../hooks/useFirestoreCollection";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency } from "../../utils/formatCurrency";
import { Loading } from "../../components/Loading";
import { useMonth } from "../../hooks/MonthProvider";
import { ListItem } from "../../components/ListItem";
import { NewItem } from "../NewItem";

const modalBottom = Platform.OS === 'ios' ? 90 : 70;

export function Marketplace() {
  const [activeButton, setActiveButton] = useState("items");
  const [confirmItemVisible, setConfirmItemVisible] = useState(false)
  const data = useMarketplaceCollections('Marketplace');
  const expense = useFirestoreCollection('Expense');
  const [modalActive, setModalActive] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedItemData, setSelectedItemData] = useState('');
  console.log('id',selectedItemData)
  const [isLoaded, setIsLoaded] = useState(false);

  const { selectedMonth } = useMonth()
  const user = useUserAuth();
  const uid = user?.uid;
  const { COLORS } = useTheme();

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleAddItem = (value: string) => {
    setItemsCount(itemsCount + 1);
    setTotalValue(prevTotal => prevTotal + parseFloat(value));
    setModalActive(true);
  };

  const handleRemoveItem = (value: string) => {
    setItemsCount(itemsCount - 1);
    setTotalValue(prevTotal => prevTotal - parseFloat(value));
    if (itemsCount - 1 <= 0) {
      setModalActive(false);
      setItemsCount(0)
      setTotalValue(0)
    }
  };

  const handleSaveList = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    database
      .collection('Expense')
      .doc()
      .set({
        category: 'mercado',
        uid: uid,
        date: formattedDate,
        valueTransaction: totalValue,
        description: '',
        repeat: false,
        type: 'output',
        month: month

      })
      .then(() => {
        Toast.show('Transação adicionada!', { type: 'success' });
        setModalActive(false);
        setItemsCount(0);
        setTotalValue(0);
      })
      .catch(error => {
        console.error('Erro ao adicionar a transação: ', error);
      });
  };


  function handleEditItem (documentId: string) {
      setConfirmItemVisible(true)
      setSelectedItemData(documentId)

  }





  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer monthButton newItem>
      <Container type="SECONDARY" title="Mercado">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "items" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("items")}>
                <Title>
                  Lista
                </Title>
              </Button>
              <Button onPress={() => handleButtonClick("lista")}>
                <Title>
                  Carrinho
                </Title>
              </Button>
            </NavBar>
          </Header>

          {activeButton === "items" &&
            (expense.filter(item => item.uid === uid && item.category === 'mercado').length === 0 && uid !== undefined ? (
              <ScrollView>
                <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui! começe adicionando itens no seu carrinho e crie sua lista de mercado.' />
              </ScrollView>
            ) : (
              <FlatList
                data={data.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <ListItem title={item.name} />
                )}
              />
            ))
          }
          {activeButton === "lista" && (
            data.filter(item => item.uid === uid).length === 0 ? (
              <ScrollView>
                <LoadData image='SECONDARY' title='Desculpe!' subtitle='Não há itens disponíveis para exibir aqui! Clique em "Novo" e adicione um item!' />
              </ScrollView>
            ) : (
              <FlatList
                data={data.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <ItemMarketplace
                    onEditItem={() => handleEditItem(item.id)}
                    removeItem={handleRemoveItem}
                    addItem={handleAddItem}
                    measurements={item.measurements}
                    quantity={item.amount}
                    title={item.name}
                    value={item.valueItem}
                  />
                )}
                ListFooterComponent={<View style={{ marginBottom: 70 }} />}
              />
            )
          )}
        </Content>
      </Container>

      <Modal visible={confirmItemVisible} onRequestClose={() => setConfirmItemVisible(false)}>
            <NewItem selectedItemId={selectedItemData} closeBottomSheet={() => setConfirmItemVisible(false)} onCloseModal={() => setConfirmItemVisible(false)} showButtonSave showButtonRemove />
      </Modal>
      {modalActive && (
        <View style={{
          position: 'absolute',
          bottom: modalBottom,
          left: 20,
          backgroundColor: COLORS.TEAL_600,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 100, width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10
        }}>
          <Cart
            buttonSave={handleSaveList}
            itemsCount={itemsCount}
            totalValue={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          />
        </View>
      )}
    </DefaultContainer>
  );
}
