import React, { useEffect, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, SubTitle, Title } from "./styles";
import { PieChart } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import { useTheme } from "styled-components/native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useTotalValue } from "../../hooks/useTotalValue";
import { Loading } from "../../components/Loading";
import { LoadData } from "../../components/LoadData";

const screenWidth = Dimensions.get("window").width;

export function PiggyBank() {
  const user = useUserAuth();
  const uid = user?.uid;
  const { totalExpense, totalRevenue } = useTotalValue(uid || 'Não foi possível encontrar o uid');
  const [isLoaded, setIsLoaded] = useState(false);

  const { COLORS } = useTheme();

  const savedPercentage = ((totalRevenue - totalExpense) / totalRevenue) * 100;
  const formattedSavedPercentage = savedPercentage.toFixed(2);

  const data = [
    {
      name: "Despesas",
      population: totalExpense,
      color: COLORS.PURPLE_600,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Receitas",
      population: totalRevenue,
      color: COLORS.TEAL_600,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(49, 46, 45, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
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
    <DefaultContainer newLaunch>
      <Container type="SECONDARY" title="Cofrinho">
        <Content>
          <Header>
            <Divider />
          </Header>
          {totalExpense === 0 || totalRevenue === 0 ? (
            <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui!                          vá para pagina inicial e comece adicionando um novo lançamento de entrada e saida.' />
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <PieChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 10]}
                absolute
              />
              {savedPercentage < 0 ? (
                <View>
                  <SubTitle style={{
                    textAlign: 'center'
                  }} type="PRIMARY">Shiii!</SubTitle>
                  <Title style={{ textAlign: 'center', width: 300 }}>
                    Desculpe, este mês você ficou com saldo negativo {formattedSavedPercentage}.
                  </Title>
                </View>
              ) : (
                <View>
                  <SubTitle style={{
                    textAlign: 'center'
                  }} type="PRIMARY">Parabéns</SubTitle>
                  <Title style={{ textAlign: 'center', width: 300 }}>
                    Você economizou {formattedSavedPercentage}% do seu rendimento total!
                  </Title>
                </View>
              )}
            </View>
          )}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
