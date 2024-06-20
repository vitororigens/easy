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
import { View } from "react-native";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Expense } from "../../components/Expense";
import { Revenue } from "../../components/Revenue";

type Props = {
  closeBottomSheet?: () => void;
};

export function NewTask({ closeBottomSheet }: Props) {
  const [activeButton, setActiveButton] = useState("despesas");

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
              <View style={{ flexDirection: "row" }}>
                <Divider
                  active={activeButton === "receitas"}
                  style={{
                    alignSelf:
                      activeButton === "receitas" ? "flex-start" : "flex-end",
                  }}
                />
                <Divider
                  active={activeButton === "despesas"}
                  style={{
                    alignSelf:
                      activeButton === "receitas" ? "flex-start" : "flex-end",
                  }}
                />
              </View>

              <NavBar>
                <ButtonBar
                  onPress={() => handleButtonClick("receitas")}
                  active={activeButton !== "receitas"}
                >
                  <Title>Receitas</Title>
                </ButtonBar>
                <ButtonBar
                  onPress={() => handleButtonClick("despesas")}
                  active={activeButton !== "despesas"}
                >
                  <Title>Despesas</Title>
                </ButtonBar>
              </NavBar>
            </Header>
            {activeButton === "receitas" && <Revenue showButtonSave />}
            {activeButton === "despesas" && <Expense showButtonSave />}
          </Content>
        </Container>
      </DefaultContainer>
    </>
  );
}
