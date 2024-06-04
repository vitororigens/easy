import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { Toast } from "react-native-toast-notifications";
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from '../../services';
import { Button, ButtonClose, Content, Input, Span, Title } from "./styles";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
}

export function NewItem({ closeBottomSheet, onCloseModal, showButtonEdit, showButtonSave, showButtonRemove, selectedItemId }: Props) {
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
      .collection('Marketplace')
      .doc()
      .set({
        category: selectedCategory,
        measurements: selectedMeasurements,
        valueItem: parseFloat(valueItem as string),
        name,
        amount: parseFloat(amount as string),
        description,
        uid: uid,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setSelectedCategory('')
        setAmount('')
        setDescription('')
        setName('')
        setSelectedMeasurements('')
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
      .collection('Marketplace')
      .doc(selectedItemId)
      .set({
        category: selectedCategory,
        measurements: selectedMeasurements,
        valueItem: parseFloat(valueItem as string),
        name,
        amount: parseFloat(amount as string),
        description,
        uid: uid,
      })
      .then(() => {
        Toast.show('Item adicionado!', { type: 'success' });
        setSelectedCategory('')
        setAmount('')
        setDescription('')
        setName('')
        setSelectedMeasurements('')
        setValueItem('')
        onCloseModal && onCloseModal();
      })
      .catch(error => {
        console.error('Erro ao adicionar o item: ', error);
      });
  };


  useEffect(() => {
    if (selectedItemId) {
      database.collection('Marketplace').doc(selectedItemId).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            setSelectedCategory(data.category);
            setSelectedMeasurements(data.measurements);
            setValueItem(data.valueItem);
            setDescription(data.description);
            setName(data.name);
            setAmount(data.amount.toString());
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
    <DefaultContainer hasHeader={false}>
      <ButtonClose onPress={closeBottomSheet} style={{alignSelf: "flex-end", marginBottom: 32}}>
          <Title style={{ color: 'white' }}>Fechar</Title>
        </ButtonClose>
      <Container>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Content>
            <Title>
              Nome*
            </Title>
            <Input
              value={name}
              onChangeText={setName}
            />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <View style={{
                width: '50%',
                paddingRight: 15
              }}>
                <Title>
                  Quantidade<Span> (opicional)</Span>
                </Title>
                <Input
                  value={formatQuantity(amount)}
                  keyboardType="numeric"
                  onChangeText={setAmount}
                />

              </View>
              <View style={{
                width: 100
              }}>
                <RNPickerSelect
                  onValueChange={(value) => setSelectedMeasurements(value)}
                  items={[
                    { label: 'un', value: 'unidade' },
                    { label: 'kg', value: 'kilo' },
                    { label: 'g', value: 'gramas' },
                    { label: 'l', value: 'litro' },
                    { label: 'ml', value: 'milimetros' },


                  ]}
                  value={selectedMeasurements}
                  placeholder={{ label: 'un', value: 'un' }}
                />
              </View>
            </View>
            <Title>
              Preço <Span> (opicional)</Span>
            </Title>
            <Input
              placeholder="0,00"
              value={valueItem}
              keyboardType="numeric"
              onChangeText={setValueItem}
            />


            <Title>
              Categoria <Span> (opicional)</Span>
            </Title>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={[
                { label: 'Ovos, Verduras e Frutas', value: 'ovos, verduras e frutas' },
                { label: 'Carnes', value: 'carnes' },
                { label: 'Laticínios', value: 'laticinios' },
                { label: 'Padaria', value: 'padaria' },
                { label: 'Bebidas', value: 'bebidas' },
                { label: 'Produtos de Limpeza', value: 'produtos de limpeza' },
                { label: 'Higiene Pessoal', value: 'higiene pessoal' },
                { label: 'Hortifruti', value: 'hortifruti' },
                { label: 'Congelados', value: 'congelados' },
                { label: 'Açougue', value: 'acougue' },
                { label: 'Peixaria', value: 'peixaria' },
                { label: 'Bebidas Alcoólicas', value: 'bebidas alcoolicas' },
                { label: 'Pet Shop', value: 'pet shop' },
                { label: 'Utensílios Domésticos', value: 'utensilios domesticos' },
                { label: 'Bebês e Crianças', value: 'bebes e criancas' },
                { label: 'Eletronicos', value: 'Eletronicos' },
                { label: 'Carro', value: 'Carro' },
                { label: 'Ferramentas', value: 'Ferramentas' },
              ]}
              value={selectedCategory}
              placeholder={{ label: 'Selecione', value: 'Selecione' }}
            />

            <Title>
              Observação <Span> (opicional)</Span>
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
        </ScrollView>
      </Container>
    </DefaultContainer>
  );
}
