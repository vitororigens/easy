import styled from "styled-components/native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export type ItemProps = "PRIMARY" | "SECUNDARY"

type Props = {
    type: ItemProps;
}

export const Container = styled.View`
    width: 100%;
    height: 60px;
    border-bottom-width: 1px;
    border-bottom-color: ${({theme}) => theme.COLORS.PURPLE_50};
    padding: 10px;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
`;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    color: ${({theme}) => theme.COLORS.PURPLE_800};
`; 

export const SubTitle = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    color: ${({theme}) => theme.COLORS.GRAY_600};
`; 

export const Span = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
    color: ${({theme}) => theme.COLORS.WHITE};
`; 

export const Item = styled.View<Props>`
   max-width: 150px;
   background-color: ${({theme, type}) => type === "PRIMARY" ? theme.COLORS.GREEN_700 : theme.COLORS.YELLOW_700};
   padding: 5px;
   border-radius:20px;
`;

export const Icon = styled(FontAwesome).attrs(({theme}) => ({
    color: theme.COLORS.RED_700,
    size: theme.FONTE_SIZE.XL
}))``;

export const Content = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;