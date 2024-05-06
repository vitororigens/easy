import styled from "styled-components/native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
    flex: 1;
    flex-direction: row;

`;

export const Icon = styled(MaterialCommunityIcons).attrs(({theme}) => ({
    color: theme.COLORS.TEAL_600, 
    size: theme.FONTE_SIZE.GG
}))``;

export const Button = styled(TouchableOpacity)``;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONTE_SIZE.GG}px;
    color: ${({theme}) => theme.COLORS.TEAL_600};
`;