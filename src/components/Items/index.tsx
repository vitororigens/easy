import { Container, Content, ContentItems, Divider, Icon, SubTitle, Title } from "./styles";
import { AntDesign } from '@expo/vector-icons';

export function Items(){
    return(
        <Container>
            <Icon>
            <AntDesign name="infocirlce" size={24} color="white" />
            </Icon>
            <Content>
                <ContentItems>
                    <Title type="SECONDARY">
                        Mercado
                    </Title>
                    <Title type="SECONDARY">
                        R$: 437
                    </Title>
                </ContentItems>
                <Divider/>
                <ContentItems>
                <SubTitle>
                        8 de março de 2024
                    </SubTitle>
                    <SubTitle>
                        Despesa variável
                    </SubTitle>
                </ContentItems>
            </Content>
        </Container>
    )
}