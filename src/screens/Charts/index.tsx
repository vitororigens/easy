import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export function Charts() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Rainy Days"] 
  };

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
    <DefaultContainer monthButton>
      <Container type="SECONDARY" title="ANÁLISE GRÁFICA">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("receitas")}>
                <Title>
                  Receitas
                </Title>

              </Button>
              <Button onPress={() => handleButtonClick("despesas")}>
                <Title>
                  Despesas
                </Title>

              </Button>
            </NavBar>
          </Header>
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        </Content>
      </Container>
    </DefaultContainer>
  );
}
