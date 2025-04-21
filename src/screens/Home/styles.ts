import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const Container = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  max-height: 400px;
`;

export const Header = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const ContentTitle = styled(TouchableOpacity)`
  margin-bottom: 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  border-radius: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const Title = styled.Text<{ active?: boolean }>`
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme, active }) => 
    active ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
  margin-bottom: 4px;
`;

export const SubTitle = styled.Text<{ type?: "PRIMARY" | "SECONDARY" }>`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700};
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin: 0 8px;
`;

export const Icon = styled(MaterialIcons)`
  font-size: ${({ theme }) => theme.FONTE_SIZE.XL}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const ContainerItems = styled.View`
  flex: 1;
  width: 100%;
`;

export const Content = styled.View`
  flex: 1;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 24px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const Button = styled(TouchableOpacity)<{ active?: boolean }>`
  flex: 1;
  height: 70px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active }) =>
    active ?  theme.COLORS.PURPLE_50 : theme.COLORS.WHITE};
  padding: 12px;
  elevation: ${({ active }) => (active ? 4 : 0)};
  shadow-color: #000;
  shadow-offset: 0px ${({ active }) => (active ? -2 : 0)}px;
  shadow-opacity: ${({ active }) => (active ? 0.1 : 0)};
  shadow-radius: ${({ active }) => (active ? 3 : 0)}px;
`;

export const NavBar = styled.View`
  width: 100%;
  flex-direction: row;
  border-radius: 40px;
  overflow: hidden;
  margin-bottom: 16px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  border-radius: 8px;
  margin: 8px 16px;
`;

export const StatItem = styled.View`
  align-items: center;
  flex: 1;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-bottom: 4px;
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  text-align: center;
`;