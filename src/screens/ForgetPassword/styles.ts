import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    padding: 10px;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.COLORS.WHITE};

`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_600};
    text-align: center;
    margin-bottom: 40px;
`;


export const LogoContainer = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`;


