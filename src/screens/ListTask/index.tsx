import React, { useEffect, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar} from "./styles";
import { LoadData } from "../../components/LoadData";
import { ItemMarketplace } from "../../components/ItemMarketplace";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { FlatList, Modal, View, Platform, ScrollView } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useTheme } from "styled-components/native";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";
import { Cart } from "../../components/Cart";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { Loading } from "../../components/Loading";

import { ListItem } from "../../components/ListItem";
import { NewItem } from "../NewItem";
import { useMonth } from "../../context/MonthProvider";

const modalBottom = Platform.OS === 'ios' ? 90 : 70;

export function ListTask() {
  const [activeButton, setActiveButton] = useState("items");
  const [confirmItemVisible, setConfirmItemVisible] = useState(false)
  const data = useMarketplaceCollections('Marketplace');
  const dataTask = useMarketplaceCollections('Task');
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
    if(buttonName === "items") {
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
      <Container type="SECONDARY" title="Lista de tarefas">
        <Content>
          <Header>
            <Divider />
          </Header>

          {activeButton === "items" &&
            (dataTask.filter(item => item.uid === uid ).length === 0 ? (
              <ScrollView>
                <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui! começe adicionando itens no seu carrinho e crie sua lista de mercado.' />
              </ScrollView>
            ) : (
              <FlatList
                data={dataTask.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <ListItem title={item.name} />
                )}
              />
            ))
          }
        </Content>
      </Container>
    </DefaultContainer>
  );
}
