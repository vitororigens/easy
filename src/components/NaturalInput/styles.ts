import styled from 'styled-components/native';

export const Container = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 12px;
`;

export const Input = styled.TextInput`
  flex: 1;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #2c3e50;
  min-height: 44px;
  max-height: 100px;
  margin-right: 8px;
`;

export const SendButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#bdc3c7' : '#3498db'};
  padding: 12px 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

export const SendButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const LoadingContainer = styled.View`
  align-items: center;
  padding: 12px;
  background-color: #e8f4fd;
  border-radius: 8px;
  border: 1px solid #3498db;
`;

export const LoadingText = styled.Text`
  color: #3498db;
  font-size: 14px;
  font-weight: 500;
`;

export const SuggestionContainer = styled.View`
  margin-top: 8px;
`;

export const SuggestionsTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

export const SuggestionText = styled.Text`
  color: #3498db;
  font-size: 13px;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: #ecf0f1;
`; 