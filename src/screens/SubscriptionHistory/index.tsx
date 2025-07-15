import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useSubscriptionsCollection } from "../../hooks/useSubscriptionsCollection";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Subscription } from "../../services/firebase/subscription.firebase";

import {
  Container,
  Title,
  ItemContainer,
  ItemTitle,
  ItemValue,
  ItemDate,
  EmptyContainer,
  EmptyText,
} from "./styles";

export function SubscriptionHistory() {
  const { subscriptions, loading, error } = useSubscriptionsCollection();

  const canceledSubscriptions = subscriptions.filter(sub => !sub.status);

  if (loading) {
    return (
      <DefaultContainer title="Histórico de Assinaturas" backButton>
        <Container>
          <ActivityIndicator size="large" color="#6B4EFF" />
        </Container>
      </DefaultContainer>
    );
  }

  if (error) {
    return (
      <DefaultContainer title="Histórico de Assinaturas" backButton>
        <Container>
          <EmptyText>Erro ao carregar assinaturas</EmptyText>
        </Container>
      </DefaultContainer>
    );
  }

  if (canceledSubscriptions.length === 0) {
    return (
      <DefaultContainer title="Histórico de Assinaturas" backButton>
        <Container>
          <EmptyContainer>
            <EmptyText>Nenhuma assinatura cancelada encontrada</EmptyText>
          </EmptyContainer>
        </Container>
      </DefaultContainer>
    );
  }

  return (
    <DefaultContainer title="Histórico de Assinaturas" backButton>
      <Container>
        <Title>Assinaturas Canceladas</Title>

        <FlatList<Subscription>
          data={canceledSubscriptions}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item }) => (
            <ItemContainer>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemValue>R$ {typeof item.value === 'number' ? item.value.toFixed(2) : '0.00'}</ItemValue>
              <ItemDate>
                Cancelada em {format(new Date(item.updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </ItemDate>
            </ItemContainer>
          )}
        />
      </Container>
    </DefaultContainer>
  );
} 