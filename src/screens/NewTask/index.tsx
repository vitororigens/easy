import React, { useState } from "react";
//
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
//
import { useRoute } from "@react-navigation/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Expense } from "../../components/Expense";
import { Revenue } from "../../components/Revenue";
import theme from "../../theme";

export function NewTask() {
  const route = useRoute();
  const { selectedItemId, initialActiveButton } = route.params as {
    selectedItemId?: string;
    initialActiveButton?: string;
  };
  const [activeButton, setActiveButton] = useState(initialActiveButton);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer
        hasHeader={false}
        title="Adicionar Lançamento"
        customBg={theme.COLORS.TEAL_50}
        backButton
      >
        <Content>
          <Header>
            <NavBar>
              <ButtonBar
                onPress={() => handleButtonClick("receitas")}
                active={activeButton !== "receitas"}
                style={{ borderTopLeftRadius: 40 }}
              >
                <Title>Receitas</Title>
              </ButtonBar>
              <ButtonBar
                onPress={() => handleButtonClick("despesas")}
                active={activeButton !== "despesas"}
                style={{ borderTopRightRadius: 40 }}
              >
                <Title>Despesas</Title>
              </ButtonBar>
            </NavBar>
          </Header>
          {activeButton === "receitas" && <Revenue showButtonSave />}
          {activeButton === "despesas" && <Expense showButtonSave />}
        </Content>
      </DefaultContainer>
    </>
  );
}
