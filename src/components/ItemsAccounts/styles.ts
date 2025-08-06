import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export type ItemsTypeStyleProps = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

type Props = {
  type?: ItemsTypeStyleProps;
};

export const Container = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* Distribui os itens ao longo do eixo principal */
  padding-left: 10px;
  padding-right: 10px;
  /* margin-left: -6px; */
`;

export const Button = styled(TouchableOpacity)<Props>`
  width: 13%;
  height: 45px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 4px;
  margin-right: 6px;
`;

export const ButtonPoppover = styled(TouchableOpacity)`
  flex-direction: row;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  padding: 5px;
  justify-content: start;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const Title = styled.Text<Props>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme, type }) =>
    type === 'SECONDARY' ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_600};
  text-decoration-line: ${({ type }) =>
    type === 'SECONDARY' ? 'line-through' : 'none'};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Divider = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Content = styled.View`
  width: 80%; /* Ajuste o tamanho conforme necessário */
  padding: 10px 20px 10px 0px;
  height: 45px; /* Ajuste a altura conforme necessário */
`;

export const ContentItems = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled(MaterialCommunityIcons).attrs(({ theme }) => ({
  color: theme.COLORS.TEAL_600,
  size: theme.FONT_SIZE.XL,
}))``;

export const IconMenu = styled(Entypo).attrs<Props>(({ theme, type }) => ({
  color:
    type === 'PRIMARY'
      ? theme.COLORS.TEAL_600
      : type === 'SECONDARY'
        ? theme.COLORS.RED_700
        : theme.COLORS.YELLOW_700,
  size: theme.FONT_SIZE.XL,
}))``;
