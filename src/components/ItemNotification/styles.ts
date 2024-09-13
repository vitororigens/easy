import styled from "styled-components/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from "react-native";
export type IconProps = "PRIMARY" | "SECUNDARY"

type Props = {
    type: IconProps;
}

export const Container = styled.View`
    width: 100%;
    height: 150px;
    border-bottom-width: 1px;
    border-bottom-color: ${({theme}) => theme.COLORS.PURPLE_50};
    padding: 10px;
    justify-content: space-between;
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
    color: ${({theme}) => theme.COLORS.GRAY_400};
`; 

export const Icon = styled(AntDesign).attrs<Props>(({theme, type}) => ({
    color: type === "PRIMARY" ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700,
    size: theme.FONTE_SIZE.LG
}))``;

export const Content = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Button = styled(TouchableOpacity)`
    flex-direction: row;
`;