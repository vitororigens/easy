import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ContentTitleProps = "PRIMARY" | "SECONDARY";
type Props = {
  type?: ContentTitleProps;
};

export const Content = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Header = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const NavBar = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const Button = styled(TouchableOpacity)<{ active: boolean }>`
  align-items: center;
  justify-content: center;
  width: 50%;
  border-top-width: 4px;
  border-top-style: solid;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-top-color: ${({ theme, active }) =>
    active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;

export const ContentTitle = styled(TouchableOpacity)<Props>`
  margin-bottom: 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.TEAL_50 : theme.COLORS.PURPLE_50};
  border-radius: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_600};
  text-align: left;
  margin-bottom: 0;
  margin-top: 0;
`;

export const Icon = styled(MaterialIcons).attrs<Props>(({ theme, type }) => ({
  color: type === "PRIMARY" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_600,
  size: 26,
}))``;

export const SectionIcon = styled(MaterialCommunityIcons).attrs<Props>(({ theme, type }) => ({
  size: 24,
      color: type === "PRIMARY" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_600,
}))`
  margin-right: 8px;
`;

export const Container = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  max-height: 500px;
`;

export const EmptyContainer = styled.View`
  padding: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  border-radius: 10px;
  margin: 8px 0;
`;

export const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  text-align: center;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 8px;
`;

export const TaskCard = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const TaskName = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 8px;
`;

export const DateText = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  margin-bottom: 4px;
`;
