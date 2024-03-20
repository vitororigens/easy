import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    margin-top: 10px;
    background-color: ${({theme}) => theme.COLORS.WHITE};
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
    height: 50px;
    flex-direction: row;
    justify-content: space-around;
`;

export const Button = styled(TouchableOpacity)``;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
`;

export const Divider = styled.View`
    width: 50%;
    height: 4px;
    background-color: ${({theme}) => theme.COLORS.TEAL_600};
`;
