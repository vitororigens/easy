import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { currencyMask, currencyUnMask } from "../../utils/currency";
import { Button, ButtonPlus, Content, Input, Plus, Span, SubTitle, Title } from "./styles";
import { EditshareModal } from "../../components/EditsshreModal";
import { getInitials } from "../../utils/getInitials";

type Props = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  amount: z.string().optional(),
  valueItem: z.string().optional(),
  selectedCategory: z.string().optional(),
  selectedMeasurements: z.string().optional(),
  description: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewItem({
  closeBottomSheet,
  onCloseModal,
  showButtonRemove,
}: Props) {
  const user = useUserAuth();
  const uid = user?.uid;

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hooks
  const navigation = useNavigation()
  const route = useRoute();

  const { control, handleSubmit, reset, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      name: "",
      selectedCategory: "",
      amount: "1",
      valueItem: "",
      selectedMeasurements: "un",
    },
  });

  const { selectedItemId } = route.params as { selectedItemId?: string };

  // Functions
  function formatQuantity(quantity: string) {
    const formattedQuantity = quantity
      .replace(/\D/g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return formattedQuantity;
  }

  const handleSaveItem = ({
    name,
    amount,
    description,
    selectedCategory,
    selectedMeasurements,
    valueItem,
  }: FormSchemaType) => {
    setLoading(true);
    const docRef = selectedItemId
      ? database.collection('Marketplace').doc(selectedItemId)
      : database.collection('Marketplace').doc();

    docRef.set({

      category: selectedCategory ? selectedCategory : "geral",
      measurements: selectedMeasurements,
      valueItem: valueItem ? currencyUnMask(valueItem) : 0,
      name,
      amount: amount ? parseFloat(amount as string) : 1,
      description,
      uid,
      sharedWith: sharedUsers.map(user => ({
        uid: user.uid,
        userName: user.userName, // Store both uid and userName
      })),
    })
      .then(() => {
        Toast.show("Item adicionado!", { type: "success" });
        setLoading(false);
        reset();
        navigation.goBack()
        !!closeBottomSheet && closeBottomSheet();
      })
      .catch((error) => {
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  const handleDeleteExpense = () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }
    setLoading(true);

    const expenseRef = database.collection("Marketplace").doc(selectedItemId);
    expenseRef
      .delete()
      .then(() => {
        setLoading(false);
        Toast.show("Item Excluido!", { type: "success" });
        navigation.goBack()
        onCloseModal && onCloseModal();
      })
      .catch((error) => {
        console.error("Erro ao excluir o documento de item:", error);
      });
  };



  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obriatórios antes de salvar."
    );
  };

  function handleShowAdvanced() {
    setShowAdvanced((prevState) => !prevState);
  }


  const handleSelectUser = (selectedUser: any) => {
    setSharedUsers((prev) => [...prev, selectedUser]);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (selectedItemId) {
      const fetchData = async () => {
        try {
          const doc = await database.collection("Marketplace").doc(selectedItemId).get();
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setValue("name", data.name);
              setValue("selectedCategory", data.category);
              setValue("selectedMeasurements", data.measurements);
              setValue(
                "valueItem",
                data.valueItem.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              );
              setValue("amount", data.amount.toString());
              if (data.sharedWith && Array.isArray(data.sharedWith)) {
                setSharedUsers(data.sharedWith); // Directly set the sharedWith array
              } else {
                setSharedUsers([]);
              }
              setIsEditing(true);
            } else {
              console.log("Dados do documento estão vazios!");
            }
          } else {
            console.log("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao obter o documento:", error);
        }
      };

      fetchData();
    }
  }, [selectedItemId]);

  return (
    <DefaultContainer
      hasHeader={false}
      title="Adicionar novo item"
      closeModalFn={closeBottomSheet}
      backButton
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <Title>Nome*</Title>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <View style={{ marginTop: 40, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={handleShowAdvanced}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Title>{showAdvanced ? "Mostrar menos" : "Mostrar mais"}</Title>
              <MaterialIcons
                name={showAdvanced ? "arrow-drop-up" : "arrow-drop-down"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {showAdvanced && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "50%",
                    paddingRight: 15,
                  }}
                >
                  <Title>
                    Quantidade<Span> (opcional)</Span>
                  </Title>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        keyboardType="numeric"
                        value={formatQuantity(value ?? "")}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </View>
                <View
                  style={{
                    width: 100,
                  }}
                >
                  <Controller
                    control={control}
                    name="selectedMeasurements"
                    render={({ field: { onChange, value } }) => (
                      <RNPickerSelect
                        onValueChange={onChange}
                        items={[
                          { label: "un", value: "unidade" },
                          { label: "kg", value: "kilo" },
                          { label: "g", value: "gramas" },
                          { label: "l", value: "litro" },
                          { label: "ml", value: "mililitros" },
                        ]}
                        value={value}
                        placeholder={{ label: "un", value: "un" }}
                        doneText="Pronto"
                      />
                    )}
                  />
                </View>
              </View>
              <Title>
                Preço <Span> (opcional)</Span>
              </Title>
              <Controller
                control={control}
                name="valueItem"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={(value) => onChange(currencyMask(value))}
                    onBlur={onBlur}
                    placeholder="0,00"
                    keyboardType="numeric"
                  />
                )}
              />

              <Title>
                Categoria <Span> (opcional)</Span>
              </Title>

              <View
                style={{
                  height: 50,
                  justifyContent: "center",
                }}
              >
                <Controller
                  control={control}
                  name="selectedCategory"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <RNPickerSelect
                      onValueChange={onChange}
                      items={[
                        {
                          label: "Ovos, Verduras e Frutas",
                          value: "ovos, verduras e frutas",
                        },
                        { label: "Carnes", value: "carnes" },
                        { label: "Laticínios", value: "laticinios" },
                        { label: "Padaria", value: "padaria" },
                        { label: "Bebidas", value: "bebidas" },
                        {
                          label: "Produtos de Limpeza",
                          value: "produtos de limpeza",
                        },
                        { label: "Higiene Pessoal", value: "higiene pessoal" },
                        { label: "Hortifruti", value: "hortifruti" },
                        { label: "Congelados", value: "congelados" },
                        { label: "Açougue", value: "acougue" },
                        { label: "Peixaria", value: "peixaria" },
                        {
                          label: "Bebidas Alcoólicas",
                          value: "bebidas alcoolicas",
                        },
                        { label: "Pet Shop", value: "pet shop" },
                        {
                          label: "Utensílios Domésticos",
                          value: "utensilios domesticos",
                        },
                        {
                          label: "Bebês e Crianças",
                          value: "bebes e criancas",
                        },
                        { label: "Eletronicos", value: "Eletronicos" },
                        { label: "Carro", value: "Carro" },
                        { label: "Ferramentas", value: "Ferramentas" },
                      ]}
                      value={value}
                      placeholder={{ label: "Selecione", value: "Selecione" }}
                    />
                  )}
                />
              </View>

              <Title>
                Observação <Span> (opcional)</Span>
              </Title>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <Title>Compartilhar</Title>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <ButtonPlus onPress={() => setIsModalVisible(true)}>
                  <Plus name="plus" />
                </ButtonPlus>
                {sharedUsers.map((user, index) => (
                  <ButtonPlus key={index}>
                    <SubTitle>{getInitials(user.userName)}</SubTitle>
                  </ButtonPlus>
                ))}
              </View>
            </>
          )}
          <View style={{ marginBottom: 10, height: 150 }}>
            <Button
              style={{ marginBottom: 10 }}
              onPress={
                isEditing
                  ? handleSubmit(handleSaveItem, onInvalid)
                  : handleSubmit(handleSaveItem, onInvalid)
              }
            >
              <Title>{loading ? <LoadingIndicator /> : "Salvar"}</Title>
            </Button>
            {!!selectedItemId && (
              <Button
                style={{ marginBottom: 10 }}
                onPress={handleDeleteExpense}
              >
                <Title>Excluir</Title>
              </Button>
            )}
          </View>
        </Content>
      </ScrollView>
      {isModalVisible && (
        <EditshareModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectUser={handleSelectUser}
          share="sharedWith" 
          uid={uid || ""} 
        />
      )}
    </DefaultContainer>
  );
}
