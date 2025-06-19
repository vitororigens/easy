import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

type Props = {
  type?: "PRIMARY" | "SECONDARY";
};
const windowHeight = Dimensions.get("window").height;

export const Container = styled(SafeAreaView)<Props>`
  flex: 1;
  background-color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.PURPLE_800 : theme.COLORS.TEAL_600};
`;

type ContentProps = {
  customBg?: string;
};

export const Content = styled.View<ContentProps>`
  flex: 1;
  background-color: ${({ theme, customBg }) =>
    !!customBg ? customBg : theme.COLORS.WHITE};
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
`;

export const Header = styled.View<Props>`
  width: 100%;
  height: ${({ theme, type }) => (type === "PRIMARY" ? "80px" : "120px")};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.PURPLE_800 : theme.COLORS.TEAL_600};
  padding: 0 10px;
`;

export const Button = styled(TouchableOpacity)`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`;

export const ButtonClose = styled(TouchableOpacity)`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`;

export const ButtonBack = styled(TouchableOpacity)`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`;

export const Title = styled.Text<Props>`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: 'Roboto';
  font-size: ${({ theme }) => theme.FONT_SIZE.GG}px;
  font-weight: 700;
  text-align: center;
  flex: 1;
  padding: 0 10px;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: 'Roboto';
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  font-weight: 700;
`;

export const ViewHomeCenter = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 1;
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: 24,
}))``;
