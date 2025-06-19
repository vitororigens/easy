import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)`
min-height: 60px;
max-height: 60px;
background-color: ${({theme}) => theme.COLORS.PURPLE_800};
width: 100%;
border-bottom-width: 5px; 
border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_600};
align-items: center;
justify-content: center;
`;

export const Title = styled.Text`
font-size: ${({theme}) => theme.FONT_SIZE.GG}px;
font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
color: ${({theme}) => theme.COLORS.WHITE};


`;