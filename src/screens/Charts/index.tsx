import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar } from "./styles";
import { useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection, { ExpenseData } from './../../hooks/useFirestoreCollection';
import { useTheme } from "styled-components/native";

const screenWidth = Dimensions.get("window").width;

export function Charts() {
  const [activeButton, setActiveButton] = useState("Entrar");
  const {COLORS} = useTheme();
  const user = useUserAuth();
  const uid = user?.uid;
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');

  const monthNames: string[] = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const getMonthName = (month: number): string => {
    return monthNames[month - 1];
  };

  const getTotalByMonth = (data: ExpenseData[], month: number): number => {
    const filteredData = data.filter(item => item.month === month);
    return filteredData.reduce((acc, curr) => acc + parseFloat(curr.valueTransaction), 0);
  };

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const generateChartData = (data: ExpenseData[]): any => {
    const uniqueMonths = Array.from(new Set(data.map(item => item.month)));

    // Ordene os meses em ordem crescente
    const sortedMonths = uniqueMonths.sort((a, b) => a - b);

    const labels = sortedMonths.map(month => getMonthName(month));

    const totalByMonth = sortedMonths.map(month => getTotalByMonth(data, month));

    return {
      labels: labels,
      datasets: [
        {
          data: totalByMonth,
          color:  activeButton === "receitas" ? (opacity = 1) => COLORS.TEAL_600 : (opacity = 1) => COLORS.PURPLE_600, 
          strokeWidth: 2 
        }
      ],
      legend: ["Total por mês"] 
    };
  };

  const revenueData = generateChartData(revenue);
  const expenseData = generateChartData(expense);

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: activeButton === "receitas" ? (opacity = 1) => COLORS.TEAL_600 : (opacity = 1) => COLORS.PURPLE_600,
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
          {activeButton === "receitas" &&
             <LineChart
             data={revenueData}
             width={screenWidth}
             height={220}
             chartConfig={chartConfig}
           />
          }
          {activeButton === "despesas" && 
             <LineChart
             data={expenseData}
             width={screenWidth}
             height={220}
             chartConfig={chartConfig}
           />
          }
       
        </Content>
      </Container>
    </DefaultContainer>
  );
}