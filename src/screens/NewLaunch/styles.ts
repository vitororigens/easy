import { TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    padding: 16px;
    align-items: center;
`;


export const InputValue = styled(TextInput).attrs(({ theme }) => ({
    placeholderTextColor: theme.COLORS.GRAY_400
}))`
    min-height: 80px;
    max-height: 80px;
    color: ${({ theme }) => theme.COLORS.TEAL_600};
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
    padding: 10px;
    margin-bottom: 20px;
`;

export const Content = styled.View`
    width: 100%;
    margin-bottom: 20px;
    flex: 1;
`;

export const InputDescription = styled(TextInput).attrs(({ theme }) => ({
    placeholderTextColor: theme.COLORS.GRAY_400,
}))`
    width: 100%;
    min-height: 100px;
    max-height: 100px;
    color: ${({ theme }) => theme.COLORS.GRAY_600};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    padding: 16px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_300};
    border-radius: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const TextError = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
    color: ${({ theme }) => theme.COLORS.RED_700};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    
    margin-bottom: 5px;
`;

export const ScrollContent = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1 }
})``;

export const KeyboardAvoiding = styled(KeyboardAvoidingView)`
  flex: 1;
`;