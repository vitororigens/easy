import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, Title, ButtonClose, Input, Button, Span, InputContainer } from "./styles";
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

export function NewNotes({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove, selectedItemId }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('');
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  console.log(uid)


  const handleSaveItem = () => {
    if (name === '') {
      Alert.alert('Atenção!', 'Por favor, preencha todos os campos obriatórios antes de salvar.');
      return;
    }
    database
      .collection('Notes')
      .doc()
      .set({
        name,
        uid: uid,
        description: description
      })
      .then(() => {
        Toast.show('Nota adicionado!', { type: 'success' });
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

    const expenseRef = database.collection('Notes').doc(selectedItemId);
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
      .collection('Notes')
      .doc(selectedItemId)
      .set({
        name,
        uid: uid,
      })
      .then(() => {
        Toast.show('Nota adicionado!', { type: 'success' });
        setName('')
        onCloseModal && onCloseModal();
      })
      .catch(error => {
        console.error('Erro ao adicionar o item: ', error);
      });
  };


  useEffect(() => {
    if (selectedItemId) {
      database.collection('Notes').doc(selectedItemId).get().then((doc) => {
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
      <DefaultContainer>
      <ButtonClose onPress={closeBottomSheet} >
          <Title style={{ color: 'white' }}>Fechar</Title>
        </ButtonClose>
        <Container title={'Adicionar nova nota'}>
        <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <Title>
            Nome da nota
          </Title>
          <Input
            value={name}
            onChangeText={setName}
          />
          <Title>
            Nota
          </Title>
          <InputContainer
          multiline
          numberOfLines={20}
          value={description}
          onChangeText={setDescription}
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
        </Container>
      </DefaultContainer>
    </>
  );
}
