import React, { useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Button, Container, Content, Divider, Header, LogoContainer, Title } from "./styles";
import { Logo } from "../../components/Logo";
import { SingIn } from "../SingIn";
import { SingUp } from "../SingUp";
import { ScrollView } from "react-native";

export function Login() {
    const [activeButton, setActiveButton] = useState("Entrar");

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <DefaultContainer>
            <ScrollView showsVerticalScrollIndicator  >
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
                    {activeButton === "Entrar" && <SingIn />}
                    {activeButton === "Inscrever-se" && <SingUp />}
                </Container>
                <LogoContainer>
                    <Logo />
                </LogoContainer>
            </ScrollView>
        </DefaultContainer>
    );
}
