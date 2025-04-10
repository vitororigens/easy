import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const Container = styled.View`
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  margin: 0 16px;
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonText = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  padding: 8px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
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
