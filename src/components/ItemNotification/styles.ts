import styled, { css } from "styled-components/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
export type IconProps = "success" | "danger";

type Props = {
  type: IconProps;
};

export const Container = styled.Pressable`
  width: 100%;
  height: 150px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  padding: 10px;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const DateDetails = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Icon = styled(AntDesign).attrs<Props>(({ theme }) => ({
  // color: type === "PRIMARY" ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700,
  size: theme.FONTE_SIZE.LG,
}))`
  ${(props) =>
    props.type === "success" &&
    css`
      color: ${({ theme }) => theme.COLORS.GREEN_700};
    `}

  ${(props) =>
    props.type === "danger" &&
    css`
      color: ${({ theme }) => theme.COLORS.RED_700};
    `}
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Button = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
`;

export const PendingNotificationCircle = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.COLORS.RED_700};
  position: absolute;
  top: 12px;
  right: 12px;
`;
