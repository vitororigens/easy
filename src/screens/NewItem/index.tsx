import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, Title, ButtonClose, Input, Button } from "./styles";
import RNPickerSelect from 'react-native-picker-select';
import { Alert, ScrollView, View } from "react-native";
import { useState } from "react";
import { database } from '../../services';
import { Toast } from "react-native-toast-notifications";
import { useUserAuth } from "../../hooks/useUserAuth";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
}

export function NewItem({ closeBottomSheet, onCloseModal }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMeasurements, setSelectedMeasurements] = useState('');
  const [valueItem, setValueItem] = useState('');
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('');
  const user = useUserAuth();
  const uid = user?.uid;
  console.log(uid)


  function formatQuantity(quantity: string) {
    const formattedQuantity = quantity.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return formattedQuantity;
  }


  const handleSaveItem = () => {
    if(name === '' || amount === 'NaN'  || selectedCategory === '' || valueItem === 'NaN'){
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
          <Container type="SECONDARY" title="NOVO ITEM">
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
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <View style={{
                  width: '50%',
                  paddingRight: 20
                }}>
                  <Title>
                    Quantidade* 
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
                Preço* 
              </Title>
              <Input
                placeholder="0,00"
                value={valueItem}
                keyboardType="numeric"
                onChangeText={setValueItem}
              />


              <Title>
                Categoria* 
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
                Observação
              </Title>
              <Input
                value={description}
                onChangeText={setDescription}
              />
              <Button onPress={handleSaveItem}>
                <Title>Salvar</Title>
              </Button>
            </Content>
          </Container>
        </ScrollView>
      </DefaultContainer>
    </>
  );
}
