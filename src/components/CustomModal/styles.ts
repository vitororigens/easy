
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export type ButtonTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: ButtonTypeStyleProps;
}

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

`;

export const ModalContainer = styled.View`
    background-color: ${({theme}) => theme.COLORS.WHITE};
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    height: 200px;
    align-items: center;
    justify-content: space-around;
`;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
    color: ${({theme}) => theme.COLORS.GRAY_600};
`;

export const Button = styled(TouchableOpacity)<Props>`
 background-color: ${({theme, type}) => type === 'PRIMARY'
    ? theme.COLORS.GREEN_700
    : theme.COLORS.RED_700};
    width: 100px;
    height: 30px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`;

export const TitleButton = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
    color: ${({theme}) => theme.COLORS.WHITE};
`;

export const ContainerButton =styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`;
