import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ListItemProps = {
  type?: "primary" | "secondary";
};

export const Title = styled.Text<ListItemProps>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme, type }) =>
    type === "primary" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
  text-decoration-line: ${({ type }) =>
    type === "primary" ? "line-through" : "none"};
`;

export const CircleContainer = styled(TouchableOpacity)`
  height: 60px;
  width: 60px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  position: relative;
`;

export const Plus = styled(FontAwesome).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONTE_SIZE.GG,
}))``;

export const Remove = styled(AntDesign).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONTE_SIZE.SM,
}))`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: ${({ theme }) => theme.COLORS.RED_700};
  padding: 2px;
  border-radius: 8px;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
`;

export const ButtonSelect = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const IconCheck = styled(MaterialCommunityIcons).attrs<ListItemProps>(
  ({ theme, type }) => ({
    color: type === "primary" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800,
    size: theme.FONTE_SIZE.XL,
  })
)`
  margin-right: 5px;
`;
