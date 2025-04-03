import { Image, Dimensions } from "react-native";
import styled from "styled-components/native";

const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.XL}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.PURPLE_600};
  text-align: center;
  //margin-top: 20px;
  height: ${windowHeight * 0.1}px;
`;

export const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.TEAL_600};
  text-align: center;
  padding-right: 12px;
  padding-left: 12px;
`;

export const StyledImage = styled(Image)`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  align-self: center;
`;
