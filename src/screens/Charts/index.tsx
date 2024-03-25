import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title, NavBar, SubTitle } from "./styles";
import { useState } from "react";
import { database } from "../../services";

export function Charts() {
  const [activeButton, setActiveButton] = useState("Entrar");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };



  database
  .collection('Users')
  .doc('123456')
  .set({
    name: 'Ada Lovelace',
    age: 30,
  })
  .then(() => {
    console.log('User added!');
  })
  .catch(error => {
    console.error('Error adding user: ', error);
  });

  
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
              <Button onPress={() => handleButtonClick("despesas")}>
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
