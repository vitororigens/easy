import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, SubTitle, Title } from "./styles";
import { PieChart } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import { useTheme } from "styled-components/native";
const screenWidth = Dimensions.get("window").width;


export function PiggyBank() {
  const { COLORS } = useTheme()
  const data = [
    {
      name: "Despesas",
      population: 10,
      color: COLORS.PURPLE_600,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Receitas",
      population: 90,
      color: COLORS.TEAL_600,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },]
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

  return (
    <DefaultContainer >
      <Container type="SECONDARY" title="Cofrinho">
        <Content>
          <Header>
            <Divider />
          </Header>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
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

            <SubTitle type="PRIMARY">
              Parabéns
            </SubTitle>
            <Title style={{
              textAlign: 'center'
            }}>
              Você economizou 80% do seu rendimento total!

            </Title>
          </View>
        </Content>
      </Container>
    </DefaultContainer>
  );
}
