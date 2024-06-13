import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)`
    max-height: 80px;
    min-height: 80px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_300};
    border-bottom-width: 5px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_600};
    padding: 20px;
    margin: 10px;
    flex-direction: row;
`;


export const Title = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.PURPLE_800};
    font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
`;

export const SubTitle = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.TEAL_600};
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
`;

export const DateNote = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.TEAL_600};
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
    margin-top: 4px;
`;

export const Button = styled(TouchableOpacity)`
    flex-direction: row;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    padding: 5px;
    justify-content: start;
    align-items: center;
    border-bottom-width: 1px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const Icon = styled(Entypo).attrs(({ theme }) => ({
    color: theme.COLORS.TEAL_600,
    size: theme.FONTE_SIZE.XL,
}))`
    margin-right: 5px;
`


export const ContainerMenu = styled.View`
  min-width: 90px;
  border-radius: 5px;
  background-color: #fff;
  max-height: 200px;
  top: -20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;