import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { z } from "zod";
import { LoadingIndicator } from "../../components/Loading/style";
import { useUserAuth } from "../../hooks/useUserAuth";
import { currencyMask, currencyUnMask, formatCurrency } from "../../utils/mask";
import { findMarketById } from "../../services/firebase/market.firebase";
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
import { Timestamp } from "@react-native-firebase/firestore";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { ShareWithUsers } from "../../components/ShareWithUsers";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useMarket } from "../../contexts/MarketContext";
import { Select } from "../../components/Select";

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
  formattedDate: z.string().min(1, "Data é obrigatória"),
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
  showButtonEdit,
  showButtonSave,
  showButtonRemove,
  selectedItemId,
}: IMarketItemProps) => {
  console.log("MarketItem props:", {
    closeBottomSheet,
    onCloseModal,
    showButtonEdit,
    showButtonSave,
    showButtonRemove,
    selectedItemId,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const loggedUser = useUserAuth();
  const { addMarket, updateMarket, deleteMarket, error } = useMarket();

  const uid = loggedUser.user?.uid;
  const { isCreator = true, selectedItemId: routeSelectedItemId } = route.params as {
    selectedItemId?: string;
    isCreator: boolean;
  };
  console.log("isCreator:", isCreator);
  console.log("selectedItemId from route:", routeSelectedItemId);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "1",
      price: "",
      category: "outros",
      measurement: "un",
      observation: "",
      formattedDate: new Date().toLocaleDateString("pt-BR"),
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

      const marketId = await addMarket({
        name,
        category,
        measurement,
        observation,
        price: price ? currencyUnMask(price) : 0,
        quantity: quantity ? parseFloat(quantity) : 1,
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

      if (!marketId) {
        throw new Error("Failed to create market");
      }

      if (sharedUsers.length > 0) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === "accepted"
          );

          const possibleSharingRequestExists = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );

          const message = alreadySharing
            ? `${loggedUser.user?.displayName} adicionou um novo item ao mercado`
            : `${loggedUser.user?.displayName} convidou você para compartilhar um item de mercado`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: user.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "market",
                id: marketId,
              },
              title: "Compartilhamento de mercado",
              description: message,
              createdAt: Timestamp.now(),
            }),
            ...(!alreadySharing && !possibleSharingRequestExists
              ? [
                createSharing({
                  invitedBy: uid as string,
                  status: ESharingStatus.PENDING,
                  target: user.uid,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
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

      Toast.show("Item adicionado!", { type: "success" });
      reset();
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao adicionar o item: ", error);
      Toast.show("Erro ao adicionar o item", { type: "error" });
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
    if (!routeSelectedItemId) {
      console.error("Nenhum documento selecionado para edição!");
      return;
    }
    try {
      setLoading(true);
      await updateMarket(routeSelectedItemId, {
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

      Toast.show("Item atualizado!", { type: "success" });
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao atualizar o documento:", error);
      Toast.show("Erro ao atualizar o item", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarket = async () => {
    if (!routeSelectedItemId) {
      console.error("Nenhum documento selecionado para exclusão!");
      return;
    }

    try {
      setLoading(true);
      await deleteMarket(routeSelectedItemId);
      Toast.show("Item Excluído!", { type: "success" });
      navigation.navigate("tabroutes", {
        screen: "Market",
        params: { reload: true },
      });
      onCloseModal && onCloseModal();
      closeBottomSheet && closeBottomSheet();
    } catch (error) {
      console.error("Erro ao excluir o documento de item:", error);
      Toast.show("Erro ao excluir o item", { type: "error" });
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
    if (routeSelectedItemId) {
      console.log("selectedItemId from route:", routeSelectedItemId);
      const findNote = async () => {
        try {
          console.log("Buscando item com ID:", routeSelectedItemId);
          const market = await findMarketById(routeSelectedItemId);
          console.log("Item encontrado:", market);

          if (market) {
            console.log("Preenchendo formulário com dados:", {
              name: market.name,
              category: market.category,
              measurement: market.measurement,
              price: market.price,
              quantity: market.quantity,
              observation: market.observation,
              shareInfo: market.shareInfo
            });
            setValue("name", market.name);
            setValue("category", market.category);
            setValue("measurement", market.measurement);
            setValue(
              "price",
              market.price ? currencyMask(market.price.toString()) : ""
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
          Toast.show("Erro ao carregar o item", { type: "error" });
        }
      };
      findNote();
    }
  }, [routeSelectedItemId]);

  useEffect(() => {
    if (error) {
      Toast.show(error, { type: "error" });
    }
  }, [error]);

  const handleClose = () => {
    if (closeBottomSheet) closeBottomSheet();
    if (onCloseModal) onCloseModal();
  };

  return (
    <DefaultContainer hasHeader={false}
      title="Adicionar novo item"
      closeModalFn={closeBottomSheet}
      backButton>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <Title>Nome do item*</Title>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />

          <Title>Quantidade</Title>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={(value) => onChange(formatQuantity(value))}
                onBlur={onBlur}
                keyboardType="numeric"
              />
            )}
          />

          <Title>Valor</Title>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={(text) => {
                  const masked = currencyMask(text);
                  onChange(masked);
                }}
                onBlur={onBlur}
                placeholder="0,00"
                keyboardType="numeric"
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
            <View>
              <Title>Categoria</Title>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    placeholder="Selecione uma categoria"
                    onValueChange={onChange}
                    value={value}
                    items={[
                      { label: "Açougue", value: "acougue" },
                      { label: "Bebidas", value: "bebidas" },
                      { label: "Biscoitos", value: "biscoitos" },
                      { label: "Congelados", value: "congelados" },
                      { label: "Condimentos e temperos", value: "condimentos" },
                      { label: "Doces e snacks", value: "doces_snacks" },
                      { label: "Enlatados", value: "enlatados" },
                      { label: "Higiene pessoal", value: "higiene" },
                      { label: "Hortifruti", value: "hortifruti" },
                      { label: "Laticínios", value: "laticinios" },
                      { label: "Limpeza", value: "limpeza" },
                      { label: "Massas e grãos", value: "massas_graos" },
                      { label: "Matinais (café, cereal...)", value: "matinais" },
                      { label: "Mercearia", value: "mercearia" },
                      { label: "Outros", value: "outros" },
                      { label: "Padaria", value: "padaria" },
                      { label: "Pet shop", value: "petshop" },
                      { label: "Produtos naturais", value: "naturais" },
                      { label: "Utilidades domésticas", value: "utilidades" },
                    ]}
                  />
                )}
              />
              <Title>Medida</Title>
              <Controller
                control={control}
                name="measurement"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    placeholder="Selecione uma medida"
                    onValueChange={onChange}
                    value={value}
                    items={[
                      { label: "Unidade", value: "un" },
                      { label: "Quilograma", value: "kg" },
                      { label: "Litro", value: "l" },
                      { label: "Metro", value: "m" },
                    ]}
                  />
                )}
              />

              <Title>Observação</Title>
              <Controller
                control={control}
                name="observation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
              />
            </View>
          )}

          <FormProvider {...form}>
            <ShareWithUsers
            control={control}
            name="sharedUsers"
            />
          </FormProvider>

          <View style={{ marginBottom: 10, height: 150 }}>
            <Button
              style={{ marginBottom: 10 }}
              onPress={
                isEditing
                  ? handleSubmit(handleUpdateMarket, onInvalid)
                  : handleSubmit(handleCreateMarket, onInvalid)
              }
            >
              <Title>{loading ? <LoadingIndicator /> : "Salvar"}</Title>
            </Button>

            {showButtonRemove && (
              <Button
                style={{ marginBottom: 10 }}
                onPress={handleDeleteMarket}
              >
                <Title>Excluir</Title>
              </Button>
            )}
          </View>
        </Content>
      </ScrollView>
    </DefaultContainer>
  );
};
