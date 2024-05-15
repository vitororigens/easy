import React, { useState } from 'react';
//
import { Content, Divider, Header, Title, NavBar, ButtonBar, ButtonClose } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { NewItem } from '../NewItem';
import { NewItemTask } from '../NewItemTask';


type Props = {
  closeBottomSheet?: () => void;
}

export function NewTaskMarketplace({ closeBottomSheet }: Props) {
  const [activeButton, setActiveButton] = useState("receitas");


  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer>
        <ButtonClose onPress={closeBottomSheet} >
          <Title style={{ color: 'white' }}>Fechar</Title>
        </ButtonClose>
          <Container type="SECONDARY" title="NOVO LANÇAMENTO">
            <Content>
              <Header>
                <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
                <NavBar>
                  <ButtonBar onPress={() => handleButtonClick("receitas")}>
                    <Title>
                      Nova Tarefa
                    </Title>
                  </ButtonBar>
                  <ButtonBar onPress={() => handleButtonClick("despesas")}>
                    <Title>
                    Novo item de compra
                    </Title>
                  </ButtonBar>
                </NavBar>
              </Header>
              {activeButton === "receitas" &&
                <NewItemTask showButtonSave />
              }
              {activeButton === "despesas" &&
                <NewItem showButtonSave />
              }
            </Content>
          </Container>
      </DefaultContainer>
    </>
  );
}
