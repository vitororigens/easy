import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "react-native-toast-notifications";
import { database } from "../../libs/firebase";
import { useUserAuth } from "../../hooks/useUserAuth";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ISubscription } from "../Subscriptions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Container,
  Title,
  Form,
  InputContainer,
  Label,
  SelectContainer,
  SelectButton,
  SelectText,
} from "./styles";
import { dataMask } from "../../utils/currency";

type FormData = {
  name: string;
  price: string;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
};

const categories = [
  "Streaming",
  "Música",
  "Jogos",
  "Software",
  "Outros",
];

const billingCycles = ["Mensal", "Trimestral", "Semestral", "Anual"];

export function NewSubscription() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useUserAuth();
  const { selectedItemId } = route.params as { selectedItemId?: string };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("");
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showBillingCycleSelect, setShowBillingCycleSelect] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (selectedItemId) {
      fetchSubscription();
    }
  }, [selectedItemId]);

  async function fetchSubscription() {
    try {
      const doc = await database
        .collection("Subscriptions")
        .doc(selectedItemId)
        .get();

      if (doc.exists) {
        const data = doc.data() as ISubscription;
        setValue("name", data.name);
        setValue("price", data.price.toString());
        setValue("billingCycle", data.billingCycle);
        setValue("nextBillingDate", data.nextBillingDate);
        setValue("category", data.category);
        setSelectedCategory(data.category);
        setSelectedBillingCycle(data.billingCycle);
      }
    } catch (error) {
      console.error("Erro ao buscar assinatura:", error);
      Toast.show("Erro ao carregar assinatura", { type: "error" });
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const subscriptionData = {
        uid: user?.uid,
        name: data.name,
        price: parseFloat(data.price),
        billingCycle: selectedBillingCycle,
        nextBillingDate: data.nextBillingDate,
        category: selectedCategory,
        createdAt: new Date(),
        status: true,
      };

      if (selectedItemId) {
        await database
          .collection("Subscriptions")
          .doc(selectedItemId)
          .update(subscriptionData);
        Toast.show("Assinatura atualizada!", { type: "success" });
      } else {
        await database.collection("Subscriptions").add(subscriptionData);
        Toast.show("Assinatura criada!", { type: "success" });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar assinatura:", error);
      Toast.show("Erro ao salvar assinatura", { type: "error" });
    }
  }

  return (
    <DefaultContainer title="Nova Assinatura" backButton>
      <Container>
        <Title>Adicione uma nova assinatura</Title>

        <Form>
          <InputContainer>
            <Label>Nome da Assinatura</Label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ex: Netflix"
                  error={errors.name?.message}
                />
              )}
            />
          </InputContainer>

          <InputContainer>
            <Label>Valor</Label>
            <Controller
              control={control}
              name="price"
              rules={{ required: "Valor é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  error={errors.price?.message}
                />
              )}
            />
          </InputContainer>

          <InputContainer>
            <Label>Ciclo de Cobrança</Label>
            <SelectContainer>
              <SelectButton
                onPress={() => setShowBillingCycleSelect(!showBillingCycleSelect)}
              >
                <SelectText>
                  {selectedBillingCycle || "Selecione o ciclo"}
                </SelectText>
              </SelectButton>
              {showBillingCycleSelect && (
                <View>
                  {billingCycles.map((cycle) => (
                    <SelectButton
                      key={cycle}
                      onPress={() => {
                        setSelectedBillingCycle(cycle);
                        setShowBillingCycleSelect(false);
                      }}
                    >
                      <SelectText>{cycle}</SelectText>
                    </SelectButton>
                  ))}
                </View>
              )}
            </SelectContainer>
          </InputContainer>

          <InputContainer>
            <Label>Próxima Cobrança</Label>
            <Controller
              control={control}
              name="nextBillingDate"
              rules={{ required: "Data é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={(text) => onChange(dataMask(text))}
                  value={value}
                  placeholder="DD/MM/AAAA"
                  error={errors.nextBillingDate?.message}
                />
              )}
            />
          </InputContainer>

          <InputContainer>
            <Label>Categoria</Label>
            <SelectContainer>
              <SelectButton
                onPress={() => setShowCategorySelect(!showCategorySelect)}
              >
                <SelectText>
                  {selectedCategory || "Selecione a categoria"}
                </SelectText>
              </SelectButton>
              {showCategorySelect && (
                <View>
                  {categories.map((category) => (
                    <SelectButton
                      key={category}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowCategorySelect(false);
                      }}
                    >
                      <SelectText>{category}</SelectText>
                    </SelectButton>
                  ))}
                </View>
              )}
            </SelectContainer>
          </InputContainer>

          <Button
            title={selectedItemId ? "Atualizar" : "Criar"}
            onPress={handleSubmit(onSubmit)}
            color="primary"
          />
        </Form>
      </Container>
    </DefaultContainer>
  );
} 