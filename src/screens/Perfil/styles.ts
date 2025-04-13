import { TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const GradientBackground = styled(LinearGradient)`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 200px;
`;

export const Content = styled.View`
    flex: 1;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    margin-top: 120px;
    shadow-color: #000;
    shadow-offset: 0px -2px;
    shadow-opacity: 0.1;
    shadow-radius: 3px;
    elevation: 5;
`;

export const ContentItems = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    padding: 20px;
    border-radius: 15px;
    margin: 15px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 3px;
    elevation: 2;
`;

export const Header = styled.View`
    width: 100%;
    align-items: center;
    margin-top: -50px;
    margin-bottom: 20px;
`;

export const ImageContainer = styled(TouchableOpacity)`
    height: 120px;
    width: 120px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.COLORS.GRAY_200};
    border-radius: 60px;
    border-width: 4px;
    border-color: ${({ theme }) => theme.COLORS.WHITE};
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 5px;
    elevation: 5;
`;

export const StyledImage = styled(Image)`
    height: 112px;
    width: 112px;
    border-radius: 56px;
`;

export const ContainerIcon = styled(TouchableOpacity)`
    width: 36px;
    height: 36px;
    background-color: ${({theme}) => theme.COLORS.PURPLE_600};
    border-radius: 18px;
    position: absolute;
    align-items: center;
    justify-content: center;
    bottom: -5px;
    right: -5px;
    border-width: 2px;
    border-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Icon = styled(FontAwesome).attrs(({theme}) => ({
    color: theme.COLORS.WHITE,
    size: 16,
}))``;

export const Items = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 0;
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme }) => theme.COLORS.GRAY_200};
`;

export const ItemContent = styled.View`
    flex: 1;
    margin-left: 15px;
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({ theme }) => theme.COLORS.GRAY_400};
    margin-bottom: 2px;
`;

export const SubTitle = styled.Text<Props>`
    font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.TEAL_600
        : theme.COLORS.PURPLE_800};
`;

export const IconField = styled(MaterialIcons).attrs(({theme}) => ({
    size: 24,
    color: theme.COLORS.PURPLE_600
}))``;

export const ButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
`;

export const ActionButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: 12px 20px;
    background-color: ${({ theme }) => theme.COLORS.PURPLE_600};
    border-radius: 25px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 3px;
    elevation: 3;
`;

export const ButtonText = styled.Text`
    font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.WHITE};
    margin-left: 8px;
`;
