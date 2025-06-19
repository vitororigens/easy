import { Switch } from "react-native";
import styled from "styled-components/native";
import theme from "../../theme";

export const Container = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
`;

export const CustomSwitch = styled(Switch).attrs(({ theme }) => ({
    trackColor: { false: theme.COLORS.GRAY_400, true: theme.COLORS.PINK_700 }, 
    thumbColor: theme.COLORS.WHITE,
  }))``;

export const Title = styled.Text`
    color: ${({theme}) => theme.COLORS.GRAY_400};
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
    margin-left: 10px;
`;