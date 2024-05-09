import React, { useEffect, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle, ContainerItems, HeaderItems, TitleItems, ButtonClose } from "./styles";
import { Items } from "../../components/Items";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
import { useTotalValue } from "../../hooks/useTotalValue";
import { Loading } from "../../components/Loading";
import { LoadData } from "../../components/LoadData";
import { Revenue } from "../../components/Revenue";
import { Expense } from "../../components/Expense";
import { formatCurrency } from "../../utils/formatCurrency";
import { useMonth } from "../../context/MonthProvider";


export function Home() {
  const user = useUserAuth();
  const [activeButton, setActiveButton] = useState("receitas");
  const { selectedMonth } = useMonth()
  const uid = user?.uid;
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');

  const { tolalRevenueMunth, totalExpenseMunth } = useTotalValue(uid || 'Não foi possivel encontrar o uid');
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const formattedRevenue = tolalRevenueMunth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedExpense = totalExpenseMunth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const totalValue = tolalRevenueMunth - totalExpenseMunth
  const formattedTotalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  console.log(expense.filter(item => item.uid === uid))

  function handleRevenueConfirmation(documentId: string) {
    setConfirmRevenueVisible(true);
    setSelectedItemId(documentId);
  }

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer addButton monthButton>
      <Container type="PRIMARY" name="file-invoice-dollar" title={formattedTotalValue}>
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("receitas")}>
                <Title>Receitas</Title>
                <SubTitle type="PRIMARY">{formattedRevenue}</SubTitle>
              </Button>
              <Button onPress={() => handleButtonClick("despesas")}>
                <Title>Despesas</Title>
                <SubTitle type="SECONDARY">{formattedExpense}</SubTitle>
              </Button>
            </NavBar>
          </Header>
          {activeButton === "receitas" && (
            <ContainerItems>
              <HeaderItems type="PRIMARY">
                <TitleItems>Histórico</TitleItems>
              </HeaderItems>
              {revenue.filter(item => item.uid === uid).length === 0 ? (
                <ScrollView>
                  <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de entradas! começe adicionando uma nova entrada.' />
                </ScrollView>
              ) : (

                <FlatList
                  data={revenue.filter(item => item.uid === uid && item.month === selectedMonth)}
                  renderItem={({ item }) => (

                    <TouchableOpacity onPress={() => handleRevenueConfirmation(item.id)}>
                      <Items
                        showItemTaskRevenue
                        type={item.type}
                        category={item.category}
                        date={item.date}
                        repeat={item.repeat}
                        valueTransaction={formatCurrency(item.valueTransaction)}
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            </ContainerItems>
          )}
          {activeButton === "despesas" && (
            <ContainerItems>
              <HeaderItems type="SECONDARY">
                <TitleItems>Histórico</TitleItems>
              </HeaderItems>
              {expense.filter(item => item.uid === uid).length === 0 ? (
                <ScrollView>
                  <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de saídas! Começe lanaçando uma nova saida.' />
                </ScrollView>
              ) : (
                <FlatList
                  data={expense.filter(item => item.uid === uid && item.month === selectedMonth)}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleExpenseConfirmation(item.id)}>
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
              )}
            </ContainerItems>
          )}
        </Content>
      </Container>

      <Modal visible={confirmRevenueVisible} onRequestClose={() => setConfirmRevenueVisible(false)}>

        <DefaultContainer>
          <ButtonClose onPress={() => setConfirmRevenueVisible(false)} >
            <Title style={{ color: 'white' }}>Fechar</Title>
          </ButtonClose>
          <Container title={'Editar Entrada'}>
            <Revenue selectedItemId={selectedItemId} showButtonRemove onCloseModal={() => setConfirmRevenueVisible(false)} showButtonEdit />
          </Container>
        </DefaultContainer>
      </Modal>
      <Modal visible={confirmExpenseVisible} onRequestClose={() => setConfirmExpenseVisible(false)}>

        <DefaultContainer>
          <ButtonClose onPress={() => setConfirmExpenseVisible(false)} >
            <Title style={{ color: 'white' }}>Fechar</Title>
          </ButtonClose>
          <Container type="SECONDARY" title={'Editar Saida'}>
            <Expense selectedItemId={selectedItemId} showButtonRemove onCloseModal={() => setConfirmExpenseVisible(false)} showButtonEdit />
          </Container>
        </DefaultContainer>
      </Modal>
    </DefaultContainer>
  );
}
