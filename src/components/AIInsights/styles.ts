import styled from 'styled-components/native';

export const Container = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 16px;
  text-align: center;
`;

export const InsightCard = styled.View`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid #3498db;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const InsightTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
`;

export const InsightMessage = styled.Text`
  font-size: 14px;
  color: #5a6c7d;
  line-height: 20px;
  margin-bottom: 8px;
`;

export const InsightPriority = styled.Text<{ color: string }>`
  font-size: 12px;
  color: ${props => props.color};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const LoadingContainer = styled.View`
  align-items: center;
  padding: 20px;
`;

export const RefreshButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 12px 24px;
  border-radius: 6px;
  align-items: center;
  margin-top: 8px;
`;

export const RefreshText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const EmptyContainer = styled.View`
  align-items: center;
  padding: 20px;
`;

export const EmptyText = styled.Text`
  color: #7f8c8d;
  font-size: 14px;
  text-align: center;
  line-height: 20px;
`;

export const ActionButton = styled.View`
  background-color: #e8f4fd;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #3498db;
  align-self: flex-start;
`;

export const ActionButtonText = styled.Text`
  color: #3498db;
  font-size: 12px;
  font-weight: 600;
`; 