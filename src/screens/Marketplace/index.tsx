import React, { useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { LoadData } from "../../components/LoadData";
import { ItemMarketplace } from "../../components/ItemMarketplace";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { FlatList, Modal, View, Text } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useTheme } from "styled-components/native";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";

export function Marketplace() {
  const [activeButton, setActiveButton] = useState("concluidos");
  const data = useMarketplaceCollections('Marketplace');
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
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

  const handleCloseModal = () => {
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
            date: formattedDate,
            valueTransaction: totalValue,
            type: 'output',
            uid: uid,
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


  return (
    <DefaultContainer monthButton newItem>
      <Container type="SECONDARY" title="Mercado">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "concluidos" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("concluidos")}>
                <Title>
                  Items
                </Title>
              </Button>
              <Button onPress={() => handleButtonClick("pendentes")}>
                <Title>
                  Lista
                </Title>
              </Button>
            </NavBar>
          </Header>
          {activeButton === "concluidos" &&
            <FlatList
              data={data.filter(item => item.uid === uid)}
              renderItem={({ item }) => (
                <ItemMarketplace
                  removeItem={handleRemoveItem}
                  addItem={handleAddItem}
                  measurements={item.measurements}
                  quantity={item.amount}
                  title={item.name}
                  value={item.valueItem}
                />
              )}
            />
          }
          {activeButton === "pendentes" && <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui!' />}
        </Content>
      </Container>
      {modalActive && (
        <View style={{ position: 'absolute', bottom: 70, left: 20, backgroundColor: COLORS.TEAL_600, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 100, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
          <View style={{
            width: '60%'
          }}>
            <Text style={{
              color: COLORS.GRAY_600
            }}>Itens: {itemsCount}</Text>
            <Text style={{
              color: COLORS.GRAY_600
            }}>Valor Total: {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
          </View>
          <View style={{
            width: '40%'
          }}>
            <Button style={{
              width: '100%',
              backgroundColor: COLORS.PURPLE_600,
              height: 60,
              borderRadius: 20
            }} onPress={handleCloseModal}>
              <Title style={{
                color: COLORS.WHITE
              }} >Criar lista</Title>
            </Button>
          </View>
        </View>

      )}
    </DefaultContainer>
  );
}
