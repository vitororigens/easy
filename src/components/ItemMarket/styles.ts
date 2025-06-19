import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'

export type ListItemStyleProps = 'PRIMARY' | 'SECONDARY'

type ListItemProps = {
    type?: ListItemStyleProps;
}

export const Container = styled.View`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;
  margin-bottom: 8px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
`;

export const CheckboxContainer = styled(TouchableOpacity)`
  margin-right: 12px;
`;

export const Checkbox = styled.View<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${({ theme, checked }) => 
    checked ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_400};
  background-color: ${({ theme, checked }) => 
    checked ? theme.COLORS.TEAL_600 : "transparent"};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text<{ status: boolean }>`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme, status }) => 
    status ? theme.COLORS.GRAY_400 : theme.COLORS.GRAY_600};
  text-decoration-line: ${({ status }) => status ? "line-through" : "none"};
  margin-bottom: 4px;
`;

export const Description = styled.Text<{ status: boolean }>`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme, status }) => 
    status ? theme.COLORS.GRAY_400 : theme.COLORS.GRAY_600};
  text-decoration-line: ${({ status }) => status ? "line-through" : "none"};
`;

export const Actions = styled.View`
  flex-direction: row;
  margin-left: 8px;
`;

export const ActionButton = styled(TouchableOpacity)`
  padding: 8px;
  margin-left: 4px;
`;

export const Button = styled(TouchableOpacity)`
    flex-direction: row;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    padding: 5px;
    justify-content: start;
    align-items: center;
    border-bottom-width: 1px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const Icon = styled(Entypo).attrs(({ theme }) => ({
    color: theme.COLORS.TEAL_600,
    size: theme.FONT_SIZE.XL,
}))`
    margin-right: 5px;
` 