import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.LG}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const ContentTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const Icon = styled.View`
  margin-left: 10px;
`;

export const DividerContent = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.COLORS.TEAL_600};
  margin: 0 10px;
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.MD}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  margin-top: 5px;
`; 