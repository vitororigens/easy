import { TouchableOpacity, View } from "react-native";
import { Button, Container, Icon, SubTitle, Title } from "./styles";
import { Popover, Tooltip } from 'react-native-popper';

type ItemNotesProps = {
    title: string;
    description: string;

}

export function ItemNotes({ description, title }: ItemNotesProps) {
    return (
        <Container>
            <View style={{
                flex: 1
            }}>
                <Title>
                    {title}
                </Title>
                <SubTitle>
                    {description ? (description.length > 25 ? description.substring(0, 25) + '...' : description) : ""}
                </SubTitle>
            </View>
            <View>
                <Popover
                    trigger={
                        <TouchableOpacity>
                            <Icon name="dots-three-horizontal" />
                        </TouchableOpacity>

                    }
                >
                    <Popover.Backdrop />
                    <Popover.Content>
                        <View style={{
                            minWidth: 90,
                            borderRadius: 5,
                            backgroundColor: '#fff',
                            maxHeight: 200,
                            top: -20,
                        }}>
                            <Button>
                                <Icon name="trash" />
                                <Title>Excluir</Title>
                            </Button>
                            <Button>
                                <Icon name="trash" />
                                <Title>Editar</Title>
                            </Button>
                        </View>
                    </Popover.Content>
                </Popover>

            </View>
        </Container>
    )
}