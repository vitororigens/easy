import styled, { css } from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TSharingStatus } from "../../services/firebase/sharing.firebase";

export type ItemProps = "PRIMARY" | "SECUNDARY";

type Props = {
  type: ItemProps;
};

export const Container = styled.View`
  width: 100%;
  height: 60px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  padding: 10px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
`;

interface IBadgeProps {
  status: TSharingStatus;
}

export const BadgeText = styled.Text<IBadgeProps>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;

  ${({ status, theme }) => css`
    ${status === "accepted" &&
    css`
      color: ${theme.COLORS.WHITE};
    `}
    ${status === "pending" &&
    css`
      background-color: ${theme.COLORS.YELLOW_700};
      color: ${theme.COLORS.GRAY_600};
    `}
        ${status === "rejected" &&
    css`
      color: ${theme.COLORS.WHITE};
    `}
  `}
`;

export const Badge = styled.View<IBadgeProps>`
  width: auto;
  padding-right: 8px;
  padding-left: 8px;
  padding-block: 2px;
  border-radius: 20px;

  ${({ status, theme }) => css`
    ${status === "accepted" &&
    css`
      background-color: ${theme.COLORS.GREEN_700};
    `}
    ${status === "pending" &&
    css`
      background-color: ${theme.COLORS.YELLOW_700};
      color: ${theme.COLORS.GRAY_600};
    `}
        ${status === "rejected" &&
    css`
      background-color: ${theme.COLORS.RED_700};
    `}
  `}
`;

export const Icon = styled(FontAwesome).attrs(({ theme }) => ({
  color: theme.COLORS.RED_700,
  size: theme.FONTE_SIZE.XL,
}))``;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
