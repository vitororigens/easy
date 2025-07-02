import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.COLORS.TEAL_50};
  border-radius: 16px;
  margin-bottom: 14px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 2;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 16px 18px 14px 18px;
`;

export const MainContent = styled.View`
  flex: 1;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const ShareBadge = styled.View`
  background-color: ${({ theme }) => theme.COLORS.PURPLE_600};
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 7px;
  align-items: center;
  justify-content: center;
`;

export const ShareIcon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  size: 15,
  color: theme.COLORS.WHITE,
}))``;

export const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-top: 2px;
`;

export const ShareText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 2px;
`;

export const Actions = styled.View`
  flex-direction: row;
  margin-left: 10px;
`;

export const ActionButton = styled(TouchableOpacity)`
  padding: 8px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

export const PopoverContainer = styled.View`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  padding: 8px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const PopoverItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const PopoverItemText = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-left: 8px;
`;

export const PopoverDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_200};
  margin: 4px 0;
`;