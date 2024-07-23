import { Image } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.PURPLE_600};
    text-align: center;
    margin-top: 42px;
`;

export const SubTitle = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.TEAL_600};
    text-align: center;
    padding-right: 12px;
    padding-left: 12px;
`;

type StyledImageProps = {
    width: number
    height: number
}

export const StyledImage = styled(Image)`
    height: ${({height}) => height}px;
    width: ${({width}) => width}px;
    align-self: center; 
    margin-bottom: 20px;
    margin-top: -20px;
`;