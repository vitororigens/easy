import styled from "styled-components/native";

export const Container = styled.View`
    width: 90px;
    height: 90px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.COLORS.PURPLE_600};
    margin: 20px;
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.WHITE};
`;