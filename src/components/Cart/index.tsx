import { View } from "react-native";
import { Button, Container, Title } from "./styles";

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
                    <Title style={{
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        Criar lista de compras
                    </Title>
                </Button>
            </View>
        </Container>
    )
}