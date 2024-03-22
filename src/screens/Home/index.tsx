import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";

export function Home() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <DefaultContainer monthButton>
      <Container type="PRIMARY" name="file-invoice-dollar" title="R$ 4.793">
        <Content>
          <Header>
            <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
            <NavBar>
              <Button onPress={() => handleButtonClick("receitas")}>
                <Title>
                  Receitas
                </Title>
                <SubTitle type="PRIMARY">
                  R$: 8.350
                </SubTitle>
              </Button>
              <Button style={{
                right: 20
              }} onPress={() => handleButtonClick("despesas")}>
                <Title>
                  Despesas
                </Title>
                <SubTitle type="SECONDARY">
                  R$: 3.557
                </SubTitle>
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
