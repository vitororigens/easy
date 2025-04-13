import { Image, Dimensions } from "react-native";
import styled from "styled-components/native";
import logo from "../../assets/favicon.png";

const { width } = Dimensions.get('window');
const logoSize = Math.min(width * 0.3, 120); // 30% da largura da tela, máximo de 120px

export const Container = styled(Image).attrs({
    source: logo,
    resizeMode: 'contain'
})`
    width: ${logoSize}px;
    height: ${logoSize}px;
`;