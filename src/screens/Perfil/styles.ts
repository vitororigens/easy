import { TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}


export const Content = styled.View`
    flex: 1;
    border-top-width: 4px;
    border-top-color: ${({ theme }) => theme.COLORS.TEAL_600};
    border-top-style: solid;
    border-radius: 40px;
`;


export const ContentItems = styled.View`
 flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 20px;
`;


export const Header = styled.View`
    width: 100%;
    align-items: center;
    padding: 30px;
`;

export const NavBar = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 25px;
    padding-top: 10px;
`;

export const ButtonIcon = styled(TouchableOpacity)``;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const Divider = styled.View`
    width: 100%;
    height: 4px;
    background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;


export const SubTitle = styled.Text<Props>`
font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
`;

export const Items = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    align-items: center;
`;


export const ImageContainer = styled(TouchableOpacity)`
    height: 100px;
    width: 100px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400} ;
    border-radius: 100px;

`;

export const StyledImage = styled(Image)`
    height: 100px;
    width: 100px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400} ;
    border-radius: 100px;
`;

