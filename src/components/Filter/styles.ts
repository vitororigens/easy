import { TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}

export const ContainerMonth = styled.View`
  width: 80%;
  height: 100%;
  margin: 40px auto 16px auto;
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  border: 2px solid;
  border-radius: 12px;
  border-color: ${({theme}) => theme.COLORS.TEAL_600};
  flex-direction: column;
  position: relative;
`;

export const Label = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    position: absolute;
    top: -25px;
`;

export const MonthSelectorButton = styled(TouchableOpacity)`
    padding: 12px;
    border-width: 1px;
    border-color: #E0E0E0;
    border-radius: 8px;
    background-color: white;
`;

export const MonthSelectorText = styled(Label)`
    color: #000000;
    position: static;
`;

export const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

export const ModalContainer = styled.View`
    background-color: white;
    border-radius: 12px;
    width: 80%;
    max-height: 70%;
    padding: 20px;
`;

export const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const MonthItem = styled(TouchableOpacity)<{ selected: boolean }>`
    padding: 16px;
    border-bottom-width: 1px;
    border-bottom-color: #E0E0E0;
    background-color: ${({ selected }) => selected ? '#F0F0F0' : 'white'};
`;

export const MonthItemText = styled.Text<{ selected: boolean }>`
    color: ${({ selected }) => selected ? '#007AFF' : '#000000'};
    font-size: 16px;
    font-weight: ${({ selected }) => selected ? '600' : '400'};
`;

export const CancelButton = styled(TouchableOpacity)`
    margin-top: 20px;
    padding: 12px;
    background-color: #F0F0F0;
    border-radius: 8px;
    align-items: center;
`;

export const CancelButtonText = styled.Text`
    color: #666666;
`;

export const Content = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;

`;

export const NavBar = styled.View`
    width: 100%;
    min-height: 60px;
    max-height: 80px;
    flex-direction: row;
    justify-content: space-between;

`;

type ButtonProps = {
    active: boolean
}

export const ButtonBar = styled(TouchableOpacity)<ButtonProps>`
    align-items: center;
    justify-content: center;
    width: 50%;
    border-top-width: 4px;
    border-top-style: solid;
   background-color: ${({theme}) => theme.COLORS.WHITE};
    border-top-color: ${({theme, active}) => !active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

type DividerProps = {
    active: boolean
}

export const Divider = styled.View<DividerProps>`
    width: 50%;
    height: 4px;
    background-color: ${({theme, active}) => active ? theme.COLORS.TEAL_600 : theme.COLORS.GRAY_300};
`;

export const SubTitle = styled.Text<Props>`
    font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    color: ${({ theme, type }) => type === 'PRIMARY'
    ? theme.COLORS.TEAL_600
    : theme.COLORS.PURPLE_800};
`;

export const DividerTask = styled.View`
    width: 2px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_400};
    margin-left: 10px;
    margin-right:10px;
`;

export const Input = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.COLORS.GRAY_400,
}))`
    flex: 1;

    min-height: 40px;
    max-height: 40px;


    color: ${({ theme }) => theme.COLORS.GRAY_600};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    border-bottom-width: 2px; 
    border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_800};
    margin-bottom: 15px;
`;

export const TitleTask = styled.Text`
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    color: ${({theme}) => theme.COLORS.GRAY_600};
`;

export const InputDescription = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.COLORS.GRAY_400,
}))`
    flex: 1;
    min-height: 90px;
    max-height: 90px;
    color: ${({ theme }) => theme.COLORS.GRAY_600};
    background-color: ${({theme}) => theme.COLORS.GRAY_300};
    font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
    margin-bottom: 15px;
`;

export const ButtonClose = styled(TouchableOpacity)`
    height: 40px;
    padding: 10px;
`;
