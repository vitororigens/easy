import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONT_SIZE.XL}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 24px;
`;

export const Form = styled.View`
  flex: 1;
`;

export const InputContainer = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 8px;
`;

export const SelectContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const SelectButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({theme, active}) => active ? theme.COLORS.PURPLE_600 : theme.COLORS.GRAY_300};
  align-items: center;
`;

export const SelectText = styled.Text<{ active?: boolean }>`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  color: ${({theme, active}) => active ? theme.COLORS.WHITE : theme.COLORS.GRAY_600};
`; 