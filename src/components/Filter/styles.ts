import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}

export const FormContainer = styled.View`
    margin-top: 40px;
    gap: 42px;
    align-items: center;
`

export const InputContainer = styled.View`
  width: 80%;
  height: 60px;
  margin: 0 auto;
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  border: 2px solid;
  border-radius: 12px;
  border-color: ${({theme}) => theme.COLORS.TEAL_600};
  flex-direction: column;
  position: relative;
  justify-content: center;
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
    min-height: 60px;
    max-height: 80px;
    flex-direction: row;
    justify-content: space-between;

`;

export const ButtonBar = styled(TouchableOpacity)`
    background-color: ${({theme}) => theme.COLORS.TEAL_600};
    width: 80%;
    align-items: center;
    padding: 16px 20px;
    border-radius: 12px;
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

export const TextField = styled(TextInput)`
    width: 100%;
    height: 60px;
    margin: 0 auto;
    padding: 16px;
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