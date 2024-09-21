import React, { useState, useEffect } from "react";
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
import { useRoute } from "@react-navigation/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Revenue } from "../../components/Revenue";
import theme from "../../theme";

export function NewTask() {
  const route = useRoute();
  const { selectedItemId, initialActiveButton } = route.params as {
    selectedItemId?: string;
    initialActiveButton?: string;
  };

  const [activeButton, setActiveButton] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialActiveButton) {
      setActiveButton(initialActiveButton);
    }
  }, [initialActiveButton]);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer
        hasHeader={false}
        title="Adicionar Lançamento"
       
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
          {activeButton === "receitas" && <Revenue selectedItemId={selectedItemId} showButtonSave />}
          {activeButton === "despesas" && <Revenue selectedItemId={selectedItemId} showButtonSave />}
        </Content>
      </DefaultContainer>
    </>
  );
}
