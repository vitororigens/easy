import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle, ContainerItems, HeaderItems, TitleItems } from "./styles";
import { useState } from "react";
import { Items } from "../../components/Items";

export function Home() {
  const [activeButton, setActiveButton] = useState("receitas");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <DefaultContainer addButton monthButton>
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
              <Button  onPress={() => handleButtonClick("despesas")}>
                <Title>
                  Despesas
                </Title>
                <SubTitle type="SECONDARY">
                  R$: 3.557
                </SubTitle>
              </Button>
            </NavBar>
          </Header>
          {activeButton === "receitas" &&
            <ContainerItems>
              <HeaderItems type="PRIMARY">
                <TitleItems>
                  Histórico
                </TitleItems>

              </HeaderItems>
              <Items />
            </ContainerItems>
          }
          {activeButton === "despesas" &&
            <ContainerItems>
              <HeaderItems type="SECONDARY">
                <TitleItems>
                  Histórico
                </TitleItems>

              </HeaderItems>
              <Items />
            </ContainerItems>}
        </Content>
      </Container>
    </DefaultContainer>
  );
}
