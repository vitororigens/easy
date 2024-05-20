import { DefaultContainer } from '../../components/DefaultContainer';
import { Container } from '../../components/Container';
import { Dimensions, FlatList, Modal, ScrollView } from 'react-native';
import { LoadData } from '../../components/LoadData';
import useMarketplaceCollections from '../../hooks/useMarketplaceCollections';
import { ItemNotes } from '../../components/ItemNotes';
import { useUserAuth } from '../../hooks/useUserAuth';
import { NewNotes } from '../NewNotes';
import { useState } from 'react';
import { database } from '../../services';
import { Toast } from 'react-native-toast-notifications';

const screenWidth = Dimensions.get('screen').width;

export function Notes() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const data = useMarketplaceCollections('Notes');
  const user = useUserAuth();
  const uid = user?.uid;

  function closeModals() {
    setShowNotesModal(false);
  }

  function handleEditItem(documentId: string) {
    setShowNotesModal(true);
    setSelectedItemId(documentId);
  }

  function handleDeleteItem(documentId: string) {
    database.collection('Notes').doc(documentId).delete()
      .then(() => {
        Toast.show('Nota excluída!', { type: 'success' });
      })
      .catch(error => {
        console.error('Erro ao excluir a nota: ', error);
      });
  }

  return (
    <DefaultContainer newNotes>
      <Container type="SECONDARY" title="Notas">
        {data.filter(item => item.uid === uid).length === 0 ? (
          <ScrollView>
            <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui dados para exibir aqui! começe adicionando uma nova anotação clicando em Novo +.' />
          </ScrollView>
        ) : (
          <FlatList
            data={data.filter(item => item.uid === uid)}
            renderItem={({ item }) => (
              <ItemNotes
                onDelete={() => handleDeleteItem(item.id)}
                onEdit={() => handleEditItem(item.id)}
                title={item.name}
                description={item.description}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </Container>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <NewNotes selectedItemId={selectedItemId} showButtonSave showButtonRemove closeBottomSheet={closeModals} />
      </Modal>
    </DefaultContainer>
  );
}
