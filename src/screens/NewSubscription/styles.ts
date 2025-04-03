import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-bottom: 20px;
`;

export const Form = styled.View`
  flex: 1;
`;

export const InputContainer = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-bottom: 8px;
`;

export const SelectContainer = styled.View`
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  border-radius: 10px;
  overflow: hidden;
`;

export const SelectButton = styled(TouchableOpacity)`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_700};
`;

export const SelectText = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
`; 