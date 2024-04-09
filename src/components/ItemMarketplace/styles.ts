import styled from "styled-components/native";
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Container =  styled.View`
    width: 100%;
    flex-direction: row;
    height: 100px;
    align-items: center;
    padding: 10px;
`;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
    color: ${({theme}) => theme.COLORS.GRAY_600};
`;

export const SubTitle = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
    color: ${({theme}) => theme.COLORS.GRAY_400};
`;

export const Contant = styled.View`
    width: 50%;
    height: 100px;
    justify-content: center;
    padding: 10px;
`;

export const ContainerQuantity = styled.View`
    background-color: ${({theme}) => theme.COLORS.GRAY_300};
    border-radius: 10px;
    width: 100px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`;

export const Icon = styled(Entypo).attrs(({theme}) => ({
    color: theme.COLORS.RED_700,
    size: 24
}))``;

export const Button = styled(TouchableOpacity)``

export const CartIcon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
    color: theme.COLORS.GRAY_600,
    size: 32
}))``;
