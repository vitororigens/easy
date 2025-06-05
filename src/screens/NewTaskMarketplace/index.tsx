import React, { useState } from "react";
//
import {
  ButtonBar,
  ButtonClose,
  Content,
  Divider,
  Header,
  NavBar,
  Title,
} from "./styles";
//
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { NewItemTask } from "../NewItemTask";

type Props = {
  closeBottomSheet?: () => void;
};

export function NewTaskMarketplace({ closeBottomSheet }: Props) {
  const [activeButton, setActiveButton] = useState("receitas");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer hasHeader={false}>
        <ButtonClose
          onPress={closeBottomSheet}
          style={{ alignSelf: "flex-end", marginBottom: 32 }}
        >
          <Title style={{ color: "white" }}>Fechar</Title>
        </ButtonClose>
        <Container type="SECONDARY" title="Adicionar Lançamento">
          <Content>
            <Header>
              <Divider
                style={{
                  alignSelf:
                    activeButton === "receitas" ? "flex-start" : "flex-end",
                }}
              />
              <NavBar>
                <ButtonBar onPress={() => handleButtonClick("receitas")}>
                  <Title>Nova Tarefa</Title>
                </ButtonBar>
                <ButtonBar onPress={() => handleButtonClick("despesas")}>
                  <Title>Adicione item de compra</Title>
                </ButtonBar>
              </NavBar>
            </Header>
            {activeButton === "receitas" && <NewItemTask showButtonSave />}
            {activeButton === "despesas" && <NewItemTask showButtonSave />}
          </Content>
        </Container>
      </DefaultContainer>
    </>
  );
}
