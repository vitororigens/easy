import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 20px;
  padding: 16px;
  margin: 16px;
`;

export const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

export const ContentTitle = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin-left: 16px;
`;

export const Icon = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  margin-right: 8px;
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: 14px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-top: 8px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const SectionIcon = styled.View<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`; 