import styled from "styled-components/native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

export type ListItemStyleProps = 'PRIMARY' | 'SECONDARY'

type ListItemProps = {
    type: ListItemStyleProps;
}

export const Container = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
`;

export const Icon = styled(MaterialCommunityIcons).attrs<ListItemProps>(({theme, type}) => ({
    color: type === 'PRIMARY' ?  theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800, 
    size: theme.FONT_SIZE.XL
}))``;

export const Button = styled(TouchableOpacity)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    margin-right: 15px;
`;

export const Title = styled.Text<ListItemProps>`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONT_SIZE.GG}px;
    color: ${({theme, type}) => type === 'PRIMARY' ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800 };
    text-decoration-line: ${({type}) => type === 'PRIMARY' ? 'line-through' :  'none'};
`;