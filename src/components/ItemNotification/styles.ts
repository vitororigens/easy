import styled, { css } from 'styled-components/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
export type IconProps = 'success' | 'danger';

type Props = {
  type: IconProps;
};

export const Container = styled.TouchableOpacity`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.GRAY_200};
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

export const Description = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 4px;
`;

export const Time = styled.Text`
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin-top: 4px;
`;

export const Icon = styled(AntDesign).attrs<Props>(({ theme }) => ({
  // color: type === "PRIMARY" ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700,
  size: theme.FONT_SIZE.LG,
}))`
  ${(props) =>
    props.type === 'success' &&
    css`
      color: ${({ theme }) => theme.COLORS.GREEN_700};
    `}

  ${(props) =>
    props.type === 'danger' &&
    css`
      color: ${({ theme }) => theme.COLORS.RED_700};
    `}
`;

export const Button = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
`;

export const PendingNotificationCircle = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.COLORS.RED_700};
  position: absolute;
  top: 12px;
  right: 12px;
`;
