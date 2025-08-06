import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Toast } from 'react-native-toast-notifications';
import { 
  Container, 
  InputContainer, 
  Input, 
  SendButton, 
  SendButtonText, 
  LoadingContainer,
  LoadingText,
  SuggestionContainer,
  SuggestionText,
  SuggestionsTitle
} from './styles';
import { parseNaturalInput } from '../../services/ai';

interface NaturalInputProps {
  onTransactionParsed: (transaction: {
    type: 'input' | 'output';
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
  visible?: boolean;
}

const SUGGESTIONS = [
  'Gastei 50 reais no mercado hoje',
  'Recebi salário de 3000 reais',
  'Paguei 120 de conta de luz',
  'Comprei roupas por 200 reais',
  'Recebi bônus de 500 reais'
];

export function NaturalInput({ onTransactionParsed, visible = true }: NaturalInputProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) {
      Toast.show('Digite algo para processar', {
        type: 'warning',
        placement: 'top',
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const parsedTransaction = await parseNaturalInput(text.trim());
      
      Alert.alert(
        'Transação Detectada',
        `Tipo: ${parsedTransaction.type === 'input' ? 'Receita' : 'Despesa'}
Valor: R$ ${parsedTransaction.amount.toFixed(2)}
Categoria: ${parsedTransaction.category}
Descrição: ${parsedTransaction.description}
Data: ${parsedTransaction.date}

Deseja adicionar esta transação?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Adicionar', 
            onPress: () => {
              onTransactionParsed(parsedTransaction);
              setText('');
              Toast.show('Transação adicionada!', {
                type: 'success',
                placement: 'top',
                duration: 2000,
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error parsing input:', error);
      Toast.show('Erro ao processar entrada. Tente novamente.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setText(suggestion);
  };

  if (!visible) return null;

  return (
    <Container>
      <InputContainer>
        <Input
          placeholder="Digite naturalmente: 'gastei 50 no mercado'"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={200}
          editable={!loading}
        />
        <SendButton onPress={handleSend} disabled={loading}>
          <SendButtonText>
            {loading ? '...' : 'Enviar'}
          </SendButtonText>
        </SendButton>
      </InputContainer>

      {loading && (
        <LoadingContainer>
          <LoadingText>Processando com IA...</LoadingText>
        </LoadingContainer>
      )}

      {!loading && text.length === 0 && (
        <SuggestionContainer>
          <SuggestionsTitle>💡 Sugestões:</SuggestionsTitle>
          {SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSuggestionPress(suggestion)}
              activeOpacity={0.7}
            >
              <SuggestionText>{suggestion}</SuggestionText>
            </TouchableOpacity>
          ))}
        </SuggestionContainer>
      )}
    </Container>
  );
} 