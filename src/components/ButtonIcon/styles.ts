import styled from "styled-components/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
`;
export const Button = styled(TouchableOpacity)``

export const Icon = styled(FontAwesome5).attrs(({theme}) => ({
    color: theme.COLORS.WHITE,
    size: 24
}))``;