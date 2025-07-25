import styled from "styled-components/native";

export type ItemsTypeStyleProps = "primary" | "secondary" | "tertiary";

type Props = {
  type?: ItemsTypeStyleProps;
};

export const Container = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

export const Icon = styled.View<Props>`
  width: 13%;
  height: 45px;
  background-color: ${({ theme, type }) =>
    type === "primary"
      ? theme.COLORS.GREEN_700
      : type === "secondary"
      ? theme.COLORS.RED_700
      : theme.COLORS.YELLOW_700};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 10px;
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

export const Title = styled.Text<Props>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.LG}px;
  color: ${({ theme, type }) =>
    type === "primary"
      ? theme.COLORS.GREEN_700
      : type === "secondary"
      ? theme.COLORS.RED_700
      : theme.COLORS.YELLOW_700};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.GRAY_400};
`;

export const Separator = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
`;
