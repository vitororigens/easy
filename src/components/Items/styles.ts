import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export type ItemsTypeStyleProps = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

type Props = {
  type?: ItemsTypeStyleProps;
  status?: 'PENDING' | 'PAID' | 'OVERDUE' | undefined;
  isShared?: boolean;
};

export const Container = styled.View<Props>`
  width: 100%;
  margin-bottom: 16px;
  background-color: ${({ theme, isShared }) =>
    isShared ? theme.COLORS.TEAL_50 : theme.COLORS.WHITE};
  border-radius: 14px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 2;
`;

export const Content = styled.View<Props>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

export const MainContent = styled.View`
  flex: 1;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
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

export const ShareText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 2px;
`;

export const ContentInfo = styled.View`
  flex: 1;
`;

export const Title = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color:  ${({ theme, status }) => {
    switch (status) {
    case 'PAID':
      return theme.COLORS.GREEN_700;
    case 'PENDING':
      return theme.COLORS.YELLOW_700;
    case 'OVERDUE':
      return theme.COLORS.RED_700;
    default:
      return theme.COLORS.GRAY_400;
    }
  }};
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-top: 4px;
`;

export const Value = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ color }) => color};
  margin-bottom: 4px;
`;

export const DateText = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Status = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme, status }) => {
    switch (status) {
    case 'PAID':
      return theme.COLORS.GREEN_700;
    case 'PENDING':
      return theme.COLORS.YELLOW_700;
    case 'OVERDUE':
      return theme.COLORS.RED_700;
    default:
      return theme.COLORS.GRAY_600;
    }
  }};
  margin-top: 4px;
`;

export const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled(TouchableOpacity)`
  padding: 8px;
`;

export const Icon = styled.View<Props>`
  width: 13%;
  height: 45px;
  background-color: ${({ theme, type }) =>
    type === 'PRIMARY'
      ? theme.COLORS.GREEN_700
      : type === 'SECONDARY'
        ? theme.COLORS.RED_700
        : theme.COLORS.YELLOW_700};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 10px;
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Divider = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const ContentItems = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const IconMenu = styled(Entypo).attrs<Props>(({ theme, type }) => ({
  color:
    type === 'PRIMARY'
      ? theme.COLORS.GREEN_700
      : type === 'SECONDARY'
        ? theme.COLORS.RED_700
        : theme.COLORS.YELLOW_700,
  size: theme.FONT_SIZE.XL,
}))``;

export const ContainerMenu = styled.View`
  min-width: 70px;
  border-radius: 5px;
  background-color: #fff;
  max-height: 200px;
  top: -20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;

`;

export const PopoverContainer = styled.View`
  min-width: 200px;
  padding: 8px 0;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const PopoverItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
`;

export const PopoverItemText = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-left: 12px;
`;

export const PopoverDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin: 4px 0;
`;
