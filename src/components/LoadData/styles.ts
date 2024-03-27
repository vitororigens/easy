import styled from "styled-components/native";
import { Image } from "react-native";

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
`;

export const SubTitle = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.TEAL_600};
    text-align: center;
`;

export const StyledImage = styled(Image)`
    height: 200px;
    width: 200px;
    align-self: center; 
    margin: 20px; 
`;