import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonBar, Content, Header, NavBar, Title } from "./styles";
import { useRoute } from "@react-navigation/native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Revenue } from "../../components/Revenue";
import { Expense } from "../../components/Expense";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Timestamp } from "firebase/firestore";

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  quantity: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  measurement: z.string().optional(),
  observation: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

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

  const [activeButton, setActiveButton] = useState<string | undefined>(
    undefined
  );

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "1",
      price: "",
      category: "",
      measurement: "un",
      observation: "",
      sharedUsers: [],
    },
  });

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
          {activeButton === "receitas" && (
            <Revenue selectedItemId={selectedItemId} showButtonSave />
          )}
          {activeButton === "despesas" && (
            <Expense selectedItemId={selectedItemId} showButtonSave />
          )}
        </Content>
      </DefaultContainer>
    </>
  );
}
