import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
import { ButtonClose, Content, Title } from "./styles";
import { useState } from "react";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Expense } from "../../components/Expense";
import { useMonth } from "../../context/MonthProvider";
import { ItemsAccounts } from "../../components/ItemsAccounts";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
}

export function Home() {
  const { selectedMonth } = useMonth();
  const user = useUserAuth();
  const uid = user?.uid;
  const [status, setStatus] = useState(false);
  const revenue = useFirestoreCollection('Revenue');
  const expense = useFirestoreCollection('Expense');
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
  }

  function handleStatus(itemId: string) {
    setSelectedItems(prevSelectedItems => ({
      ...prevSelectedItems,
      [itemId]: !prevSelectedItems[itemId],
    }));
  }

  const selectedTrueItems = Object.entries(selectedItems)
    .filter(([key, value]) => value)
    .map(([key]) => key);

  return (
    <>
      <DefaultContainer monthButton addButton listButtom>
        <Container type="SECONDARY" title="Lista de contas">
          <Content>
            {expense.filter(item => item.uid === uid && item.repeat === false).length < 0 ? (
              <ScrollView>
                <LoadData image='SECONDARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de saídas! Comece lançando uma nova saída.' />
              </ScrollView>
            ) : (
              <FlatList
                data={expense.filter(item => item.uid === uid && item.repeat === true && item.month === selectedMonth)}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleExpenseConfirmation(item.id)}>
                    <ItemsAccounts
                      selected={selectedItems[item.id] || false}
                      status={item.status}
                      type={item.type}
                      category={item.name}
                      date={item.date}
                      income={item.income}
                      handleStatus={() => handleStatus(item.id)}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </Content>
        </Container>
      </DefaultContainer>

      <Modal visible={confirmExpenseVisible} onRequestClose={() => setConfirmExpenseVisible(false)}>
        <DefaultContainer hasHeader={false}>
          <ButtonClose onPress={() => setConfirmExpenseVisible(false)} style={{ alignSelf: "flex-end", marginBottom: 32 }}>
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
