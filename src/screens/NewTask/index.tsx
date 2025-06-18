import React, { useState, useEffect } from "react";
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
import { useRoute } from "@react-navigation/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Revenue } from "../../components/Revenue";
import { Expense } from "../../components/Expense";
import { View, Text } from "react-native";

export function NewTask() {
  const route = useRoute();
  const {
    selectedItemId,
    initialActiveButton,
    isCreator = true,
  } = route.params as {
    selectedItemId?: string;
    initialActiveButton?: string;
    isCreator: boolean;
  };

  // Log para debug
  console.log("NewTask - selectedItemId:", selectedItemId);  
  console.log("NewTask - initialActiveButton:", initialActiveButton);
  console.log("NewTask - isCreator:", isCreator);

  // Inicializar com "receitas" como padrão se não houver initialActiveButton
  const [activeButton, setActiveButton] = useState<string>(
    initialActiveButton || "receitas"
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialActiveButton) {
      setActiveButton(initialActiveButton);
    } else if (!activeButton) {
      // Fallback para garantir que sempre tenha um valor
      setActiveButton("receitas");
    }
    
    // Marcar como pronto após um pequeno delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initialActiveButton, activeButton]);

  const handleButtonClick = (buttonName: string) => {
    console.log("NewTask - handleButtonClick:", buttonName);
    setActiveButton(buttonName);
  };

  console.log("NewTask - activeButton final:", activeButton);

  // Não renderizar nada até estar pronto
  if (!isReady) {
    return (
      <DefaultContainer
        hasHeader={false}
        title="Adicionar Lançamento"
        backButton
      >
        <Content>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Carregando...</Text>
          </View>
        </Content>
      </DefaultContainer>
    );
  }

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
                active={activeButton === "receitas"}
                style={{ borderTopLeftRadius: 40 }}
              >
                <Title>Receitas</Title>
              </ButtonBar>
              <ButtonBar
                onPress={() => handleButtonClick("despesas")}
                active={activeButton === "despesas"}
                style={{ borderTopRightRadius: 40 }}
              >
                <Title>Despesas</Title>
              </ButtonBar>
            </NavBar>
          </Header>
          {activeButton === "receitas" && (
            <Revenue 
              selectedItemId={selectedItemId} 
              showButtonSave 
            />
          )}
          {activeButton === "despesas" && (
            <Expense 
              selectedItemId={selectedItemId} 
              showButtonSave 
            />
          )}
          {!activeButton && (
            <Revenue 
              selectedItemId={selectedItemId} 
              showButtonSave 
            />
          )}
        </Content>
      </DefaultContainer>
    </>
  );
}
