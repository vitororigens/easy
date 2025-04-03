import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

// import backgroundImage from "../../assets/background.png";

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

// export const Background = styled(ImageBackground).attrs({
//   source: backgroundImage,
//   resizeMode: "cover",
// })`
//   flex: 1;
// `;

export const Header = styled.View<Props>`
  width: 100%;
  height: ${({ theme, type }) => (type === "PRIMARY" ? "80px" : "120px")};
  /* padding: 20px; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.PURPLE_800 : theme.COLORS.TEAL_600};
`;

export const Button = styled(TouchableOpacity)`
  height: 100%;
  align-items: end;
  justify-content: center;
  width: 27%;
  padding: 10px;
`;

export const ButtonClose = styled(TouchableOpacity)`
  height: 100%;
  align-items: end;
  justify-content: center;
  width: 27%;
  position: absolute;
  right: -16px;
`;

export const ButtonBack = styled(TouchableOpacity)`
  height: 100%;
  align-items: end;
  justify-content: center;
  width: 27%;
  position: absolute;
  left: -16px;
`;

export const Title = styled.Text<Props>`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  font-weight: 700;
  text-align: center;
  flex: ${({ theme, type }) => (type === "PRIMARY" ? 1 : "none")};
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.XL}px;
  font-weight: 700;
`;

export const ViewHomeCenter = styled.View`
  margin-top: 20px;
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONTE_SIZE.XL,
}))``;
