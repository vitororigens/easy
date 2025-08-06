import { TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';

export const Container = styled.View`
  flex-direction: column;
  margin-bottom: 10px;
`;

export const InputWrapper = styled.View<{ error?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  max-height: 60px;
  width: 100%;
  padding: 16px;
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  border-width: 1px;
  border-color: ${({theme, error}) => error ? theme.COLORS.RED_700 : 'transparent'};
`;

export const InputContainer = styled(TextInput).attrs(({theme}) => ({
  placeholderTextColor: theme.COLORS.GRAY_400,
}))`
  flex: 1;
  min-height: 60px;
  max-height: 60px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.LG}px;
  padding: 15px;
`;

export const Button = styled(TouchableOpacity)``;

export const Icon = styled(Octicons).attrs(({theme}) => ({
  color: theme.COLORS.GRAY_400,
  size: 26,
}))``;

export const IconInput = styled(FontAwesome5).attrs(({theme}) => ({
  color: theme.COLORS.GRAY_400,
  size: 26,
}))``;

export const ErrorText = styled.Text`
  color: ${({theme}) => theme.COLORS.RED_700};
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
  margin-top: 4px;
  margin-left: 4px;
`;
