import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 18px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-bottom: 16px;
`;

export const Description = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-bottom: 16px;
`;

export const DateTimeContainer = styled.View`
  margin-bottom: 16px;
`;

export const DateTimeLabel = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 14px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-bottom: 8px;
`;

export const DateTimeValue = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const DateTimePickerButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};
  border-radius: 8px;
  padding: 12px;
`;

export const NotificationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 16px;
`;

export const NotificationLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`; 