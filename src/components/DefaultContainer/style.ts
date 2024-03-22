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
        align-items: center;
        height: 60px;
` ;

export const Button = styled(TouchableOpacity)`
        height: 100%;
        width: 35%;
        margin-top: 30px;

`;

export const BackButton = styled(Ionicons).attrs(({ theme }) => ({
        color: theme.COLORS.WHITE,
        size: theme.FONTE_SIZE.XL,
}))`

margin-bottom: 30px;
`;

export const ContainerMonth = styled.View`
        width: 160px;
        height: 100%;

`;