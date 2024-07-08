import React, { useState } from "react";
//
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Expense } from "../../components/Expense";
import { Revenue } from "../../components/Revenue";

type Props = {
  closeBottomSheet?: () => void;
};

export function NewTask({ closeBottomSheet }: Props) {
  const [activeButton, setActiveButton] = useState("receitas");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <DefaultContainer
        hasHeader={false}
        title="Adicionar Lançamento"
        closeModalFn={closeBottomSheet}
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
