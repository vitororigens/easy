import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { currencyMask, currencyUnMask } from "../../utils/currency";
import {
  Button,
  ButtonPlus,
  Content,
  Input,
  Plus,
  Separator,
  Span,
  SubTitle,
  Title,
} from "./styles";
import { getInitials } from "../../utils/getInitials";
import { Timestamp } from "firebase/firestore";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import {
  createMarket,
  deleteMarket,
  findMarketById,
  updateMarket,
} from "../../services/firebase/market.firebase";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { ShareWithUsers } from "../../components/ShareWithUsers";

type IMarketItemProps = {
  closeBottomSheet?: () => void;
  onCloseModal?: () => void;
  showButtonEdit?: boolean;
  showButtonSave?: boolean;
  showButtonRemove?: boolean;
  selectedItemId?: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome da Tarefa é obrigatório"),
  quantity: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  measurement: z.string().optional(),
  observation: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    })
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const MarketItem = ({
  closeBottomSheet,
  onCloseModal,
}: IMarketItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const loggedUser = useUserAuth();

  const uid = loggedUser?.uid;
  const { selectedItemId, isCreator = true } = route.params as {
    selectedItemId?: string;
    isCreator: boolean;
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "1",
      price: "",
      category: "",
      measurement: "un",
      observation: "",
      sharedUsers: [],
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = form;

  function formatQuantity(quantity: string) {
    const formattedQuantity = quantity
      .replace(/\D/g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return formattedQuantity;
  }

  const handleCreateMarket = async ({
    name,
    category,
    measurement,
    observation,
    price,
    quantity,
    sharedUsers,
  }: FormSchemaType) => {
    try {
      if (!uid) return;
      setLoading(true);
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });

      const createdMarket = await createMarket({
        name,
        category,
        measurement,
        observation,
        price: price ? currencyUnMask(price) : 0,
        quantity: quantity ? parseFloat(quantity) : 1,
        createdAt: Timestamp.now(),
        uid,
        shareWith: sharedUsers.map((user) => user.uid),
        shareInfo: sharedUsers.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          acceptedAt: usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === ESharingStatus.ACCEPTED
          )
            ? Timestamp.now()
            : null,
        })),
      });

      Toast.show("Item adicionado!", { type: "success" });

      if (sharedUsers.length > 0) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );

          const message = alreadySharing
            ? `${loggedUser?.displayName} adicionou um novo item ao mercado`
            : `${loggedUser?.displayName} convidou você para compartilhar um item de mercado`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: user.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "market",
                id: createdMarket.id,
              },
              title: "Compartilhamento de mercado",
              description: message,
            }),
            ...(!alreadySharing
              ? [
                  createSharing({
                    invitedBy: uid as string,
                    status: ESharingStatus.PENDING,
                    target: user.uid,
                  }),
                ]
              : []),
            sendPushNotification({
              title: "Compartilhamento de mercado",
              message,
              uid: user.uid,
            }),
          ]);
        }
      }

      reset();
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      setLoading(false);
      console.error("Erro ao adicionar o item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMarket = async ({
    name,
    sharedUsers,
    category,
    measurement,
    observation,
    price,
    quantity,
  }: FormSchemaType) => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    try {
      await updateMarket({
        id: selectedItemId,
        name,
        category,
        measurement,
        observation,
        price: price ? currencyUnMask(price) : 0,
        quantity: quantity ? parseFloat(quantity) : 1,
        shareInfo: sharedUsers.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          acceptedAt: user.acceptedAt,
        })),
        shareWith: sharedUsers.map((user) => user.uid),
      });
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao atualizar o documento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarket = async () => {
    if (!selectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    try {
      setLoading(true);
      await deleteMarket(selectedItemId);
      Toast.show("Item Excluído!", { type: "success" });
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao excluir o documento de item:", error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    Alert.alert(
      "Atenção!",
      "Por favor, preencha todos os campos obrigatórios antes de salvar."
    );
  };

  function handleShowAdvanced() {
    setShowAdvanced((prevState) => !prevState);
  }

  useEffect(() => {
    if (selectedItemId) {
      const findNote = async () => {
        try {
          const market = await findMarketById(selectedItemId);

          if (market) {
            setValue("name", market.name);
            setValue("category", market.category);
            setValue("measurement", market.measurement);
            setValue(
              "price",
              market.price?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? ""
            );
            setValue("quantity", String(market.quantity ?? ""));
            setValue("observation", market.observation);
            setValue(
              "sharedUsers",
              market.shareInfo.map((si) => ({
                uid: si.uid,
                userName: si.userName,
                acceptedAt: si.acceptedAt,
              })) ?? []
            );
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Erro ao obter o documento:", error);
        }
      };
      findNote();
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
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={isCreator}
              />
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
                    name="quantity"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        keyboardType="numeric"
                        value={formatQuantity(value ?? "")}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        editable={isCreator}
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
                    name="measurement"
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
                        disabled={!isCreator}
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
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={(value) => onChange(currencyMask(value))}
                    onBlur={onBlur}
                    placeholder="0,00"
                    keyboardType="numeric"
                    editable={isCreator}
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
                  name="category"
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
                      disabled={!isCreator}
                    />
                  )}
                />
              </View>

              <Title>
                Observação <Span> (opcional)</Span>
              </Title>
              <Controller
                control={control}
                name="observation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={isCreator}
                  />
                )}
              />
            </>
          )}

          <Separator />

          {isCreator && (
            <FormProvider {...form}>
              <ShareWithUsers />
            </FormProvider>
          )}

          <View style={{ marginBottom: 10, height: 150 }}>
            <Button
              style={{ marginBottom: 10 }}
              onPress={
                isEditing
                  ? handleSubmit(handleUpdateMarket, onInvalid)
                  : handleSubmit(handleCreateMarket, onInvalid)
              }
              disabled={loading}
            >
              <Title>{loading ? <LoadingIndicator /> : "Salvar"}</Title>
            </Button>
            {!!selectedItemId && (
              <Button
                style={{ marginBottom: 10 }}
                onPress={handleDeleteMarket}
                disabled={loading}
              >
                <Title>{loading ? <LoadingIndicator /> : "Excluir"}</Title>
              </Button>
            )}
          </View>
        </Content>
      </ScrollView>
    </DefaultContainer>
  );
};
