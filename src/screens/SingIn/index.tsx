import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Input } from "../../components/Input";
import { Container, Content, ContentIcon, Divider, Span, SubTitle, Text, Title } from "./styles";

export function SingIn() {
    return (
        <Container>
            <Title>
                Entre e faça o controle de suas <Span>finanças pessoais</Span>.
            </Title>
            <Input name="envelope" showIcon placeholder="Email" />
            <Input name="lock" showIcon  placeholder="Senha" passwordType />
            <Button title={'Entrar'} />
            <Text>
                Esqueceu a senha?
            </Text>
            <Content>
                <Divider />
                <SubTitle>
                    Conect-se
                </SubTitle>
                <Divider />
            </Content>
            <ContentIcon>
                <ButtonIcon name="microsoft" color="#00a1f1" />
                <ButtonIcon name="apple" color="#7200b5" />
                <ButtonIcon name="google" color="#dc3c2a" />
                <ButtonIcon name="facebook" color="#0863f7" />
            </ContentIcon>
        </Container>
    )
}