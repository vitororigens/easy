import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

export const Header = styled.View`
  width: 100%;
`;

export const NavBar = styled.View`
  width: 100%;
  min-height: 60px;
  max-height: 80px;
  flex-direction: row;
  justify-content: space-between;
`;

type ButtonProps = {
  active: boolean;
};

export const Button = styled(TouchableOpacity)<ButtonProps>`
  align-items: center;
  justify-content: center;
  width: 50%;
  border-top-width: 4px;
  border-top-style: solid;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-top-color: ${({ theme, active }) =>
    !active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

type DividerProps = {
  active: boolean;
};

export const Divider = styled.View<DividerProps>`
  width: 50%;
  height: 4px;
  background-color: ${({ theme, active }) =>
    active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;


export const ContentTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const Icon = styled.View`
  margin-left: 10px;
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  margin: 0 10px;
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  margin-top: 5px;
`; 