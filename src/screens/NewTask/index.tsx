import React, { useState } from 'react';
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, Title, NavBar, SubTitle, ButtonBar, Button, DividerTask, Input, TitleTask, InputDescription, ButtonClose } from "./styles";
import { ScrollView, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  closeBottomSheet?: () => void;
}

export function NewTask({ closeBottomSheet }: Props) {
  const [activeButton, setActiveButton] = useState("receitas");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const formattedDateString = currentDate.toLocaleDateString('pt-BR');
    setFormattedDate(formattedDateString);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <>
      <ButtonClose onPress={closeBottomSheet} >
        <Title style={{ color: 'white' }}>Cancelar</Title>
      </ButtonClose>
      <DefaultContainer>
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
                <View style={{ flex: 1, padding: 10 }}>

                  <View style={{ height: '20%' }}>
                    <TitleTask>Valor</TitleTask>
                    <Input />
                  </View>
                  <View style={{ flexDirection: 'row', height: '45%', marginBottom: 10 }}>
                    <View style={{ width: '50%' }}>
                      <TitleTask>Data:</TitleTask>
                      <TouchableOpacity onPress={showDatePickerModal}>
                        <Input value={formattedDate} editable={false} />
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={date}
                          mode="date"
                          onChange={handleDateChange}
                        />
                      )}
                      <TitleTask>Categorias:</TitleTask>
                      <Input />
                    </View>
                    <DividerTask />
                    <View style={{ width: '50%' }}>
                      <TitleTask>Repetir?</TitleTask>
                    </View>
                  </View>
                  <View style={{ height: '30%' }}>
                    <TitleTask>Descrição</TitleTask>
                    <InputDescription />
                  </View>

                </View>
              }
              {activeButton === "despesas" && <Title>teste1</Title>}
            </Content>
          </Container>
          <Button>
            <Title style={{ color: 'white' }}>Salvar</Title>
          </Button>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
