import styled from "styled-components/native";
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'


export type ListItemStyleProps = 'PRIMARY' | 'SECONDARY'

type ListItemProps = {
    type?: ListItemStyleProps;
}

export const Container = styled.View`
    flex: 1;
    padding: 20px;
`;

export const Content = styled.View`
    width: 100%;
    height: 150px;
    border: 1px;
    border-radius: 8px;
    border-color: ${({theme}) => theme.COLORS.PURPLE_50};
    padding: 10px;
`;


export const SharedUserContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-vertical: 10px;
`;

export const SharedUser = styled.View`
  margin-right: 10px;
`;

export const IconCheck = styled(MaterialCommunityIcons).attrs<ListItemProps>(({theme, type}) => ({
    color: type === 'PRIMARY' ?  theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800, 
    size: theme.FONTE_SIZE.XL
}))`
    margin-right: 5px;
`;

export const Title = styled.Text<ListItemProps>`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    color: ${({theme, type}) => type === 'PRIMARY' ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800 };
    text-decoration-line: ${({type}) => type === 'PRIMARY' ? 'line-through' :  'none'};
`;

export const ButtonSelect = styled(TouchableOpacity)`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;
