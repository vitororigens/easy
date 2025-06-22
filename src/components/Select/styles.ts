import styled from "styled-components/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { DefaultTheme } from "styled-components/native";

interface ThemeProps {
  theme: DefaultTheme;
}

interface SelectWrapperProps {
  error?: boolean;
  disabled?: boolean;
}

export const Container = styled(TouchableOpacity)`
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

export const SelectWrapper = styled.View<SelectWrapperProps>`
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  width: 100%;
  padding: 0 12px;
  background-color: ${({theme, disabled}: ThemeProps & { disabled?: boolean }) => 
    disabled ? theme.COLORS.GRAY_300 : theme.COLORS.WHITE};
  border-width: 1px;
  border-color: ${({theme, error}: ThemeProps & { error?: boolean }) => 
    error ? theme.COLORS.RED_500 : 'transparent'};
  border-radius: 8px;
  opacity: ${({disabled}: { disabled?: boolean }) => disabled ? 0.6 : 1};
`;

export const IconInput = styled(FontAwesome5).attrs(({theme}: ThemeProps) => ({
    color: theme.COLORS.GRAY_400,
    size: 16
}))`
  margin-right: 12px;
  flex: 0;
`;

export const ChevronIcon = styled(FontAwesome5)`
  margin-left: 12px;
  flex: 0;
`;

export const ErrorText = styled.Text`
  color: ${({theme}: ThemeProps) => theme.COLORS.RED_500};
  font-family: ${({theme}: ThemeProps) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}: ThemeProps) => theme.FONT_SIZE.SM}px;
  margin-top: -8px;
  margin-bottom: 8px;
  margin-left: 12px;
  width: 100%;
`; 