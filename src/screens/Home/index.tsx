import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle, ContainerItems, HeaderItems, TitleItems } from "./styles";
import { useState } from "react";
import { Items } from "../../components/Items";
import { useFinanceData } from "../../hooks/useFinanceAuth";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection, { ExpenseData } from "../../hooks/useFirestoreCollection";
import { FlatList } from "react-native";
import { useTotalValue } from "../../hooks/useTotalValue";



export function Home() {
  const user = useUserAuth()
  const [activeButton, setActiveButton] = useState("receitas");
  const uid = user?.uid;
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');
  const {totalExpense, totalRevenue,totalValue} = useTotalValue(uid || 'Não foi possivel encontrar o uid')

  const formattedRevenue = totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedExpense = totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedTotalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
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
          {activeButton === "receitas" &&
            <ContainerItems>
              <HeaderItems type="PRIMARY">
                <TitleItems>
                  Histórico
                </TitleItems>

              </HeaderItems>
              <FlatList
                data={revenue.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <Items 
                  type={item.type} 
                  category={item.category} 
                  date={item.date} 
                  repeat={item.repeat}
                  valueTransaction={item.valueTransaction} />
                )}
              />
            </ContainerItems>
          }
          {activeButton === "despesas" &&
            <ContainerItems>
              <HeaderItems type="SECONDARY">
                <TitleItems>
                  Histórico
                </TitleItems>

              </HeaderItems>
              <FlatList
                data={expense.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <Items
                    type={item.type}
                    category={item.category}
                    date={item.date}
                    repeat={item.repeat}
                    valueTransaction={item.valueTransaction}
                  />
                )}
              />

            </ContainerItems>}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
