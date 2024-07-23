import React, { useState } from "react";
//
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Expense } from "../../components/Expense";
import { Revenue } from "../../components/Revenue";
import theme from "../../theme";

type Props = {
  closeBottomSheet?: () => void;
  initialActiveButton: string
};

export function NewTask({ closeBottomSheet, initialActiveButton }: Props) {
  const [activeButton, setActiveButton] = useState(initialActiveButton);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer
        hasHeader={false}
        title="Adicionar Lançamento"
        closeModalFn={closeBottomSheet}
        customBg={theme.COLORS.TEAL_50}
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
          {activeButton === "receitas" && <Revenue showButtonSave onCloseModal={closeBottomSheet} />}
          {activeButton === "despesas" && <Expense showButtonSave onCloseModal={closeBottomSheet} />}
        </Content>
      </DefaultContainer>
    </>
  );
}
