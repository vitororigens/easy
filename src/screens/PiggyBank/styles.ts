import { TouchableOpacity } from "react-native";
//
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}


export const Content = styled.View`
    flex: 1;
`;



export const Header = styled.View`
    width: 100%;

`;

export const NavBar = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 25px;
    padding-top: 10px;
`;

export const Button = styled(TouchableOpacity)`
align-items: center;
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
`;

export const Divider = styled.View`
    width: 100%;
    height: 4px;
    background-color: ${({theme}) => theme.COLORS.TEAL_600};
`;


export const SubTitle = styled.Text<Props>`
font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
color: ${({theme, type}) => type === 'PRIMARY' 
    ? theme.COLORS.TEAL_600 
    : theme.COLORS.PURPLE_800};
`;
