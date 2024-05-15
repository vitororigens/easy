import {  FlatList, ScrollView, TouchableOpacity} from "react-native";
//
import { Content, Divider, Header, Title, ButtonClose, Input, Button } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { useUserAuth } from "../../hooks/useUserAuth";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { LoadData } from "../../components/LoadData";
import { Items } from "../../components/Items";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState } from "react";
//


type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
}

export function List({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove }: Props) {
  const user = useUserAuth();
  const uid = user?.uid;
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

      <DefaultContainer>
        <ButtonClose onPress={closeBottomSheet} >
          <Title style={{ color: 'white' }}>Fechar</Title>
        </ButtonClose>
          <Container type="SECONDARY" title="Lista de contas">
            <Header>
              <Divider />
            </Header>
            <Content>

            {expense.filter(item => item.uid === uid).length === 0 ? (
                <ScrollView>
                  <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de saídas! Começe lanaçando uma nova saida.' />
                </ScrollView>
              ) : (
                <FlatList
                  data={expense.filter(item => item.uid === uid )}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleExpenseConfirmation(item.id)}>
                      <Items
                        showItemTask
                        status={item.status}
                        type={item.type}
                        category={item.category}
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
    </>
  );
}
