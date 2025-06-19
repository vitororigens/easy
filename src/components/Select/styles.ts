import styled from "styled-components/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

export const Container = styled(TouchableOpacity)`
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

export const SelectWrapper = styled.View<{ error?: boolean; disabled?: boolean }>`
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  max-height: 60px;
  width: 100%;
  padding: 16px;
  background-color: ${({theme, disabled}) => 
    disabled ? theme.COLORS.GRAY_200 : theme.COLORS.GRAY_300};
  border-width: 1px;
  border-color: ${({theme, error}) => 
    error ? theme.COLORS.RED_700 : 'transparent'};
  opacity: ${({disabled}) => disabled ? 0.6 : 1};
`;

export const IconInput = styled(FontAwesome5).attrs(({theme}) => ({
    color: theme.COLORS.GRAY_400,
    size: 26
}))`
  margin-right: 16px;
  flex: 0;
`;

export const ChevronIcon = styled(FontAwesome5)`
  position: absolute;
  right: 16px;
  top: 50%;
  margin-top: -8px;
`;

export const ErrorText = styled.Text`
  color: ${({theme}) => theme.COLORS.RED_700};
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
  margin-top: 4px;
  margin-left: 4px;
  width: 100%;
`; 