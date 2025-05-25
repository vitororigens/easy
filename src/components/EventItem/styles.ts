import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Content = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const Time = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Icon = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 16px;
`;

export const ShareIcon = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 8px;
`; 