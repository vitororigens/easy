import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle, ContainerItems, HeaderItems, TitleItems } from "./styles";
import { useState } from "react";
import { Items } from "../../components/Items";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { FlatList, TouchableOpacity } from "react-native";
import { useTotalValue } from "../../hooks/useTotalValue";
import { Loading } from "../../components/Loading";
import { LoadData } from "../../components/LoadData";
import { database } from "../../services";
import { CustomModal } from "../../components/CustomModal";

export function Home() {
  const user = useUserAuth();
  const [activeButton, setActiveButton] = useState("receitas");
  const uid = user?.uid;
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');
  const { totalExpense, totalRevenue, totalValue } = useTotalValue(uid || 'Não foi possivel encontrar o uid');
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');

  const formattedRevenue = totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedExpense = totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedTotalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function handleRevenueConfirmation(documentId: string) {
    setConfirmRevenueVisible(true);
    setSelectedItemId(documentId);
  }

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
  }

  function handleDeleteRevenue(documentId: string) {
    const revenueRef = database.collection('Revenue').doc(documentId);
    revenueRef.delete()
      .then(() => {
        console.log('Documento de receita excluído com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao excluir o documento de receita:', error);
      });
    setConfirmRevenueVisible(false);
  }

  function handleDeleteExpense(documentId: string) {
    const expenseRef = database.collection('Expense').doc(documentId);
    expenseRef.delete()
      .then(() => {
        console.log('Documento de despesa excluído com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao excluir o documento de despesa:', error);
      });
    setConfirmExpenseVisible(false);
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      {user ? (
        <DefaultContainer addButton monthButton>
          <Container type="PRIMARY" name="file-invoice-dollar" title={formattedTotalValue}>
            <Content>
              <Header>
                <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
                <NavBar>
                  <Button onPress={() => handleButtonClick("receitas")}>
                    <Title>
                      Receitas
                    </Title>
                    <SubTitle type="PRIMARY">
                      {formattedRevenue}
                    </SubTitle>
                  </Button>
                  <Button onPress={() => handleButtonClick("despesas")}>
                    <Title>
                      Despesas
                    </Title>
                    <SubTitle type="SECONDARY">
                      {formattedExpense}
                    </SubTitle>
                  </Button>
                </NavBar>
              </Header>
              {activeButton === "receitas" && (
                <ContainerItems>
                  <HeaderItems type="PRIMARY">
                    <TitleItems>
                      Histórico
                    </TitleItems>
                  </HeaderItems>
                  {revenue.filter(item => item.uid === uid).length === 0 ? (
                    <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de entradas' />
                  ) : (
                    <FlatList
                      data={revenue.filter(item => item.uid === uid)}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleRevenueConfirmation(item.id)}> 
                          <Items
                            type={item.type}
                            category={item.category}
                            date={item.date}
                            repeat={item.repeat}
                            valueTransaction={item.valueTransaction}
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
                    <TitleItems>
                      Histórico
                    </TitleItems>
                  </HeaderItems>
                  {expense.filter(item => item.uid === uid).length === 0 ? (
                    <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de saidas' />
                  ) : (
                    <FlatList
                      data={expense.filter(item => item.uid === uid)}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleExpenseConfirmation(item.id)}> 
                          <Items
                            type={item.type}
                            category={item.category}
                            date={item.date}
                            repeat={item.repeat}
                            valueTransaction={item.valueTransaction}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </ContainerItems>
              )}
            </Content>
          </Container>
          <CustomModal
            animationType="slide"
            transparent={true}
            onCancel={() => setConfirmRevenueVisible(false)}
            onClose={() => setConfirmRevenueVisible(false)}
            onConfirme={() => {
              handleDeleteRevenue(selectedItemId);
            }}
            title="Deseja realmente excluir esta receita?"
            visible={confirmRevenueVisible}
          />
          <CustomModal
            animationType="slide"
            transparent={true}
            onCancel={() => setConfirmExpenseVisible(false)}
            onClose={() => setConfirmExpenseVisible(false)}
            onConfirme={() => {
              handleDeleteExpense(selectedItemId);
            }}
            title="Deseja realmente excluir esta despesa?"
            visible={confirmExpenseVisible}
          />
        </DefaultContainer>
      ) : (
        <Loading />
      )}
    </>
  );
}
