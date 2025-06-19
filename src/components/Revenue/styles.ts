import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}


export const Content = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
`;



export const Header = styled.View`
    width: 100%;

`;

export const NavBar = styled.View`
    width: 100%;
    min-height: 60px;
    max-height: 80px;
    flex-direction: row;
    justify-content: space-between;

`;

export const ButtonBar = styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 50%;
`;
export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

export const Divider = styled.View`
    width: 50%;
    height: 4px;
    background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;


export const SubTitle = styled.Text<Props>`
    font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
`;


export const Button = styled(TouchableOpacity)`
    flex: 1;
    min-height: 60px;
    max-height: 60px;
    background-color: ${({ theme }) => theme.COLORS.TEAL_600};
    width: 100%;
    border-bottom-width: 5px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_800};
    align-items: center;
    justify-content: center;
`;



export const DividerTask = styled.View`
    width: 2px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400};
    margin-left: 10px;
    margin-right:10px;
`;


export const Input = styled(TextInput).attrs(({ theme }) => ({
    placeholderTextColor: theme.COLORS.GRAY_400
}))`
    flex: 1;

    min-height: 40px;
    max-height: 40px;


    color: ${({ theme }) => theme.COLORS.GRAY_600};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    border-bottom-width: 2px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_800};
    margin-bottom: 15px;
`;


export const TitleTask = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_600};
`;


export const InputDescription = styled(TextInput).attrs(({ theme }) => ({
    placeholderTextColor: theme.COLORS.GRAY_400,
}))`
    flex: 1;
    min-height: 90px;
    max-height: 90px;
    color: ${({ theme }) => theme.COLORS.GRAY_600};
    background-color: ${({theme}) => theme.COLORS.GRAY_300};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    margin-bottom: 15px;
`;

export const ButtonClose = styled(TouchableOpacity)`
    height: 40px;
    padding: 10px;
`;

export const Span = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

