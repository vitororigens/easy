import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

export const ViewLeft = styled.View`
  flex-direction: row;
  align-items: start;
  gap: 8px;
`;
export const ViewRight = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Content = styled.View``;

export const ContainerQuantity = styled.View`
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  border-radius: 10px;
  width: 100px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const Icon = styled(Entypo).attrs(({ theme }) => ({
  color: theme.COLORS.RED_700,
  size: 24,
}))``;

export const Button = styled(TouchableOpacity)``;

export const CartIcon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  color: theme.COLORS.GRAY_600,
  size: 32,
}))``;
