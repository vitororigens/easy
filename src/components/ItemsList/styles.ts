import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export type ItemsTypeStyleProps = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

type Props = {
    type?: ItemsTypeStyleProps;
}

export const Container = styled.View`
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 8px;
    margin-bottom: 8px;
    elevation: 2;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.15;
    shadow-radius: 2.84px;
`;

export const Icon = styled(TouchableOpacity)<Props>`
    width: 13%;
    height: 45px;
    background-color: ${({theme, type}) => type === 'PRIMARY'
    ? theme.COLORS.GREEN_700
    : type === 'SECONDARY'
      ? theme.COLORS.RED_700
      : theme.COLORS.YELLOW_700};
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin: 10px;
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
    margin-bottom: 4px;
`;

export const Description = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const Actions = styled.View`
    flex-direction: row;
    margin-left: 8px;
`;

export const ActionButton = styled(TouchableOpacity)`
    padding: 8px;
    margin-left: 4px;
`;

export const PopoverContainer = styled.View`
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 8px;
    padding: 8px;
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
`;

export const PopoverItem = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: 8px;
`;

export const PopoverItemText = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({ theme }) => theme.COLORS.GRAY_600};
    margin-left: 8px;
`;

export const PopoverDivider = styled.View`
    height: 1px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_200};
    margin: 4px 0;
`;

export const SubTitle = styled.Text`
    font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
    font-size: ${({theme}) => theme.FONT_SIZE.SM}px;
    color: ${({theme}) => theme.COLORS.GRAY_400};

`;

export const Divider = styled.View`
    width: 100%;
    height: 2px;
    background-color: ${({theme}) => theme.COLORS.GRAY_400};
`;

export const ContentItems = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;
