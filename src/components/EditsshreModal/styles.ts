import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'


export type ListItemStyleProps = 'PRIMARY' | 'SECONDARY'

type ListItemProps = {
    type?: ListItemStyleProps;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
`;


export const UserList = styled(FlatList)`
  // Optional: Add specific styling for FlatList if needed
`;

export const SharedUserContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-vertical: 10px;
`;

export const SharedUser = styled.View`
  margin-right: 10px;
`;

export const IconCheck = styled(MaterialCommunityIcons).attrs<ListItemProps>(({theme, type}) => ({
    color: type === 'PRIMARY' ?  theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800, 
    size: theme.FONT_SIZE.XL
}))`
    margin-right: 5px;
`;

export const Title = styled.Text<ListItemProps>`
    font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
    font-size: ${({theme}) => theme.FONT_SIZE.GG}px;
    color: ${({theme, type}) => type === 'PRIMARY' ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800 };
    text-decoration-line: ${({type}) => type === 'PRIMARY' ? 'line-through' :  'none'};
`;

export const ButtonSelect = styled(TouchableOpacity)`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;