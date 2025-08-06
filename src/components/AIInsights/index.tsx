import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Toast } from 'react-native-toast-notifications';
import { 
  Container, 
  Title, 
  InsightCard, 
  InsightTitle, 
  InsightMessage, 
  InsightPriority, 
  LoadingContainer,
  RefreshButton,
  RefreshText,
  EmptyContainer,
  EmptyText,
  ActionButton,
  ActionButtonText
} from './styles';
import { generateFinancialInsights, FinancialInsight } from '../../services/ai';
import { IRevenue } from '../../screens/Home';
import { formatCurrency } from '../../utils/formatCurrency';
import { debugTransactions } from '../../utils/debug-transactions';
import { testOpenRouterConnection } from '../../utils/ai-test-simple';

interface AIInsightsProps {
  transactions: IRevenue[];
  visible?: boolean;
}

export function AIInsights({ transactions, visible = true }: AIInsightsProps) {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchInsights = async () => {
    if (transactions.length === 0) {
      setInsights([]);
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Gerando insights para', transactions.length, 'transações...');
      
      // Debug das transações
      debugTransactions(transactions);
      
      const newInsights = await generateFinancialInsights(transactions);
      console.log('✅ Insights gerados:', newInsights);
      
      setInsights(newInsights);
      setLastUpdate(new Date());
      
      if (newInsights.length > 0) {
        Toast.show(`Gerados ${newInsights.length} insights!`, {
          type: 'success',
          placement: 'top',
          duration: 2000,
        });
      } else {
        Toast.show('Nenhum insight disponível no momento', {
          type: 'info',
          placement: 'top',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      Toast.show('Erro ao carregar insights. Verifique sua conexão.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions, visible]);

  const handleInsightAction = (insight: FinancialInsight) => {
    if (insight.actionable && insight.action) {
      Alert.alert(
        insight.title,
        insight.action,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Aplicar', onPress: () => {
            Toast.show('Ação aplicada!', {
              type: 'success',
              placement: 'top',
              duration: 2000,
            });
          }}
        ]
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFA726';
      case 'low':
        return '#66BB6A';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  if (!visible) return null;

  return (
    <Container>
      <Title>💡 Insights Inteligentes</Title>
      
      {loading ? (
        <LoadingContainer>
          <RefreshText>Analisando seus dados...</RefreshText>
        </LoadingContainer>
      ) : insights.length > 0 ? (
        <>
          {insights.map((insight, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleInsightAction(insight)}
              activeOpacity={0.7}
            >
              <InsightCard>
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightMessage>{insight.message}</InsightMessage>
                <InsightPriority color={getPriorityColor(insight.priority)}>
                  Prioridade: {getPriorityText(insight.priority)}
                </InsightPriority>
                {insight.actionable && (
                  <ActionButton>
                    <ActionButtonText>Ver ação sugerida</ActionButtonText>
                  </ActionButton>
                )}
              </InsightCard>
            </TouchableOpacity>
          ))}
          
          <RefreshButton onPress={fetchInsights}>
            <RefreshText>
              {lastUpdate 
                ? `Atualizado em ${lastUpdate.toLocaleTimeString()}`
                : 'Atualizar insights'
              }
            </RefreshText>
          </RefreshButton>
          
          <TouchableOpacity 
            onPress={async () => {
              console.log('🧪 Testando conexão com API...');
              const result = await testOpenRouterConnection();
              if (result) {
                Toast.show('✅ Conexão com API OK!', {
                  type: 'success',
                  placement: 'top',
                  duration: 2000,
                });
              } else {
                Toast.show('❌ Erro na conexão com API', {
                  type: 'danger',
                  placement: 'top',
                  duration: 3000,
                });
              }
            }}
            style={{ 
              backgroundColor: '#e74c3c', 
              padding: 8, 
              borderRadius: 4, 
              marginTop: 8,
              alignItems: 'center'
            }}
          >
            <RefreshText style={{ fontSize: 12 }}>Testar API</RefreshText>
          </TouchableOpacity>
        </>
      ) : (
        <EmptyContainer>
          <EmptyText>
            {transactions.length === 0 
              ? 'Adicione transações para receber insights personalizados'
              : 'Nenhum insight disponível no momento'
            }
          </EmptyText>
          {transactions.length > 0 && (
            <RefreshButton onPress={fetchInsights}>
              <RefreshText>Tentar novamente</RefreshText>
            </RefreshButton>
          )}
        </EmptyContainer>
      )}
    </Container>
  );
} 