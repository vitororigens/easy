import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'

export type ListItemStyleProps = 'PRIMARY' | 'SECONDARY'

type ListItemProps = {
    type?: ListItemStyleProps;
}

export const Container = styled(TouchableOpacity)`
    max-height: 40px;
    min-height: 40px;
    margin: 10px;
    flex-direction: row;
`;


export const Title = styled.Text<ListItemProps>`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    color: ${({theme, type}) => type === 'PRIMARY' ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800 };
    text-decoration-line: ${({type}) => type === 'PRIMARY' ? 'line-through' :  'none'};
`;

export const SubTitle = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.TEAL_600};
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
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
    size: theme.FONTE_SIZE.XL,
}))`
    margin-right: 5px;
`


export const ContainerMenu = styled.View`
  min-width: 90px;
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


export const IconCheck = styled(MaterialCommunityIcons).attrs<ListItemProps>(({theme, type}) => ({
    color: type === 'PRIMARY' ?  theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800, 
    size: theme.FONTE_SIZE.XL
}))`
    margin-right: 5px;
`;