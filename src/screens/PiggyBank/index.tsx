import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, View } from "react-native";
import { useTheme } from "styled-components/native";
//
import { Content, Divider, Header, SubTitle, Title } from "./styles";
//
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
//
import { Items } from "../../components/Items";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { formatCurrency } from "../../utils/formatCurrency";

const screenWidth = Dimensions.get("window").width;

export function PiggyBank() {
  const user = useUserAuth();
  const PiggyBankData = useFirestoreCollection('PiggyBank');
  const { selectedMonth } = useMonth()
  const uid = user?.uid;
  const [isLoaded, setIsLoaded] = useState(false);

  const { COLORS } = useTheme();

  const valueTotal = PiggyBankData.filter(item => item.uid === uid && item.month === selectedMonth)
    .reduce((total, item) => total + parseFloat(item.valueItem), 0);






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
    <DefaultContainer newLaunch monthButton backButton>
      <Container type="SECONDARY" title="Cofrinho">
        <Content>
          <Header>
            <Divider />
          </Header>

          <View style={{
            top: 40
          }}>
            <View>
              <SubTitle style={{
                textAlign: 'center'
              }} type="PRIMARY">Parabéns</SubTitle>
              <Title style={{ textAlign: 'center', width: '100%' }}>
                Você economizou {formatCurrency(valueTotal.toString())} esse mês!
              </Title>
              <Title style={{ textAlign: 'center', width: '100%', marginBottom: 40}}>
                Guarde em uma poupança para render mais.
              </Title>

            </View>


            <View>
              {PiggyBankData.filter(item => item.uid === uid).length === 0 ? (
                <ScrollView>
                  <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de entradas! Comece adicionando uma nova entrada.' />
                </ScrollView>
              ) : (

                <FlatList
                  data={PiggyBankData.filter(item => item.uid === uid && item.month === selectedMonth)}
                  renderItem={({ item }) => (
                    <Items
                      showItemPiggyBank
                      type={item.description}
                      category={item.name}
                      date={item.date}
                      valueTransaction={formatCurrency(item.valueItem)}
                    />

                  )}
                />
              )}
            </View>
          </View>

        </Content>
      </Container>
    </DefaultContainer>
  );
}
