import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
  type: subTitleTypeStyleProps;
};

export const Content = styled.View`
  flex: 1;
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
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Divider = styled.View`
  width: 50%;
  height: 4px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const SubTitle = styled.Text<Props>`
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme, type }) =>
    type === 'PRIMARY' ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
`;

export const ContentTitle = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 2px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-left: 5px;
  margin-right: 5px;
`;

export const Icon = styled(MaterialIcons).attrs(({ theme }) => ({
  color: theme.COLORS.GRAY_400,
  size: 26,
}))``;
