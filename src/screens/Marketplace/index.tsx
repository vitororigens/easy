import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { FlatList, Modal, Platform, ScrollView, Text, TouchableOpacity, View, } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import { Cart } from "../../components/Cart";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemMarketplace } from "../../components/ItemMarketplace";
import { Items } from "../../components/Items";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection, { ExpenseData } from "../../hooks/useFirestoreCollection";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { formatCurrency } from "../../utils/formatCurrency";
import { NewItem } from "../NewItem";
import { Button, Content, Divider, Header, NavBar, Title } from "./styles";

const modalBottom = Platform.OS === 'ios' ? 90 : 70;

export function Marketplace() {
  const [activeButton, setActiveButton] = useState("items");
  const [confirmItemVisible, setConfirmItemVisible] = useState(false)
  const data = useMarketplaceCollections('Marketplace');
  const expense = useFirestoreCollection('Expense');
  const dataTask = useMarketplaceCollections('Task');
  const [modalActive, setModalActive] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [status, setStatus] = useState(false);
  const [selectedListData, setSelectedListData] = useState<ExpenseData | null>(null);
  const [selectedItemData, setSelectedItemData] = useState('');
  const [selectedList, setSelectedList] = useState(false);
  console.log('id', selectedItemData)
  const [isLoaded, setIsLoaded] = useState(false);

  const { selectedMonth } = useMonth()
  const user = useUserAuth();
  const uid = user?.uid;
  const { COLORS } = useTheme();

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "items") {
      setModalActive(false);
      setItemsCount(0);
      setTotalValue(0);
    }
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

  const handleDeleteList = () => {
    console.log("Selected List Data:", selectedListData);
    if (selectedListData) {
      database.collection('Expense').doc(selectedListData?.id).delete()
        .then(() => {
          Toast.show('Lista excluída!', { type: 'success' });
        })
        .catch(error => {
          console.error('Erro ao excluir a lista: ', error);
        });
    }
    setSelectedList(false);
  };
  
  const handleSaveListAgain = (selectedItemData: ExpenseData | null) => {
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
        month: month,
        status: true,

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
        month: month,
        status: true,

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
  const handleUseListAgain = () => {
    if (selectedItemData) {
      handleSaveListAgain(selectedListData);
    }
    setSelectedList(false);
  };

  function handleEditItem(documentId: string) {
    setConfirmItemVisible(true)
    setSelectedItemData(documentId)



  }

  const handleListSelected = (item: any) => {
    setSelectedListData(item);
    setSelectedList(true)
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
    <DefaultContainer monthButton  newItemMarketplace>
      <Container type="SECONDARY" title="Lista de Mercado">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "lista" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("lista")}>
                <Title>
                  Carrinho
                </Title>
              </Button>
              <Button onPress={() => handleButtonClick("items")}>
                <Title>
                  Histórico de compra
                </Title>
              </Button>
            </NavBar>
          </Header>
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
          {activeButton === "items" &&
            (expense.filter(item => item.uid === uid && item.category === 'mercado').length === 0 && uid !== undefined ? (
              <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui! Comece adicionando itens no seu carrinho e crie sua lista de mercado.' />
            ) : (
              <FlatList
                data={expense.filter(item => item.uid === uid && item.category === 'mercado' && item.month === selectedMonth)}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleListSelected(item)}>
                    <Items
                      showItemTask
                      status={item.status}
                      type={item.type}
                      category={item.category}
                      date={item.date}
                      repeat={item.repeat}
                      valueTransaction={formatCurrency(item.valueTransaction)}
                    />
                  </TouchableOpacity>
                )}
              />
            ))
          }

        </Content>
      </Container>

      <Modal visible={confirmItemVisible} onRequestClose={() => setConfirmItemVisible(false)}>
        <NewItem selectedItemId={selectedItemData} closeBottomSheet={() => setConfirmItemVisible(false)} onCloseModal={() => setConfirmItemVisible(false)} showButtonSave showButtonRemove />
      </Modal>
      <Modal
        visible={selectedList}
        transparent
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

          <View style={{
            width: 250,
            height: 80,
            alignItems: 'center',
            backgroundColor: COLORS.PURPLE_800,
            justifyContent: 'center',
            borderTopEndRadius: 20,
            borderTopLeftRadius: 20,
          }}>
            <View style={{
              width: '100%',
              paddingRight: 10,
              alignItems: 'flex-end'

            }}>
              <TouchableOpacity onPress={() => setSelectedList(false)}>
                <Text style={{
                  color: 'white'
                }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{
              alignItems: 'center'
            }}>
              <MaterialCommunityIcons name="cart-variant" size={32} color="white" />
            </View>

          </View>
          <View style={{
            width: 250,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: 5,
            borderBottomEndRadius: 20,
            borderBottomLeftRadius: 20
          }}>
            <Text>Lista mercado selecionado </Text>
            <Text style={{
              marginBottom: 10
            }}>
              Valor: {formatCurrency(selectedListData?.valueTransaction)}
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Button style={{
                backgroundColor: COLORS.GREEN_700,
                borderRadius: 20,
                width: '40%',
                padding: 5
              }} onPress={handleUseListAgain}>
                <Text style={{
                  color: 'white',
                  textAlign: 'center'
                }}>Usar Lista Novamente</Text>
              </Button>
              <Button style={{
                backgroundColor: COLORS.RED_700,
                borderRadius: 20,
                width: '40%'
              }} onPress={handleDeleteList}>
                <Text style={{
                  color: 'white'
                }}>Excluir Lista</Text>
              </Button>
            </View>
          </View>
        </View>
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
