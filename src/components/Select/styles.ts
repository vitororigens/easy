import styled from "styled-components/native";
import { FontAwesome5 } from '@expo/vector-icons';

export const Container = styled.View`
  flex-direction: column;
  margin-bottom: 10px;
`;

export const SelectWrapper = styled.View<{ error?: boolean; disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  margin-right: 10px;
`;

export const ErrorText = styled.Text`
  color: ${({theme}) => theme.COLORS.RED_700};
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
  margin-top: 4px;
  margin-left: 4px;
`; 