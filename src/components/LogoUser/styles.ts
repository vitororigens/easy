import styled from "styled-components/native";
import { Entypo} from "@expo/vector-icons";
import {  Image } from "react-native";

export const Container = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.COLORS.GRAY_400};
    margin: 20px;
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.LG}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.WHITE};
`;

export const Icon = styled(Entypo).attrs(({theme}) => ({
    color: theme.COLORS.WHITE,
    size: 12,
}))``;

export const ContainerIcon = styled.View`
    height: 20px;
    width: 20px;
    border-radius: 50px;
    background-color: ${({theme}) => theme.COLORS.GRAY_400};
    position: absolute;
    top: 25px;
    left: 25px;
    border: 2px;
    border-color: ${({theme}) => theme.COLORS.WHITE};
    align-items: center;
    justify-content: center;

`;


export const StyledImage = styled(Image)`
  width: 40px;
    height: 40px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400} ;
`;
