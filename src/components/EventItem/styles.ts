import styled from "styled-components/native";
import AntDesign from '@expo/vector-icons/AntDesign';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_200};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};
`;

export const Content = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  margin-bottom: 4px;
`;

export const Time = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Icon = styled(AntDesign)`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-left: 16px;
`;

export const ShareIcon = styled(AntDesign)`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.PURPLE_600};
  margin-left: 8px;
`;