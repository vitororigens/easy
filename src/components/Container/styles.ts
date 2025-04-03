import { FontAwesome5 } from '@expo/vector-icons';
import styled from "styled-components/native";

export type ContainerTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: ContainerTypeStyleProps;
}

export const Content  =  styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.COLORS.WHITE};
    border-radius: 50px 50px  0px 0px;
`;


export const Header = styled.View<Props>`
    width: 100%;
    height: 100px;
    border-radius: 50px 50px 0 0;
    background-color: ${({theme, type}) => type === 'PRIMARY' 
    ? theme.COLORS.TEAL_600 
    : theme.COLORS.PURPLE_800};
    align-items: center;
    justify-content: center;
    flex-direction: row;
`;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
    color: ${({theme}) => theme.COLORS.WHITE};
`;

export const SubTitle = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
    color: ${({theme}) => theme.COLORS.GRAY_400};
`;


export const Icon = styled(FontAwesome5).attrs(({theme}) => ({
    color: theme.COLORS.WHITE,
    size: theme.FONTE_SIZE.XL
}))`
margin-right: 10px;
`;