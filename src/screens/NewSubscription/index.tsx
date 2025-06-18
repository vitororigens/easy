import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "react-native-toast-notifications";
import { useUserAuth } from "../../hooks/useUserAuth";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { createSubscription, updateSubscription } from "../../services/firebase/subscription.firebase";
import { Subscription } from "../../services/firebase/subscription.firebase";
import firestore from "@react-native-firebase/firestore";

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
import { currencyMask } from "../../utils/mask";

type FormData = {
  name: string;
  value: string;
  dueDay: string;
  description?: string;
  status: boolean;
};

export function NewSubscription() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useUserAuth();
  const { selectedItemId } = route.params as { selectedItemId?: string };
  const [showDescription, setShowDescription] = useState(false);
  const [status, setStatus] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      status: true
    }
  });

  useEffect(() => {
    if (selectedItemId) {
      fetchSubscription();
    }
  }, [selectedItemId]);

  async function fetchSubscription() {
    try {
      const doc = await firestore()
        .collection("subscriptions")
        .doc(selectedItemId)
        .get();

      if (doc.exists()) {
        const subscription = doc.data() as Subscription;

        setValue("name", subscription.name);
        setValue("value", subscription.value.toString());
        setValue("dueDay", subscription.dueDay.toString());
        setValue("status", subscription.status);
        setStatus(subscription.status);

        if (subscription.description) {
          setValue("description", subscription.description);
          setShowDescription(true);
        }
      } else {
        console.error("Assinatura não encontrada");
        Toast.show("Assinatura não encontrada", { type: "error" });
      }
    } catch (error) {
      console.error("Erro ao buscar assinatura:", error);
      Toast.show("Erro ao carregar assinatura", { type: "error" });
    }
  }

  async function onSubmit(data: FormData) {
    try {
      console.log('Status sendo enviado:', data.status);
      const subscriptionData = {
        userId: user?.user?.uid || '',
        name: data.name,
        value: parseFloat(data.value),
        dueDay: parseInt(data.dueDay),
        description: data.description || '',
        status: data.status,
      };

      console.log('Dados da assinatura:', subscriptionData);

      if (selectedItemId) {
        await updateSubscription(selectedItemId, subscriptionData);
        Toast.show("Assinatura atualizada!", { type: "success" });
      } else {
        await createSubscription(subscriptionData);
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
                  name="tag"
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ex: Netflix"
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </InputContainer>

          <InputContainer>
            <Label>Valor</Label>
            <Controller
              control={control}
              name="value"
              rules={{ required: "Valor é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  name="dollar"
                  onChangeText={(text) => onChange(currencyMask(text))}
                  value={value}
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  errorMessage={errors.value?.message}
                />
              )}
            />
          </InputContainer>

          <InputContainer>
            <Label>Dia do Vencimento</Label>
            <Controller
              control={control}
              name="dueDay"
              rules={{ 
                required: "Dia do vencimento é obrigatório",
                min: { value: 1, message: "Dia deve ser entre 1 e 31" },
                max: { value: 31, message: "Dia deve ser entre 1 e 31" }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  name="calendar"
                  onChangeText={onChange}
                  value={value}
                  placeholder="Dia (1-31)"
                  keyboardType="numeric"
                  errorMessage={errors.dueDay?.message}
                />
              )}
            />
          </InputContainer>

          {showDescription && (
            <InputContainer>
              <Label>Descrição (opcional)</Label>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Input
                    name="align-left"
                    onChangeText={onChange}
                    value={value || ''}
                    placeholder="Adicione uma descrição"
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            </InputContainer>
          )}

          <InputContainer>
            <Label>Status</Label>
            <SelectContainer>
              <SelectButton
                active={status}
                onPress={() => {
                  setStatus(true);
                  setValue("status", true);
                }}
              >
                <SelectText active={status}>Ativa</SelectText>
              </SelectButton>
              <SelectButton
                active={!status}
                onPress={() => {
                  setStatus(false);
                  setValue("status", false);
                }}
              >
                <SelectText active={!status}>Cancelada</SelectText>
              </SelectButton>
            </SelectContainer>
          </InputContainer>

          <Button
            title={selectedItemId ? "Atualizar" : "Criar"}
            onPress={handleSubmit(onSubmit)}
          />
        </Form>
      </Container>
    </DefaultContainer>
  );
}