import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';
import type { PickerProps } from '@react-native-picker/picker';

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
  background-color: ${({theme}: ThemeProps) => theme.COLORS.GRAY_300};
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
    disabled ? theme.COLORS.GRAY_300 : theme.COLORS.GRAY_300};
  border-width: 1px;
  border-color: ${({theme, error}: ThemeProps & { error?: boolean }) =>
    error ? theme.COLORS.RED_700 : 'transparent'};
  border-radius: 8px;
  opacity: ${({disabled}: { disabled?: boolean }) => disabled ? 0.6 : 1};
`;

export const IconInput = styled(FontAwesome5).attrs(({theme}: ThemeProps) => ({
  color: theme.COLORS.GRAY_400,
  size: 16,
}))`
  margin-right: 12px;
  flex: 0;
`;

export const ChevronIcon = styled(FontAwesome5)`
  margin-left: 12px;
  flex: 0;
`;

export const ErrorText = styled.Text`
  color: ${({theme}: ThemeProps) => theme.COLORS.RED_700};
  font-family: ${({theme}: ThemeProps) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}: ThemeProps) => theme.FONT_SIZE.SM}px;
  margin-top: -8px;
  margin-bottom: 8px;
  margin-left: 12px;
  width: 100%;
`;

// Novos componentes styled para Select customizado
export const Option = styled.TouchableOpacity<{isSelected?: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({theme, isSelected}) => isSelected ? theme.COLORS.PURPLE_600 : theme.COLORS.GRAY_200};
  background-color: ${({theme, isSelected}) => isSelected ? theme.COLORS.GRAY_200 : theme.COLORS.WHITE};
  margin-bottom: 8px;
`;

export const OptionLabel = styled.Text<{isSelected?: boolean}>`
  font-size: 16px;
  color: ${({theme, isSelected}) => isSelected ? theme.COLORS.PURPLE_600 : theme.COLORS.GRAY_600};
  font-weight: ${({isSelected}) => isSelected ? '600' : '400'};
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${({theme}: ThemeProps) => theme.COLORS.WHITE};
  border-radius: 12px;
  padding: 20px;
  width: 85%;
  max-height: 70%;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: ${({theme}: ThemeProps) => theme.COLORS.GRAY_600};
`;

export const CancelButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({theme}: ThemeProps) => theme.COLORS.GRAY_200};
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  color: ${({theme}: ThemeProps) => theme.COLORS.GRAY_400};
  font-size: 16px;
  font-weight: 500;
`;

export const Label = styled.Text<{selected?: boolean}>`
  flex: 1;
  font-family: ${({theme}: ThemeProps) => theme.FONT_FAMILY.REGULAR};
  font-size: 16px;
  color: ${({theme, selected}) => selected ? theme.COLORS.GRAY_600 : theme.COLORS.GRAY_400};
  padding-left: 0px;
  padding-right: 0px;
`;

export const PickerStyled = styled(Picker)<PickerProps<unknown>>`
  flex: 1;
  background-color: transparent;
`;
