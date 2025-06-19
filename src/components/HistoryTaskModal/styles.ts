import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export type subTitleTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = {
    type: subTitleTypeStyleProps;
}

export const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const Content = styled.View`
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  max-height: 80%;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const GroupName = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.XL}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.TEAL_600};
  margin-bottom: 8px;
`;

export const CloseButton = styled(TouchableOpacity)`
  padding: 8px;
`;

export const TaskItem = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const TaskName = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-bottom: 4px;
`;

export const TaskDate = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Divider = styled.View`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
`;

export const ButtonClose = styled(TouchableOpacity)`
  height: 40px;
  padding: 10px;
`;

export const Input = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.COLORS.GRAY_400
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

export const Button = styled(TouchableOpacity)`
  flex: 1;
  min-height: 60px;
  max-height: 60px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  width: 100%;
  border-bottom-width: 5px; 
  border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_800};
  align-items: center;
  justify-content: center;
`;


export const Span = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;
