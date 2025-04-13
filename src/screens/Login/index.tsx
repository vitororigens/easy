import React, { useState } from "react";
import { ScrollView } from "react-native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Logo } from "../../components/Logo";
import { SingIn } from "../SingIn";
import { SingUp } from "../SingUp";
import {
    Button,
    Container,
    Header,
    LogoContainer,
    NavBar,
    Title,
} from "./styles";

export function Login() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <DefaultContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Container>
          <Header>
            <NavBar>
              <Button
                onPress={() => handleButtonClick("Entrar")}
                active={activeButton !== "Entrar"}
                style={{ borderTopLeftRadius: 40 }}
              >
                <Title>Entrar</Title>
              </Button>
              <Button
                onPress={() => handleButtonClick("Inscrever-se")}
                active={activeButton !== "Inscrever-se"}
                style={{ borderTopRightRadius: 40 }}
              >
                <Title>Inscrever-se</Title>
              </Button>
            </NavBar>
        
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
