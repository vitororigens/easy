import React, { useState } from 'react';
import { Modal, FlatList } from 'react-native';
//
import {
  ContainerMonth,
  Label,
  MonthSelectorButton,
  MonthSelectorText,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  MonthItem,
  MonthItemText,
  CancelButton,
  CancelButtonText,
} from './styles';
//
import { DefaultContainer } from '../../components/DefaultContainer';
//
import { useMonth } from '../../context/MonthProvider';

// Vars
const months = [
  { id: 1, name: 'Janeiro' },
  { id: 2, name: 'Fevereiro' },
  { id: 3, name: 'Março' },
  { id: 4, name: 'Abril' },
  { id: 5, name: 'Maio' },
  { id: 6, name: 'Junho' },
  { id: 7, name: 'Julho' },
  { id: 8, name: 'Agosto' },
  { id: 9, name: 'Setembro' },
  { id: 10, name: 'Outubro' },
  { id: 11, name: 'Novembro' },
  { id: 12, name: 'Dezembro' },
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;

export function Filter() {
  // State
  const { selectedMonth, setSelectedMonth } = useMonth();
  const [modalVisible, setModalVisible] = useState(false);

  // Funcs
  const selectedCurrentDate = months.find(
    (month) => month.id === (selectedMonth || currentMonth),
  )?.name;

  const handleMonthSelect = (monthId: number) => {
    setSelectedMonth(monthId);
    setModalVisible(false);
  };

  const renderMonthItem = ({ item }: { item: typeof months[0] }) => (
    <MonthItem
      selected={selectedMonth === item.id}
      onPress={() => handleMonthSelect(item.id)}
    >
      <MonthItemText selected={selectedMonth === item.id}>
        {item.name}
      </MonthItemText>
    </MonthItem>
  );

  return (
    <>
      <DefaultContainer
        title="Filtrar"
        backButton
      >
        <ContainerMonth
          style={{
            height: 60,
            justifyContent: 'center',
          }}
        >
          <Label>Mês</Label>
          <MonthSelectorButton onPress={() => setModalVisible(true)}>
            <MonthSelectorText>
              {selectedCurrentDate}
            </MonthSelectorText>
          </MonthSelectorButton>
        </ContainerMonth>
      </DefaultContainer>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>
              Selecionar Mês
            </ModalTitle>

            <FlatList
              data={months}
              renderItem={renderMonthItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />

            <CancelButton onPress={() => setModalVisible(false)}>
              <CancelButtonText>Cancelar</CancelButtonText>
            </CancelButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </>
  );
}
