import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONTE_SIZE.XL}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 24px;
`;

export const List = styled.FlatList`
  flex: 1;
`;

export const ItemContainer = styled.View`
  background-color: ${({theme}) => theme.COLORS.GRAY_300};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const ItemTitle = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
  font-size: ${({theme}) => theme.FONTE_SIZE.LG}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 8px;
`;

export const ItemValue = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_600};
  margin-bottom: 4px;
`;

export const ItemDate = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.SM}px;
  color: ${({theme}) => theme.COLORS.GRAY_400};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const EmptyText = styled.Text`
  font-family: ${({theme}) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({theme}) => theme.FONTE_SIZE.MD}px;
  color: ${({theme}) => theme.COLORS.GRAY_400};
  text-align: center;
  margin-top: 8px;
`; 