import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from 'react-native';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  margin: 0 16px;
`;

export const Content = styled.View`
  align-items: stretch;
`;

export const ButtonText = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  padding: 8px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Button = styled(TouchableOpacity)`
  width: 140px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_600};
  height: 60px;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 20px;
  flex-wrap: wrap;
`;

export const Icon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: 32,
}))``;

export const Input = styled(TextInput)`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  padding: 8px 16px;
  margin: 8px 0;
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
`;
