import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    padding: 10px;
    justify-content: center;
    align-items: center;

`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_600};
    width: 150px;
    text-align: center;
    margin-bottom: 40px;
`;

export const Span = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.PURPLE_600};
`;


export const Text = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_400};
    text-align: center;
    margin-bottom: 40px;
    margin-top: 20px;
`;

export const TextError = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_400};
    text-align: center;
    align-self: flex-start;
    margin-top: -6px;
    margin-left: 4px;
`;