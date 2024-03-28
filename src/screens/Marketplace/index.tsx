import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";
import { LoadData } from "../../components/LoadData";

export function Marketplace() {
  const [activeButton, setActiveButton] = useState("concluidos");

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
              <Button  onPress={() => handleButtonClick("pendentes")}>
                <Title>
                  Pendentes
                </Title>
              
              </Button>
            </NavBar>
          </Header>
          {activeButton === "concluidos" && <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui!' />}
          {activeButton === "pendentes" && <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui!' />}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
