import { View } from "react-native";
import { Button, Container, Title } from "./styles";

type IFinishTasksProps = {
    itemsCount: number;
    buttonSave: () => void;
}

export function FinishTasks({ itemsCount, buttonSave }: IFinishTasksProps) {
    return (
        <Container>
            <View>
                <Title>
                    Total de Tarefas: {itemsCount}
                </Title>
            </View>
            <View>
                <Button onPress={buttonSave}>
                    <Title style={{
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        Finalizar tarefas
                    </Title>
                </Button>
            </View>
        </Container>
    )
}