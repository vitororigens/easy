/**
 * Exemplos de uso das funcionalidades de IA
 * Este arquivo pode ser usado para testar as funcionalidades implementadas
 */

import {
  classifyTransaction,
  generateFinancialInsights,
  generateMonthlySummary,
  predictFutureBalance,
  parseNaturalInput,
} from '../services/ai';
import { IRevenue } from '../screens/Home';

// Dados de exemplo para testes
const mockTransactions: IRevenue[] = [
  {
    id: '1',
    status: true,
    createdAt: new Date() as any,
    name: 'Salário',
    author: 'Empresa',
    type: 'input',
    date: '15/01/2024',
    month: 1,
    repeat: true,
    description: 'Salário mensal',
    shareWith: [],
    shareInfo: [],
    valueTransaction: '3000',
    uid: 'user123',
  },
  {
    id: '2',
    status: true,
    createdAt: new Date() as any,
    name: 'Mercado',
    author: 'Supermercado',
    type: 'output',
    date: '16/01/2024',
    month: 1,
    repeat: false,
    description: 'Compras do mês',
    shareWith: [],
    shareInfo: [],
    valueTransaction: '450',
    uid: 'user123',
  },
  {
    id: '3',
    status: true,
    createdAt: new Date() as any,
    name: 'Uber',
    author: 'Uber',
    type: 'output',
    date: '17/01/2024',
    month: 1,
    repeat: false,
    description: 'Transporte',
    shareWith: [],
    shareInfo: [],
    valueTransaction: '25',
    uid: 'user123',
  },
];

/**
 * Teste de classificação de transações
 */
export const testTransactionClassification = async () => {
  console.log('🧪 Testando classificação de transações...');
  
  const testCases = [
    { description: 'paguei 75 reais no ifood ontem', amount: 75 },
    { description: 'gastei 120 na farmácia', amount: 120 },
    { description: 'comprei roupas por 200 reais', amount: 200 },
    { description: 'paguei conta de luz 150 reais', amount: 150 },
  ];

  for (const testCase of testCases) {
    try {
      const result = await classifyTransaction(testCase.description, testCase.amount);
      console.log(`✅ "${testCase.description}" → ${result.category} (${(result.confidence * 100).toFixed(1)}%)`);
    } catch (error) {
      console.error(`❌ Erro ao classificar "${testCase.description}":`, error);
    }
  }
};

/**
 * Teste de geração de insights
 */
export const testFinancialInsights = async () => {
  console.log('🧪 Testando geração de insights...');
  
  try {
    const insights = await generateFinancialInsights(mockTransactions);
    console.log(`✅ Gerados ${insights.length} insights:`);
    
    insights.forEach((insight, index) => {
      console.log(`  ${index + 1}. ${insight.title}: ${insight.message}`);
    });
  } catch (error) {
    console.error('❌ Erro ao gerar insights:', error);
  }
};

/**
 * Teste de resumo mensal
 */
export const testMonthlySummary = async () => {
  console.log('🧪 Testando resumo mensal...');
  
  try {
    const summary = await generateMonthlySummary(mockTransactions);
    console.log('✅ Resumo mensal gerado:');
    console.log(`  Receitas: R$ ${summary.totalIncome.toFixed(2)}`);
    console.log(`  Despesas: R$ ${summary.totalExpenses.toFixed(2)}`);
    console.log(`  Economia: R$ ${summary.savings.toFixed(2)}`);
    console.log(`  Top categorias: ${summary.topCategories.length}`);
  } catch (error) {
    console.error('❌ Erro ao gerar resumo mensal:', error);
  }
};

/**
 * Teste de previsão de saldo
 */
export const testFutureBalancePrediction = async () => {
  console.log('🧪 Testando previsão de saldo...');
  
  try {
    const predictedBalance = await predictFutureBalance(mockTransactions, 3);
    console.log(`✅ Saldo previsto para 3 meses: R$ ${predictedBalance.toFixed(2)}`);
  } catch (error) {
    console.error('❌ Erro ao prever saldo:', error);
  }
};

/**
 * Teste de entrada natural
 */
export const testNaturalInput = async () => {
  console.log('🧪 Testando entrada natural...');
  
  const testInputs = [
    'gastei 50 reais no mercado hoje',
    'recebi salário de 3000 reais',
    'paguei 120 de conta de luz',
    'comprei roupas por 200 reais',
    'recebi bônus de 500 reais',
  ];

  for (const input of testInputs) {
    try {
      const result = await parseNaturalInput(input);
      console.log(`✅ "${input}" → ${result.type} R$ ${result.amount} (${result.category})`);
    } catch (error) {
      console.error(`❌ Erro ao processar "${input}":`, error);
    }
  }
};

/**
 * Executa todos os testes
 */
export const runAllTests = async () => {
  console.log('🚀 Iniciando testes das funcionalidades de IA...\n');
  
  await testTransactionClassification();
  console.log('');
  
  await testFinancialInsights();
  console.log('');
  
  await testMonthlySummary();
  console.log('');
  
  await testFutureBalancePrediction();
  console.log('');
  
  await testNaturalInput();
  console.log('');
  
  console.log('✅ Todos os testes concluídos!');
};

// Para executar os testes, descomente a linha abaixo:
// runAllTests(); 