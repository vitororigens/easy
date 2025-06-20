import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = "PRIMARY" | "SECONDARY";

type Props = {
  type: subTitleTypeStyleProps;
};

export const Content = styled.View`
  flex: 1;
  padding: 12px;
  border-top-width: 4px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.COLORS.TEAL_600};
  border-top-right-radius: 40px;
  border-top-left-radius: 40px;
  /* background-color: ${({ theme }) => theme.COLORS.WHITE}; */
`;

export const ContentItems = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 20px;
`;

export const Header = styled.View`
  width: 100%;
  align-items: center;
`;

export const NavBar = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 50px;
  padding-right: 25px;
  padding-top: 10px;
`;

export const ButtonIcon = styled(TouchableOpacity)``;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.GG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const Divider = styled.View`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const SubTitle = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONT_SIZE.GG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
`;

export const Items = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  min-height: 40px;
  max-height: 80px;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
`;

export const Icon = styled.View`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
