import { View } from "react-native";
import { Button, Title,Container } from "./styles";

type ICartProps = {
    itemsCount: number;
    totalValue: string;
    buttonSave: () => void;
}

export function Cart({ itemsCount, totalValue, buttonSave }: ICartProps) {
    return (
        <Container>
            <View>
                <Title>
                    Itens: {itemsCount}
                </Title>
                <Title>
                    Valor Total: {totalValue}
                </Title>
            </View>
            <View>
                <Button onPress={buttonSave}>
                    <Title>
                        Criar Lista
                    </Title>
                </Button>
            </View>
        </Container>
    )
}