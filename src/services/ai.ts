import { IRevenue } from '../screens/Home';
import { ENV_CONFIG, validateConfig } from '../config/env';

// Tipos para as respostas da IA
export interface AIAnalysis {
  category: string;
  confidence: number;
  description?: string;
}

export interface FinancialInsight {
  type: 'spending_analysis' | 'savings_tip' | 'budget_recommendation' | 'trend_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
  action?: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  insights: FinancialInsight[];
}

// Função para limpar e extrair JSON da resposta da IA
function extractJSONFromResponse(response: string): string {
  try {
    // Tenta encontrar JSON válido na resposta
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    // Se não encontrar, tenta limpar a resposta
    let cleaned = response.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Remove caracteres especiais no início e fim
    cleaned = cleaned.replace(/^[^\{\[]*/, '').replace(/[^\}\]]*$/, '');
    
    return cleaned;
  } catch (error) {
    console.error('Error extracting JSON:', error);
    return response;
  }
}

// Função para fazer parsing seguro de JSON
function safeJSONParse(jsonString: string, fallback: any): any {
  try {
    // Primeiro tenta fazer o parsing direto
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse failed, trying to clean response:', error);
    
    try {
      // Tenta limpar e fazer parsing novamente
      const cleaned = extractJSONFromResponse(jsonString);
      return JSON.parse(cleaned);
    } catch (secondError) {
      console.error('JSON parse failed after cleaning:', secondError);
      console.log('Original response:', jsonString);
      return fallback;
    }
  }
}

