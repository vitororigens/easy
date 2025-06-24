import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = "PRIMARY" | "SECONDARY";

type Props = {
  type: subTitleTypeStyleProps;
};

export const Content = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
`;

export const ContentItems = styled.View`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 24px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

export const SectionContainer = styled.View`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-bottom: 16px;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
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

export const ButtonIcon = styled(TouchableOpacity)`
  border-radius: 12px;
  margin-bottom: 4px;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 1;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  flex: 1;
`;

export const Divider = styled.View`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const SubTitle = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme, type }) =>
    type === "PRIMARY" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
`;

export const Items = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  min-height: 64px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Icon = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  border-radius: 12px;
  margin-left: 12px;
`;

export const ItemContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const ItemTextContainer = styled.View`
  flex: 1;
`;

export const ItemSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 2px;
`;

export const ArrowIcon = styled.View`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

export const DangerIcon = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.RED_700}20;
  border-radius: 12px;
  margin-left: 12px;
`;

export const WarningIcon = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.YELLOW_700}20;
  border-radius: 12px;
  margin-left: 12px;
`;
