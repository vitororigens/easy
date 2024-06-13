import styled from "styled-components/native";
import { Entypo } from '@expo/vector-icons';

export type ItemsTypeStyleProps = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

type Props = {
    type?: ItemsTypeStyleProps;
}

export const Container = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
`;

export const Icon = styled.View<Props>`
    width: 13%;
    height: 45px;
    background-color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.GREEN_700
        : type === 'SECONDARY'
            ? theme.COLORS.RED_700
            : theme.COLORS.YELLOW_700};
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-right: 10px;
`;

export const Title = styled.Text<Props>`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
    color: ${({ theme, type }) => type === 'PRIMARY'
        ? theme.COLORS.GREEN_700
        : type === 'SECONDARY'
            ? theme.COLORS.RED_700
            : theme.COLORS.YELLOW_700};
`;


export const SubTitle = styled.Text`
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
    color: ${({ theme }) => theme.COLORS.GRAY_400};

`;

export const Divider = styled.View`
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400};
`;


export const Content = styled.View`
    flex: 1;
    height: 60px;
    justify-content: center;
`;

export const ContentItems = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;


export const IconMenu = styled(Entypo).attrs<Props>(({ theme, type }) => ({
    color: type === 'PRIMARY'
        ? theme.COLORS.GREEN_700
        : type === 'SECONDARY'
            ? theme.COLORS.RED_700
            : theme.COLORS.YELLOW_700,
    size: theme.FONTE_SIZE.XL,
}))``;

export const ContainerMenu = styled.View`
  min-width: 70px;
  border-radius: 5px;
  background-color: #fff;
  max-height: 200px;
  top: -20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;