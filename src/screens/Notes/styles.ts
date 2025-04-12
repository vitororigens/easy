import { TouchableOpacity, Dimensions } from "react-native";
import styled from "styled-components/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export type subTitleTypeStyleProps = "PRIMARY" | "SECONDARY";

type Props = {
  type: subTitleTypeStyleProps;
};

type contentTitle = {
  isMysharedNotes?: boolean;
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

export const Button = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  width: 50%;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  text-align: left;
  margin-bottom: 0;
  margin-top: 0;
`;

export const SectionTitle = styled(Title)`
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.COLORS.PURPLE_600};
`;

export const Divider = styled.View`
  width: 50%;
  height: 4px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const ContentTitle = styled(TouchableOpacity)<contentTitle>`
  margin-bottom: 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme, isMysharedNotes }) => 
    isMysharedNotes ? theme.COLORS.PURPLE_50 : theme.COLORS.TEAL_50};
  border-radius: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 2px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-left: 12px;
  margin-right: 12px;
  opacity: 0.2;
`;

export const Icon = styled(MaterialIcons).attrs(({ theme }) => ({
  color: theme.COLORS.PURPLE_800,
  size: 26,
}))``;

export const SectionIcon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  size: 24,
}))<{ isMysharedNotes?: boolean }>`
  margin-right: 8px;
  color: ${({ theme, isMysharedNotes }) => 
    isMysharedNotes ? theme.COLORS.PURPLE_600 : theme.COLORS.TEAL_600};
`;

export const Container = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  max-height: 500px;
`;

export const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  text-align: center;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 8px;
`;

export const EmptyContainer = styled.View`
  padding: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  border-radius: 10px;
  margin: 8px 0;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
