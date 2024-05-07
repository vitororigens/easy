import React, { useState } from 'react';
import { ScrollView } from "react-native";
//
import { Content, Divider, Header, Title, NavBar,  ButtonBar,  ButtonClose } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Revenue } from '../../components/Revenue';
import { Expense } from '../../components/Expense';


type Props = {
  closeBottomSheet?: () => void;
}

export function NewTask({ closeBottomSheet }: Props) {
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
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Container type="SECONDARY" title="NOVO LANÇAMENTO">
            <Content>
              <Header>
                <Divider style={{ alignSelf: activeButton === "receitas" ? "flex-start" : "flex-end" }} />
                <NavBar>
                  <ButtonBar onPress={() => handleButtonClick("receitas")}>
                    <Title>
                      Receitas
                    </Title>
                  </ButtonBar>
                  <ButtonBar onPress={() => handleButtonClick("despesas")}>
                    <Title>
                      Despesas
                    </Title>
                  </ButtonBar>
                </NavBar>
              </Header>
              {activeButton === "receitas" &&
                <Revenue showButtonSave/>
              }
              {activeButton === "despesas" && 
              <Expense showButtonSave/>
              }
            </Content>
          </Container>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
