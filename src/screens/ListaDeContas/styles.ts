import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

export const Content = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    padding: 20px;
`;

export const Header = styled.View`
    width: 100%;

`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const Divider = styled.View`
    width: 100%;
    height: 4px;
    background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const ButtonClose = styled(TouchableOpacity)`
    height: 40px;
    padding: 10px;
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

export const FooterSpacer = styled.View`
  height: 90px;
`;

export const ModalCloseButton = styled(TouchableOpacity)`
  align-self: flex-end;
  margin-bottom: 32px;
`;

export const ModalCloseTitle = styled(Title)`
  color: ${({ theme }) => theme.COLORS.WHITE};
`;
