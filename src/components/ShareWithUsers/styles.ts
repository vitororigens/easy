import { TouchableOpacity, Dimensions } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

type ListItemProps = {
  type?: "primary" | "secondary";
};

export const Title = styled.Text<ListItemProps>`
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
  color: ${({ theme, type }) =>
    type === "primary" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800};
  text-decoration-line: ${({ type }) =>
    type === "primary" ? "line-through" : "none"};
`;

export const SectionTitle = styled(Title)`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  margin-bottom: 10px;
`;

export const CircleContainer = styled(TouchableOpacity)`
  height: 50px;
  width: 50px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_400};
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  margin: 5px;
  position: relative;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const Plus = styled(FontAwesome).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONTE_SIZE.GG,
}))``;

export const Remove = styled(AntDesign).attrs(({ theme }) => ({
  color: theme.COLORS.WHITE,
  size: theme.FONTE_SIZE.SM,
}))`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: ${({ theme }) => theme.COLORS.RED_700};
  padding: 2px;
  border-radius: 8px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const TextCircle = styled.Text`
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: ${width}px;
  padding: 20px;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const ButtonSelect = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin-vertical: 4px;
`;

export const IconCheck = styled(MaterialCommunityIcons).attrs<ListItemProps>(
  ({ theme, type }) => ({
    color: type === "primary" ? theme.COLORS.TEAL_600 : theme.COLORS.PURPLE_800,
    size: theme.FONTE_SIZE.XL,
  })
)`
  margin-right: 5px;
`;

export const FavoriteButton = styled(TouchableOpacity)`
  margin-right: 8px;
  padding: 4px;
`;

export const FavoriteIcon = styled(MaterialCommunityIcons)<{ type: "primary" | "secondary" }>`
  color: ${({ theme, type }) =>
    type === "primary" ? theme.COLORS.YELLOW_700 : theme.COLORS.GRAY_600};
  font-size: 24px;
`;

export const ActionButton = styled(TouchableOpacity)`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_300};
  margin-horizontal: 4px;
`;

export const ActionButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.PURPLE_800};
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};
  font-size: ${({ theme }) => theme.FONTE_SIZE.SM}px;
`;

export const FavoritesContainer = styled.View`
  margin-vertical: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_50};
  border-radius: 10px;
`;

export const FavoritesList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ActionButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CloseButton = styled(TouchableOpacity)`
  width: 100%;
  padding: 15px;
  background-color: ${({ theme }) => theme.COLORS.PURPLE_600};
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;

export const CloseButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.WHITE};
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
  font-size: ${({ theme }) => theme.FONTE_SIZE.GG}px;
`;
