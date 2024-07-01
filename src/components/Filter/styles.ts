import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}

export const ContainerMonth = styled.View`
  width: 80%;
  height: 100%;
  margin: 40px auto 16px auto;
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  border: 2px solid;
  border-radius: 12px;
  border-color: ${({theme}) => theme.COLORS.TEAL_600};
  flex-direction: column;
  position: relative;
`;

export const Label = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    position: absolute;
    top: -25px;
`;

export const Content = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;

`;

export const NavBar = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;

`;

type ButtonProps = {
    active: boolean
}

export const ButtonBar = styled(TouchableOpacity)<ButtonProps>`
    align-items: center;
    justify-content: center;
    width: 50%;
    border-top-width: 4px;
    border-top-style: solid;
    background-color: ${({theme, active}) => active ? theme.COLORS.GRAY_300 : "transparent"};
    border-top-color: ${({theme, active}) => !active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

type DividerProps = {
    active: boolean
}

export const Divider = styled.View<DividerProps>`
    width: 50%;
    height: 4px;
    background-color: ${({theme, active}) => active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;


export const SubTitle = styled.Text<Props>`
    font-size: ${({ theme }) => theme.FONTE_SIZE.XL}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
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
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    border-bottom-width: 2px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_800};
    margin-bottom: 15px;
`;


export const TitleTask = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
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
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    margin-bottom: 15px;
`;

export const ButtonClose = styled(TouchableOpacity)`
    height: 40px;
    padding: 10px;
`;