import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from 'styled-components/native';
import { Container } from '../../components/Container';
import { DefaultContainer } from '../../components/DefaultContainer';
import { LoadData } from '../../components/LoadData';
import { Loading } from '../../components/Loading';
import { useUserAuth } from '../../hooks/useUserAuth';
import useFirestoreCollection, { ExpenseData } from './../../hooks/useFirestoreCollection';
import { Button, Content, Divider, Header, NavBar, Title } from './styles';

const screenWidth = Dimensions.get('screen').width;

export function Charts() {
  const [activeButton, setActiveButton] = useState('receitas');
  const [revenueData, setRevenueData] = useState<ExpenseData[] | never[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[] | never[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { COLORS } = useTheme();
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');
  const user = useUserAuth()
  const uid = user?.uid;

  const monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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
    const sortedMonths = uniqueMonths.sort((a, b) => a - b);
    const labels = sortedMonths.map(month => getMonthName(month));
    const totalByMonth = sortedMonths.map(month => getTotalByMonth(data, month));

    return {
      labels: labels,
      datasets: [
        {
          data: totalByMonth,
          color: activeButton === "receitas" ? (opacity = 1) => COLORS.TEAL_600 : (opacity = 1) => COLORS.PURPLE_600,
          strokeWidth: 2
        }
      ],
      legend: ['Total por mês']
    };
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (uid === undefined) {
      return;
    }

    timer = setTimeout(() => {
      if (revenue && revenue.length > 0) {
        setRevenueData(revenue.filter(item => item.uid === uid));
      }
      if (expense && expense.length > 0) {
        setExpenseData(expense.filter(item => item.uid === uid));
      }
      setIsLoading(false); 
    }, 1000);


    return () => clearTimeout(timer);
  }, [revenue, expense, uid]);

  if (isLoading || uid === undefined) {
    return <Loading />;
  }
  
  const chartData = activeButton === 'receitas' ? generateChartData(revenueData) : generateChartData(expenseData);

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#FFFFFF',
    backgroundGradientToOpacity: 0.5,
    color: activeButton === "receitas" ? (opacity = 1) => COLORS.TEAL_600 : (opacity = 1) => COLORS.PURPLE_600,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const chartWidth = Math.max(screenWidth, chartData.labels.length * 60);

  return (
    <DefaultContainer backButton>
      <Container type="SECONDARY" title="ANÁLISE GRÁFICA">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === 'receitas' ? 'flex-start' : 'flex-end' }} />
            <NavBar>
              <Button onPress={() => handleButtonClick('receitas')}>
                <Title>Receitas</Title>
              </Button>
              <Button onPress={() => handleButtonClick('despesas')}>
                <Title>Despesas</Title>
              </Button>
            </NavBar>
          </Header>
          {(revenueData.length > 0 && activeButton === 'receitas') || (expenseData.length > 0 && activeButton === 'despesas') ? (
            <ScrollView horizontal>
              <LineChart
                data={chartData}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </ScrollView>
          ) : (
            <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui!' />
          )}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
