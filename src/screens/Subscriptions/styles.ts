import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONT_SIZE.XL}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 24px;
`;

export const FilterContainer = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
  gap: 8px;
`;

export const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({theme, active}) => active ? theme.COLORS.PURPLE_600 : theme.COLORS.GRAY_300};
  align-items: center;
`;

export const FilterText = styled.Text<{ active: boolean }>`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  color: ${({theme, active}) => active ? theme.COLORS.WHITE : theme.COLORS.GRAY_600};
`;

export const ItemContainer = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const ItemTitle = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONT_SIZE.LG}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 8px;
`;

export const ItemValue = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 4px;
`;

export const ItemDate = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
  color: ${({theme}) => theme.COLORS.GRAY_400};
  margin-bottom: 4px;
`;

export const ItemStatus = styled.Text<{ active: boolean }>`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
  color: ${({theme, active}) => active ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const EmptyText = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_400};
  text-align: center;
  margin-top: 8px;
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
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  margin-top: 5px;
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

export const MenuButton = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 8px;
`;

export const MenuOptions = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const MenuOption = styled(TouchableOpacity)`
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
`;

export const MenuOptionText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-left: 8px;
`;
