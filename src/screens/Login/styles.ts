import { TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { height } = Dimensions.get('window');

export const Container = styled.View`
    flex: 1;
    margin-top: ${Math.min(height * 0.02, 10)}px;
`;

export const LogoContainer = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-vertical: ${Math.min(height * 0.02, 20)}px;
    min-height: ${Math.min(height * 0.15, 100)}px;
`;

export const Header = styled.View`
    width: 100%;
`;

export const Content = styled.View`
    width: 100%;
    height: ${Math.min(height * 0.08, 60)}px;
    flex-direction: row;
    justify-content: space-between;
    padding-horizontal: ${Math.min(height * 0.03, 25)}px;
    padding-top: ${Math.min(height * 0.015, 10)}px;
`;

type ButtonProps = {
    active: boolean
}

export const NavBar = styled.View`
    width: 100%;
    height: ${Math.min(height * 0.08, 60)}px;
    flex-direction: row;
    justify-content: space-between;
`;

export const Button = styled(TouchableOpacity)<ButtonProps>`
    align-items: center;
    justify-content: center;
    width: 50%;
    border-top-width: 4px;
    border-top-style: solid;
    border-top-color: ${({theme, active}) => !active ? theme.COLORS.TEAL_600 : 'transparent'};
`;

export const Title = styled.Text`
    font-size: ${({theme}) => theme.FONT_SIZE.GG}px;
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    text-align: center;
    padding-horizontal: ${Math.min(height * 0.02, 15)}px;
`;

export const Divider = styled.View`
    width: 50%;
    height: 4px;
    background-color: ${({theme}) => theme.COLORS.TEAL_600};
`;
