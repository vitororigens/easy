import { View } from "react-native";
import { Button, Container, Content, Icon, Span, SubTitle, Title } from "./styles";

type ItemNotificationProps = {
    title: string;
    subtitle: string;
    span: string;
}

export function ItemNotification({ span, subtitle, title }: ItemNotificationProps) {
    return (
        <Container>
            <Title>{title}</Title>
            <SubTitle>{subtitle}</SubTitle>
            <Content>
                <Span>{span}</Span>
                <View style={{ flexDirection: 'row' }}>
                    <Button>
                        <SubTitle>Aprovar</SubTitle>
                        <Icon type="PRIMARY" name="check" />
                    </Button>
                    <Button>
                        <SubTitle>Reprovar</SubTitle>
                        <Icon type="SECUNDARY" name="close" />
                    </Button>
                </View>
            </Content>
        </Container>
    )
}