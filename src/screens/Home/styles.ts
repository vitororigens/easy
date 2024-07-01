import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}


export const Content = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
`;



export const Header = styled.View`
    width: 100%;

`;

export const NavBar = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;

`;

type ButtonProps = {
    active: boolean
}

export const Button = styled(TouchableOpacity)<ButtonProps>`
    align-items: center;
    justify-content: center;
    width: 50%;
    border-top-width: 4px;
    border-top-style: solid;
    background-color: ${({theme, active}) => active ? theme.COLORS.GRAY_300 : "transparent"};
    border-top-color: ${({theme, active}) => !active ? theme.COLORS.PURPLE_800 : theme.COLORS.GRAY_300};
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

type DividerProps = {
    active: boolean
}

export const Divider = styled.View<DividerProps>`
    width: 50%;
    height: 4px;
    background-color: ${({theme, active}) => active ? theme.COLORS.PURPLE_800 : theme.COLORS.GRAY_300};
`;


export const SubTitle = styled.Text<Props>`
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
`;


export const ContainerItems = styled.View`
    flex: 1;
    width: 100%;
`;

export const HeaderItems = styled.View<Props>`
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
    border-radius: 50px 50px  0px 0px;
    height: 60px;
    margin-top: 20px;
    margin-bottom: 10px;
`;


export const TitleItems = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const ButtonClose = styled(TouchableOpacity)`
    height: 40px;
`;
