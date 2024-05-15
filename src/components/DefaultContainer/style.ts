import styled from "styled-components/native";
import { ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import backgroundImage from "../../assets/background.png";

export const Container = styled(SafeAreaView)`
        flex: 1;
        padding: 20px;
`;


export const Background = styled(ImageBackground).attrs({
        source: backgroundImage,
        resizeMode: "cover",
})`
        flex: 1;
 `;

export const Header = styled.View`
        width: 100%;
        flex-direction: row;
        justify-content: space-evenly;

` ;

export const Button = styled(TouchableOpacity)`
        height: 100%;
        align-items: end;
        justify-content: center;
        width: 27%;
        padding: 10px;

`;
export const ContainerMonth = styled.View`
        width: 40%;
        height: 100%;
`;

export const Title = styled.Text`
        color: ${({theme}) => theme.COLORS.WHITE};
        font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
        font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
        margin-right: 10px;
        margin-left: 10px;
`;

export const Icon = styled(Ionicons).attrs(({ theme }) => ({
        color: theme.COLORS.WHITE,
        size: theme.FONTE_SIZE.XL,
}))``;
