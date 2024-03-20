import { Text } from "react-native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Button, Container, Content, Divider, Header, LogoContainer, Title } from "./styles";
import { Logo } from "../../components/Logo";
import { useState } from "react";

export function Login() {
    const [activeButton, setActiveButton] = useState("Entrar");

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <DefaultContainer>
            <Container>
                <Header>
                    <Divider style={{ alignSelf: activeButton === "Entrar" ? "flex-start" : "flex-end" }} />
                    <Content>
                        <Button onPress={() => handleButtonClick("Entrar")}>
                            <Title>
                                Entrar
                            </Title>
                        </Button>
                        <Button onPress={() => handleButtonClick("Inscrever-se")}>
                            <Title>
                                INSCREVER-SE
                            </Title>
                        </Button>
                    </Content>
                </Header>
            </Container>
            <LogoContainer>
                <Logo />
            </LogoContainer>
        </DefaultContainer>
    )
}