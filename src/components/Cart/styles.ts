import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
    width: 100%;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    
`;

export const Button = styled(TouchableOpacity)`
    width: 140px;
    background-color: ${({theme}) => theme.COLORS.PURPLE_600};
    height: 60px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 20px;
    flex-wrap: wrap;
`;


export const Icon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
    color: theme.COLORS.WHITE,
    size: 32
}))``;
