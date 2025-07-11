import styled, { css } from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TSharingStatus } from "../../services/firebase/sharing.firebase";

export type ItemProps = "PRIMARY" | "SECUNDARY";

type Props = {
  type: ItemProps;
};

type ActionButtonProps = {
  type: 'accept' | 'reject' | 'delete';
};

type StatusProps = {
  status: TSharingStatus;
};

export const Container = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.GRAY_200};
  background-color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  color: ${({ theme }) => theme.COLORS.GRAY_400};
  margin-bottom: 8px;
`;

export const Status = styled.Text<StatusProps>`
  font-size: 12px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;

  ${({ status, theme }) => {
    switch (status) {
      case 'accepted':
        return css`
          background-color: ${theme.COLORS.GREEN_700};
          color: ${theme.COLORS.WHITE};
        `;
      case 'rejected':
        return css`
          background-color: ${theme.COLORS.RED_700};
          color: ${theme.COLORS.WHITE};
        `;
      case 'pending':
        return css`
          background-color: ${theme.COLORS.YELLOW_700};
          color: ${theme.COLORS.GRAY_600};
        `;
      default:
        return css`
          background-color: ${theme.COLORS.GRAY_400};
          color: ${theme.COLORS.WHITE};
        `;
    }
  }}
`;

export const Actions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'accept':
        return theme.COLORS.GREEN_700;
      case 'reject':
        return theme.COLORS.RED_700;
      case 'delete':
        return theme.COLORS.RED_700;
      default:
        return theme.COLORS.GRAY_400;
    }
  }};
`;

export const ActionText = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

interface IBadgeProps {
  status: TSharingStatus;
}

export const BadgeText = styled.Text<IBadgeProps>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;

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
  size: theme.FONT_SIZE.XL,
}))``;
