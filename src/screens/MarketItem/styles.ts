import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export type subTitleTypeStyleProps = "PRIMARY" | "SECONDARY";

type Props = {
  type: subTitleTypeStyleProps;
};

export const Content = styled.View`
  flex: 1;
  /* background-color: ${({ theme }) => theme.COLORS.WHITE}; */
  padding: 20px;
  margin-bottom: 150px;
`;

export const Header = styled.View`
  width: 100%;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
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

export const ButtonPlus = styled(TouchableOpacity)`
  height: 60px;
  width: 60px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
`;

export const Plus = styled(FontAwesome).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONT_SIZE.GG,
}))``;

export const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Separator = styled.View`
  width: 100%;
  height: 1px;
  margin-top: 4px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
`;
