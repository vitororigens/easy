import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";

export function Marketplace() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <DefaultContainer monthButton>
      <Container type="SECONDARY" title="Mercado">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "concluidos" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("concluidos")}>
                <Title>
                  Concluidos
                </Title>
              
              </Button>
              <Button style={{
                right: 20
              }} onPress={() => handleButtonClick("pendentes")}>
                <Title>
                  Pendentes
                </Title>
              
              </Button>
            </NavBar>
          </Header>
          {activeButton === "concluidos" && <Title>teste2</Title>}
          {activeButton === "pendentes" && <Title >teste1</Title>}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
