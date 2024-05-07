import styled from "styled-components/native";

export type ItemsTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: ItemsTypeStyleProps;
}

export const Container = styled.View`
    width: 100%;
    flex-direction: row;
    padding-top: 10px;
`;

export const Icon = styled.View<Props>`
    width: 13%;
    height: 45px;
    background-color: ${({theme, type}) => type === 'PRIMARY' 
    ? theme.COLORS.GREEN_700
    : theme.COLORS.YELLOW_700};
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin: 10px;
`;

export const Title = styled.Text<Props>`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
    color: ${({theme, type}) => type === 'PRIMARY' 
    ? theme.COLORS.GREEN_700
    : theme.COLORS.YELLOW_700};
`;


export const SubTitle = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.SM}px;
    color: ${({theme}) => theme.COLORS.GRAY_400};

`;

export const Divider = styled.View`
    width: 100%;
    height: 2px;
    background-color: ${({theme}) => theme.COLORS.GRAY_400};
`;


export const Content = styled.View`
width: 80%;
padding: 10px 20px 10px 0px;
height: 45px;
`;

export const ContentItems = styled.View`
flex-direction: row;
justify-content: space-between;
`;