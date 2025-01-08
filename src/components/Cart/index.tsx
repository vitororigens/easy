import { View } from "react-native";
import {
  Button,
  CartInfoContainer,
  Container,
  Separator,
  Title,
} from "./styles";
import { IMarket } from "../../services/firebase/market.firebase";
import { formatPrice } from "../../utils/price";
import { ShareWithUsers } from "../ShareWithUsers";

type ICartProps = {
  selectedItems: IMarket[];
  buttonSave: () => void;
};

export function Cart({ selectedItems, buttonSave }: ICartProps) {
  const totalItems = selectedItems.reduce(
    (total, item) => total + (item.quantity ?? 0),
    0
  );
  const totalValue = selectedItems.reduce(
    (total, item) => total + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );

  return (
    <Container>
      <CartInfoContainer>
        <View>
          <Title>Itens: {totalItems}</Title>
          <Title>Valor Total: {formatPrice(totalValue)}</Title>
        </View>
        <View>
          <Button onPress={buttonSave}>
            <Title
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              Finalizar carrinho de compras
            </Title>
          </Button>
        </View>
      </CartInfoContainer>
      <Separator />
      <ShareWithUsers />
    </Container>
  );
}
