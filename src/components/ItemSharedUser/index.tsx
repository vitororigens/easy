import { Container, Content, Icon, Item, ItemProps, Span, Title } from "./styles";

type ItemSharedUserProps = {
    title: string;
    span: string;
    type: ItemProps;
}


export function ItemSharedUser({span, title, type}: ItemSharedUserProps) {
    return (
        <Container>
            <Title>{title}</Title>
            <Content>
                <Item type={type}>
                    <Span>{span}</Span>
                </Item>
                <Icon name="trash-o" />
            </Content>
        </Container>
    )
}