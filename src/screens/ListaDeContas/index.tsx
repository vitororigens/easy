import React, { useEffect, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { Toast } from 'react-native-toast-notifications';
import { Container } from '../../components/Container';
import { DefaultContainer } from '../../components/DefaultContainer';
import { ItemsAccounts } from '../../components/ItemsAccounts';
import { LoadData } from '../../components/LoadData';
import { Loading } from '../../components/Loading';
import { useMonth } from '../../context/MonthProvider';
import useFirestoreCollection from '../../hooks/useFirestoreCollection';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Content, FooterSpacer, ModalCloseButton, ModalCloseTitle } from './styles';
import { database } from '../../libs/firebase';
import { NewLaunch } from '../NewLaunch';

export function ListaDeContas() {
  const { selectedMonth } = useMonth();
  const user = useUserAuth();
  const uid = user.user?.uid;
  const expense = useFirestoreCollection('Expense');
  const [confirmExpenseVisible, setConfirmExpenseVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  function handleExpenseConfirmation(documentId: string) {
    setConfirmExpenseVisible(true);
    setSelectedItemId(documentId);
  }

  function handleStatus(itemId: string) {
    const docRef = database.collection('Expense').doc(itemId);
    const selected = expense.data.find((item) => item.id === itemId);

    docRef
      .update({
        status: !selected?.status,
      })
      .then(() => {})
      .catch(() => {
        Toast.show('Erro ao atualizar despesa', { type: 'error' });
      });
  }

  // console.log(expense.filter((item) => item.uid === uid));
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <View>
      <DefaultContainer monthButton>
        <Container
          type="SECONDARY"
          title="Lista de contas a pagar"
          subtitle="Simplificada"
        >
          <Content>
            <FlatList
              data={expense.data.filter(
                (item) =>
                  item.uid === uid &&
                  ((item.repeat === true && item.month === selectedMonth) ||
                    (item.repeat === false && item.month === selectedMonth)),
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleExpenseConfirmation(item.id)}
                >
                  <ItemsAccounts
                    selected={item.status}
                    status={item.status}
                    type={item.type}
                    category={item.name}
                    date={item.date}
                    income={item.income}
                    handleStatus={() => handleStatus(item.id)}
                    handleExpenseConfirmation={() =>
                      handleExpenseConfirmation(item.id)
                    }
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <LoadData
                  image="SECONDARY"
                  title="Desculpe!"
                  subtitle="Você ainda não possui lançamentos de saídas! Comece lançando uma nova saída."
                />
              }
              ListFooterComponent={<FooterSpacer />}
            />
          </Content>
        </Container>
      </DefaultContainer>

      <Modal
        visible={confirmExpenseVisible}
        onRequestClose={() => setConfirmExpenseVisible(false)}
      >
        <DefaultContainer>
          <ModalCloseButton onPress={() => setConfirmExpenseVisible(false)}>
            <ModalCloseTitle>Fechar</ModalCloseTitle>
          </ModalCloseButton>
          <Container type="SECONDARY" title={'Editar Saída'}>
            <NewLaunch selectedItemId={selectedItemId} />
          </Container>
        </DefaultContainer>
      </Modal>
    </View>
  );
}
