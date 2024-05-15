import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, Title, ButtonClose, Input, Button, Span } from "./styles";
import RNPickerSelect from 'react-native-picker-select';
import { Alert, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { database } from '../../services';
import { Toast } from "react-native-toast-notifications";
import { useUserAuth } from "../../hooks/useUserAuth";
import { MarketplaceData } from "../../hooks/useMarketplaceCollections";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
}

export function NewItemTask({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove, selectedItemId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('geral');
  const [selectedMeasurements, setSelectedMeasurements] = useState('');
  const [valueItem, setValueItem] = useState('0.00');
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('1')
  const [description, setDescription] = useState('');
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  console.log(uid)


  function formatQuantity(quantity: string) {
    const formattedQuantity = quantity.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return formattedQuantity;
  }


  const handleSaveItem = () => {
    if (name === '') {
      Alert.alert('Atenção!', 'Por favor, preencha todos os campos obriatórios antes de salvar.');
      return;
    }
    database
      .collection('Task')
      .doc()
      .set({
        name,
        uid: uid,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setName('')
        onCloseModal && onCloseModal();
      })
      .catch(error => {
        console.error('Erro ao adicionar o item: ', error);
      });
  }


  const handleDeleteExpense = () => {
    if (!selectedItemId) {
      console.error('Nenhum documento selecionado para exclusão!');
      return;
    }

    const expenseRef = database.collection('Marketplace').doc(selectedItemId);
    expenseRef.delete()
      .then(() => {
        Toast.show('Item Excluido!', { type: 'success' });
        onCloseModal && onCloseModal();
      })
      .catch((error) => {
        console.error('Erro ao excluir o documento de item:', error);
      });
  };

  const handleEditExpense = () => {
    if (!selectedItemId) {
      console.error('Nenhum documento selecionado para edição!');
      return;
    }


    database
      .collection('Task')
      .doc(selectedItemId)
      .set({
        name,
        uid: uid,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setName('')
        onCloseModal && onCloseModal();
      })
      .catch(error => {
        console.error('Erro ao adicionar o item: ', error);
      });
  };


  useEffect(() => {
    if (selectedItemId) {
      database.collection('Task').doc(selectedItemId).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            setName(data.name);
            setIsEditing(true);
          } else {
            console.log('Dados do documento estão vazios!');
          }
        } else {
          console.log('Nenhum documento encontrado!');
        }
      }).catch((error) => {
        console.error('Erro ao obter o documento:', error);
      });
    }
  }, [selectedItemId]);

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <Title>
            Nome da tarefa
          </Title>
          <Input
            value={name}
            onChangeText={setName}
          />
        
          <View style={{ marginBottom: 10, height: 150 }}>
            {showButtonSave && (
              <Button style={{ marginBottom: 10 }} onPress={isEditing ? handleEditExpense : handleSaveItem}>
                <Title>{isEditing ? 'Editar' : 'Salvar'}</Title>
              </Button>
            )}
            {showButtonRemove && (
              <Button style={{ marginBottom: 10 }} onPress={handleDeleteExpense}>
                <Title>Excluir</Title>
              </Button>
            )}
          </View>
        </Content>
      </ScrollView>
    </>
  );
}
