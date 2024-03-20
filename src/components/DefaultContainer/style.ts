import styled from "styled-components/native";
import { ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Importe a imagem que você deseja usar como background
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
flex: 1;
flex-direction: row;
` ;

export const Button = styled(TouchableOpacity)``;

export const BackButton = styled(Ionicons).attrs(({ theme }) => ({
        color: theme.COLORS.WHITE,
        size: theme.FONTE_SIZE.XL,
}))`

margin-bottom: 30px;
`;
