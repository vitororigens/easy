import { IRevenue } from '../screens/Home';

/**
 * Função para debug das transações e suas datas
 */
export const debugTransactions = (transactions: IRevenue[]) => {
  console.log('🔍 DEBUG: Analisando transações...');
  console.log('📊 Total de transações:', transactions.length);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  console.log('📅 Mês atual:', currentMonth, 'Ano:', currentYear);
  
  transactions.forEach((transaction, index) => {
    console.log(`📋 Transação ${index + 1}:`);
    console.log(`   Nome: ${transaction.name}`);
    console.log(`   Tipo: ${transaction.type}`);
    console.log(`   Data original: ${transaction.date}`);
    console.log(`   Valor: ${transaction.valueTransaction}`);
    
    // Tentar parsear a data
    try {
      if (transaction.date && transaction.date.includes('/')) {
        const parts = transaction.date.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          
          console.log(`   Data parseada: ${day}/${month}/${year}`);
          console.log(`   É mês atual: ${month === currentMonth && year === currentYear}`);
        }
      }
    } catch (error) {
      console.log(`   Erro ao parsear data: ${error}`);
    }
    
    console.log('---');
  });
  
  // Contar por tipo
  const inputs = transactions.filter(t => t.type === 'input');
  const outputs = transactions.filter(t => t.type === 'output');
  
  console.log('📈 Resumo:');
  console.log(`   Receitas: ${inputs.length}`);
  console.log(`   Despesas: ${outputs.length}`);
  
  // Mostrar valores totais
  const totalInput = inputs.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);
  const totalOutput = outputs.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);
  
  console.log(`   Total receitas: R$ ${totalInput.toFixed(2)}`);
  console.log(`   Total despesas: R$ ${totalOutput.toFixed(2)}`);
  console.log(`   Saldo: R$ ${(totalInput - totalOutput).toFixed(2)}`);
}; 