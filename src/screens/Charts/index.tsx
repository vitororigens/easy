import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";

export function Charts() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <DefaultContainer monthButton>
      <Container type="SECONDARY" title="ANÁLISE GRÁFICA">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("receitas")}>
                <Title>
                  Receitas
                </Title>
              
              </Button>
              <Button style={{
                right: 20
              }} onPress={() => handleButtonClick("despesas")}>
                <Title>
                  Despesas
                </Title>
              
              </Button>
            </NavBar>
          </Header>
          {activeButton === "receitas" && <Title>teste2</Title>}
          {activeButton === "despesas" && <Title >teste1</Title>}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
