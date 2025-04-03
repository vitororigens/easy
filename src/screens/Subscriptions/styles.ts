import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
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
  font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
  color: ${({theme, active}) => active ? theme.COLORS.WHITE : theme.COLORS.GRAY_600};
`;

export const ItemContainer = styled.View`
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const ItemTitle = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 8px;
`;

export const ItemValue = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 4px;
`;

export const ItemDate = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.SM}px;
  color: ${({theme}) => theme.COLORS.GRAY_400};
  margin-bottom: 4px;
`;

export const ItemStatus = styled.Text<{ active: boolean }>`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.SM}px;
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
  font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
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
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
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