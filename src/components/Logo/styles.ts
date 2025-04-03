import { Image } from "react-native";
import styled from "styled-components/native";
import logo from "../../assets/favicon.png";

export const Container = styled(Image).attrs({
    source:logo
})`
    width:120px;
`