// Função base para chamadas à API
async function callOpenRouterAPI(prompt: string): Promise<string> {
  // Validar configuração antes de fazer a chamada
  if (!validateConfig()) {
    throw new Error('Configuração da API não válida. Configure sua chave da API.');
  }

  try {
    console.log('🤖 Enviando prompt para IA:', prompt.substring(0, 100) + '...');
    
    const response = await fetch(ENV_CONFIG.OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV_CONFIG.OPENROUTER_API_KEY}`,
        'HTTP-Referer': ENV_CONFIG.APP_URL,
        'X-Title': ENV_CONFIG.APP_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ENV_CONFIG.AI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: ENV_CONFIG.MAX_TOKENS,
        temperature: ENV_CONFIG.TEMPERATURE
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    console.log('✅ AI Response:', content);
    
    // Verificar se a resposta está vazia
    if (!content || content.trim() === '') {
      console.warn('⚠️ Resposta vazia da IA');
      throw new Error('Resposta vazia da API');
    }
    
    return content;
  } catch (error) {
    console.error('❌ Error calling OpenRouter API:', error);
    throw error;
  }
}

// 1. Classificação automática de transações
export async function classifyTransaction(description: string, amount: number): Promise<AIAnalysis> {
  const prompt = `
Você é um classificador de transações financeiras. Classifique a transação em uma categoria apropriada.

IMPORTANTE: Responda APENAS com um JSON válido, sem texto adicional.

Transação: ${description}
Valor: R$ ${amount.toFixed(2)}

Categorias disponíveis:
- Alimentação (restaurantes, mercado, delivery, ifood, uber eats)
- Transporte (uber, 99, combustível, transporte público, gasolina)
- Moradia (aluguel, contas, luz, água, internet, condomínio)
- Saúde (médico, farmácia, plano de saúde, consulta)
- Educação (cursos, livros, material escolar, faculdade)
- Lazer (cinema, shows, viagens, entretenimento)
- Vestuário (roupas, calçados, acessórios, shopping)
- Tecnologia (eletrônicos, apps, serviços, celular)
- Serviços (assinaturas, serviços online, streaming)
- Outros (não classificado)

Responda apenas com o JSON:
{"category":"categoria","confidence":0.95,"description":"descrição"}
`;

  try {
    const response = await callOpenRouterAPI(prompt);
    const analysis = safeJSONParse(response, {
      category: 'Outros',
      confidence: 0.5,
      description: 'Não foi possível classificar automaticamente',
    });
    return analysis;
  } catch (error) {
    console.error('Error classifying transaction:', error);
    return {
      category: 'Outros',
      confidence: 0.5,
      description: 'Não foi possível classificar automaticamente',
    };
  }
}

// Função para converter data DD/MM/YYYY para Date
function parseDate(dateString: string | undefined): Date {
  if (!dateString) {
    return new Date(); // Fallback para data atual
  }
  
  try {
    // Se a data está no formato DD/MM/YYYY
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mês começa em 0
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    
    // Se não conseguir parsear, tenta como string ISO
    return new Date(dateString);
  } catch (error) {
    console.warn('Error parsing date:', dateString, error);
    return new Date(); // Fallback para data atual
  }
}

// 2. Geração de insights financeiros
export async function generateFinancialInsights(transactions: IRevenue[]): Promise<FinancialInsight[]> {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  console.log('🔍 Analisando transações:', transactions.length);
  console.log('📅 Mês atual:', currentMonth, 'Ano:', currentYear);
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = parseDate(t.date);
    const isCurrentMonth = transactionDate.getMonth() + 1 === currentMonth && 
                          transactionDate.getFullYear() === currentYear;
    
    console.log(`📊 Transação: ${t.name} - Data: ${t.date} - Mês atual: ${isCurrentMonth}`);
    return isCurrentMonth;
  });
  
  console.log('✅ Transações do mês atual:', monthlyTransactions.length);

  const expenses = monthlyTransactions.filter(t => t.type === 'output');
  const incomes = monthlyTransactions.filter(t => t.type === 'input');

  const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);
  const totalIncome = incomes.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);

  const prompt = `
Você é um assistente financeiro especializado em análise de dados pessoais.

ANÁLISE ESTES DADOS E GERE INSIGHTS ÚTEIS:

Dados financeiros do mês atual:
- Total de receitas: R$ ${totalIncome.toFixed(2)}
- Total de despesas: R$ ${totalExpenses.toFixed(2)}
- Saldo: R$ ${(totalIncome - totalExpenses).toFixed(2)}
- Número de transações: ${monthlyTransactions.length}

Categorias de despesas:
${expenses.map(e => `- ${e.name}: R$ ${e.valueTransaction}`).join('\n')}

REGRAS IMPORTANTES:
1. Responda APENAS com um JSON válido
2. Não adicione texto, markdown ou explicações
3. Gere exatamente 2-3 insights úteis
4. Use apenas os tipos: "spending_analysis", "savings_tip", "budget_recommendation", "trend_alert"
5. Use apenas as prioridades: "low", "medium", "high"

FORMATO OBRIGATÓRIO:
[{"type":"tipo","title":"título","message":"mensagem","priority":"prioridade","actionable":true/false,"action":"ação opcional"}]

EXEMPLO:
[{"type":"spending_analysis","title":"Gastos com Alimentação","message":"Você gastou R$ 450 com alimentação este mês","priority":"medium","actionable":true,"action":"Considere cozinhar mais em casa"}]

RESPONDA APENAS COM O JSON:
`;

  try {
    const response = await callOpenRouterAPI(prompt);
    const insights = safeJSONParse(response, []);
    return Array.isArray(insights) ? insights : [];
  } catch (error) {
    console.error('Error generating insights:', error);
    
    // Gerar insights padrão baseados nos dados quando a API falhar
    const fallbackInsights: FinancialInsight[] = [];
    
    // Insight sobre saldo
    if (totalIncome > 0 && totalExpenses > 0) {
      const balance = totalIncome - totalExpenses;
      const balancePercentage = (balance / totalIncome) * 100;
      
      if (balance > 0) {
        fallbackInsights.push({
          type: 'savings_tip',
          title: 'Saldo Positivo',
          message: `Você economizou R$ ${balance.toFixed(2)} este mês (${balancePercentage.toFixed(1)}% da sua renda). Continue assim!`,
          priority: 'low',
          actionable: true,
          action: 'Considere investir parte dessa economia para multiplicar seus ganhos.',
        });
      } else {
        fallbackInsights.push({
          type: 'trend_alert',
          title: 'Saldo Negativo',
          message: `Você gastou R$ ${Math.abs(balance).toFixed(2)} a mais do que recebeu. Atenção aos gastos!`,
          priority: 'high',
          actionable: true,
          action: 'Revise suas despesas e identifique onde pode economizar.',
        });
      }
    }
    
    // Insight sobre gastos
    if (expenses.length > 0) {
      const avgExpense = totalExpenses / expenses.length;
      fallbackInsights.push({
        type: 'spending_analysis',
        title: 'Análise de Gastos',
        message: `Você teve ${expenses.length} despesas este mês, com valor médio de R$ ${avgExpense.toFixed(2)}.`,
        priority: 'medium',
        actionable: true,
        action: 'Analise se todos esses gastos são realmente necessários.',
      });
    }
    
    // Insight sobre receitas
    if (incomes.length > 0) {
      fallbackInsights.push({
        type: 'budget_recommendation',
        title: 'Gestão de Receitas',
        message: `Você recebeu R$ ${totalIncome.toFixed(2)} este mês. Planeje bem o uso desse dinheiro.`,
        priority: 'medium',
        actionable: true,
        action: 'Separe 50% para necessidades, 30% para desejos e 20% para investimentos.',
      });
    }
    
    console.log('🔄 Usando insights padrão devido a erro na API:', fallbackInsights);
    return fallbackInsights;
  }
}

// 3. Resumo mensal inteligente
export async function generateMonthlySummary(transactions: IRevenue[]): Promise<MonthlySummary> {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = parseDate(t.date);
    return transactionDate.getMonth() + 1 === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const expenses = monthlyTransactions.filter(t => t.type === 'output');
  const incomes = monthlyTransactions.filter(t => t.type === 'input');

  const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);
  const totalIncome = incomes.reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0);
  const savings = totalIncome - totalExpenses;

  // Agrupar despesas por categoria
  const categoryMap = new Map<string, number>();
  expenses.forEach(expense => {
    const current = categoryMap.get(expense.name) || 0;
    categoryMap.set(expense.name, current + parseFloat(expense.valueTransaction || '0'));
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const insights = await generateFinancialInsights(transactions);

  return {
    totalIncome,
    totalExpenses,
    savings,
    topCategories,
    insights
  };
}

// 4. Previsão de saldo futuro
export async function predictFutureBalance(transactions: IRevenue[], monthsAhead: number = 3): Promise<number> {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  // Calcular média de receitas e despesas dos últimos 3 meses
  const recentTransactions = transactions.filter(t => {
    const transactionDate = parseDate(t.date);
    const monthsDiff = (currentYear - transactionDate.getFullYear()) * 12 + 
                      (currentMonth - transactionDate.getMonth() - 1);
    return monthsDiff >= 0 && monthsDiff < 3;
  });

  const monthlyExpenses = recentTransactions
    .filter(t => t.type === 'output')
    .reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0) / 3;

  const monthlyIncome = recentTransactions
    .filter(t => t.type === 'input')
    .reduce((sum, t) => sum + parseFloat(t.valueTransaction || '0'), 0) / 3;

  const currentBalance = recentTransactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const monthsDiff = (currentYear - transactionDate.getFullYear()) * 12 + 
                        (currentMonth - transactionDate.getMonth() - 1);
      return monthsDiff === 0;
    })
    .reduce((sum, t) => {
      const value = parseFloat(t.valueTransaction || '0');
      return sum + (t.type === 'input' ? value : -value);
    }, 0);

  // Previsão simples baseada na média
  const predictedBalance = currentBalance + (monthlyIncome - monthlyExpenses) * monthsAhead;
  
  return Math.max(0, predictedBalance); // Não pode ser negativo
}

// 5. Processamento de entrada natural de texto
export async function parseNaturalInput(text: string): Promise<{
  type: 'input' | 'output';
  amount: number;
  category: string;
  description: string;
  date: string;
}> {
  const prompt = `
Você é um processador de entrada natural para transações financeiras. Extraia informações do texto.

IMPORTANTE: Responda APENAS com um JSON válido, sem texto adicional.

Texto: "${text}"

Extraia:
- type: "input" (receita) ou "output" (despesa)
- amount: valor numérico
- category: categoria apropriada
- description: descrição da transação
- date: data no formato YYYY-MM-DD (use data atual se não especificada)

Exemplos:
- "gastei 50 reais no mercado hoje" → {"type":"output","amount":50.00,"category":"Alimentação","description":"Mercado","date":"2024-01-15"}
- "recebi salário de 3000 reais" → {"type":"input","amount":3000.00,"category":"Salário","description":"Salário","date":"2024-01-15"}

Responda apenas com o JSON:
`;

  try {
    const response = await callOpenRouterAPI(prompt);
    const parsed = safeJSONParse(response, {
      type: 'output',
      amount: 0,
      category: 'Outros',
      description: text,
      date: new Date().toISOString().split('T')[0],
    });
    
    // Validar e corrigir dados
    return {
      type: parsed.type === 'input' ? 'input' : 'output',
      amount: Math.abs(parseFloat(parsed.amount) || 0),
      category: parsed.category || 'Outros',
      description: parsed.description || text,
      date: parsed.date || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error parsing natural input:', error);
    throw new Error('Não foi possível processar a entrada. Tente novamente.');
  }
} 