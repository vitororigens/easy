import React, { useEffect, useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Button, Content, Divider, Header, Title } from "./styles";
import { LoadData } from "../../components/LoadData";
import useMarketplaceCollections from "../../hooks/useMarketplaceCollections";
import { FlatList, Modal, View, Platform, ScrollView } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";
import { Loading } from "../../components/Loading";

import { ListItem } from "../../components/ListItem";
import { NewItemTask } from "../NewItemTask";
import { ItemNotes } from "../../components/ItemNotes";
import { ItemTask } from "../../components/ItemTask";
type SelectedItems = {
  [key: string]: boolean;
};


export function ListTask() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  const data = useMarketplaceCollections('Task');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const user = useUserAuth();
  const uid = user?.uid;

  function handleCheckAll() {
    const newSelectedItems = {};
    data.forEach(item => {
      if (item.uid === uid) {
        newSelectedItems[item.id] = true;
      }
    });
    setSelectedItems(newSelectedItems);
  }

  function handleUncheckAll() {
    setSelectedItems({});
  }

  function closeModals() {
    setShowTaskModal(false);
  }
  
  function handleEditItem(documentId: string) {
    setShowTaskModal(true);
    setSelectedItemId(documentId);
  }

  function handleDeleteItem(documentId: string) {
    database.collection('Task').doc(documentId).delete()
      .then(() => {
        Toast.show('Nota excluída!', { type: 'success' });
      })
      .catch(error => {
        console.error('Erro ao excluir a nota: ', error);
      });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer newItem>
      <Container type="SECONDARY" title="Lista de tarefas">
        <Content>
          <Header>
            <Divider />
          </Header>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={handleCheckAll}>
              <Title>Marcar todos</Title>
            </Button>
            <Button onPress={handleUncheckAll}>
              <Title>Desmarcar todos</Title>
            </Button>
          </View>

            {data.filter(item => item.uid === uid).length === 0 ? (
              <ScrollView>
                <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui! começe adicionando itens no seu carrinho e crie sua lista de mercado.' />
              </ScrollView>
            ) : (
              <FlatList
              data={data.filter(item => item.uid === uid)}
              renderItem={({ item }) => (
                <ItemTask
                  onEdit={() => handleEditItem(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                  title={item.name}
                  isChecked={selectedItems[item.id] || false}
                  onToggle={() => {
                    setSelectedItems(prev => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }));
                  }}
                />
              )}
              keyExtractor={item => item.id}
            />
            )}
       
        </Content>
      </Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTaskModal}
        onRequestClose={closeModals}
      >
        <NewItemTask selectedItemId={selectedItemId} showButtonSave showButtonRemove closeBottomSheet={closeModals} />
      </Modal>
    </DefaultContainer>
  );
}
