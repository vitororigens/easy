import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

type ContainerProps = {
  isShared?: boolean;
};

type ShareBadgeProps = {
  isSharedByMe?: boolean;
};

export const Container = styled(TouchableOpacity)<ContainerProps>`
  width: 100%;
  min-height: 80px;
  background-color: ${({ theme, isShared }) =>
    isShared ? theme.COLORS.PURPLE_50 : theme.COLORS.TEAL_50};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const DateNote = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 4px;
`;

export const Icon = styled(Entypo).attrs(({ theme }) => ({
  size: 20,
  color: theme.COLORS.PURPLE_800,
}))``;

export const ShareIcon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  size: 16,
  color: theme.COLORS.WHITE,
}))``;

export const ShareBadge = styled.View<ShareBadgeProps>`
  background-color: ${({ theme, isSharedByMe }) =>
    isSharedByMe ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_600};
  padding: 4px;
  border-radius: 12px;
  margin-left: 8px;
`;

export const Button = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const ContainerMenu = styled.View`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  padding: 8px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
