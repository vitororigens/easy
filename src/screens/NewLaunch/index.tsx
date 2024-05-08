import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Toast } from "react-native-toast-notifications";
import { useEffect, useState } from "react";
//
import { Content, Divider, Header, Title, ButtonClose, Input, Button } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
//
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from '../../services';

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
}

export function NewLaunch({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove, selectedItemId }: Props) {
  const [valueItem, setValueItem] = useState('0');
  const [name, setName] = useState('')
  const [description, setDescription] = useState('');
  const user = useUserAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  console.log(uid)
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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



  const handleSaveItem = () => {
    if (name === '') {
      Alert.alert('Atenção!', 'Por favor, preencha todos os campos obriatórios antes de salvar.');
      return;
    }

    const [day, month, year] = formattedDate.split('/');
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;
    database
      .collection('PiggyBank')
      .doc()
      .set({
        valueItem: parseFloat(valueItem as string),
        name,
        description,
        uid: uid,
        month: monthNumber,
        date: formattedDate,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setDescription('')
        setName('')
        setValueItem('')
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

    const expenseRef = database.collection('PiggyBank').doc(selectedItemId);
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
    const [day, month, year] = formattedDate.split('/');
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    const monthNumber = selectedDate.getMonth() + 1;

    database
      .collection('PiggyBank')
      .doc(selectedItemId)
      .set({
        valueItem: parseFloat(valueItem as string),
        name,
        description,
        uid: uid,
        month: monthNumber,
        date: formattedDate,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setDescription('')
        setName('')
        setValueItem('')
        onCloseModal && onCloseModal();
      })
      .catch(error => {
        console.error('Erro ao adicionar o item: ', error);
      });
  };


  useEffect(() => {
    if (selectedItemId) {
      database.collection('PiggyBank').doc(selectedItemId).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            setValueItem(data.valueItem);
            setDescription(data.description);
            setName(data.name);
            setIsEditing(true);
            setDate(new Date(data.date));
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
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Container type="SECONDARY" title="Quanto você economizou?">
            <Header>
              <Divider />
            </Header>
            <Content>

              <Title>
                Nome*
              </Title>
              <Input
                value={name}
                onChangeText={setName}
              />

              <Title>
                Valor
              </Title>
              <Input
                placeholder="0,00"
                value={valueItem}
                keyboardType="numeric"
                onChangeText={setValueItem}
              />
              <View>
                <Title>Data*</Title>
                <TouchableOpacity style={{ height: 50 }} onPress={showDatePickerModal}>
                  <Input value={formattedDate} editable={false} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <Title>
                Descrição
              </Title>
              <Input
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
          </Container>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
