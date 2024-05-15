import {  FlatList, Modal, ScrollView, TouchableOpacity} from "react-native";
//
import { Content, Divider, Header, Title, ButtonClose, Input, Button } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { LoadData } from "../../components/LoadData";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState } from "react";

import { Expense } from "../../components/Expense";
import { ItemsList } from "../../components/ItemsList";
import { Toast } from "react-native-toast-notifications";
import { database } from "../../services";
import { useMonth } from "../../context/MonthProvider";
//


type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
}

export function List({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove }: Props) {
  const { selectedMonth } = useMonth()
  const user = useUserAuth();
  const uid = user?.uid;
  const [status, setStatus] = useState(false);
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');
  const [confirmRevenueVisible, setConfirmRevenueVisible] = useState(false);
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
  }

  return (
    <>

      <DefaultContainer backButton>
          <Container type="SECONDARY" title="Lista de contas">
            <Header>
              <Divider />
            </Header>
            <Content>

            {expense.filter(item => item.uid === uid && item.repeat === null).length === 0 ? (
                <ScrollView>
                  <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de saídas! Começe lanaçando uma nova saida.' />
                </ScrollView>
              ) : (
                <FlatList
                  data={expense.filter(item => item.uid === uid && item.repeat === true && item.month === selectedMonth )}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleExpenseConfirmation(item.id)}>
                      <ItemsList
                        showItemTask
                        status={item.status}
                        type={item.type}
                        category={item.name}
                        date={item.date}
                        repeat={item.repeat}
                        valueTransaction={formatCurrency(item.valueTransaction)}
                      />
                    </TouchableOpacity>
                  )}

                />
              )}
            </Content>
          </Container>
      </DefaultContainer>
      <Modal visible={confirmExpenseVisible} onRequestClose={() => setConfirmExpenseVisible(false)}>

        <DefaultContainer>
          <ButtonClose onPress={() => setConfirmExpenseVisible(false)} >
            <Title style={{ color: 'white' }}>Fechar</Title>
          </ButtonClose>
          <Container type="SECONDARY" title={'Editar Saida'}>
            <Expense selectedItemId={selectedItemId} showButtonRemove onCloseModal={() => setConfirmExpenseVisible(false)} showButtonEdit />
          </Container>
        </DefaultContainer>
      </Modal>
    </>
  );
}
