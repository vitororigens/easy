import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    margin-top: 10px;
`;

export const LogoContainer = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const Header = styled.View`
    width: 100%;
`;

export const Content = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 25px;
    padding-top: 10px;
`;

type ButtonProps = {
    active: boolean
}

export const NavBar = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
`;

export const Button = styled(TouchableOpacity)<ButtonProps>`
    align-items: center;
    justify-content: center;
    width: 50%;
    border-top-width: 4px;
    border-top-style: solid;
    border-top-color: ${({theme, active}) => !active ? theme.COLORS.TEAL_600 : "transparent"};
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
`;

export const Divider = styled.View`
    width: 50%;
    height: 4px;
    background-color: ${({theme}) => theme.COLORS.TEAL_600};
`;
