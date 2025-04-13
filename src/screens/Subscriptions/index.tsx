import React, { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { DefaultContainer } from "../../components/DefaultContainer";
import { useSubscriptionsCollection } from "../../hooks/useSubscriptionsCollection";
import { deleteSubscription } from "../../services/firebase/subscription.firebase";
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
  ItemStatus,
  EmptyContainer,
  EmptyText,
  FilterContainer,
  FilterButton,
  FilterText,
} from "./styles";
import { formatCurrency } from "../../utils/formatCurrency";
import { currencyMask, dataMask } from "../../utils/mask";

function formatDate(date: string | Date | any): Date {
  if (date instanceof Date) return date;
  if (typeof date === 'string') return new Date(date);
  if (date?.toDate) return date.toDate();
  return new Date();
}

export function Subscriptions() {
  const navigation = useNavigation();
  const { subscriptions, loading, error } = useSubscriptionsCollection();
  const [showActive, setShowActive] = useState(true);

  const filteredSubscriptions = subscriptions.filter(sub => sub.status === showActive);

  if (loading) {
    return (
      <DefaultContainer title="Assinaturas" backButton>
        <Container>
          <ActivityIndicator size="large" color="#6B4EFF" />
        </Container>
      </DefaultContainer>
    );
  }

  if (error) {
    return (
      <DefaultContainer title="Assinaturas" backButton>
        <Container>
          <EmptyText>Erro ao carregar assinaturas</EmptyText>
        </Container>
      </DefaultContainer>
    );
  }

  if (filteredSubscriptions.length === 0) {
    return (
      <DefaultContainer title="Assinaturas" backButton newSubscription>
        <Container>
          <Title>{showActive ? "Assinaturas Ativas" : "Assinaturas Canceladas"}</Title>

          <FilterContainer>
            <FilterButton active={showActive} onPress={() => setShowActive(true)}>
              <FilterText active={showActive}>Ativas</FilterText>
            </FilterButton>
            <FilterButton active={!showActive} onPress={() => setShowActive(false)}>
              <FilterText active={!showActive}>Canceladas</FilterText>
            </FilterButton>
          </FilterContainer>
          <EmptyContainer>
            <EmptyText>
              {showActive
                ? "Nenhuma assinatura ativa encontrada"
                : "Nenhuma assinatura cancelada encontrada"}
            </EmptyText>
          </EmptyContainer>
        </Container>
      </DefaultContainer>
    );
  }

  return (
    <DefaultContainer 
      title="Assinaturas" 
      backButton 
      newSubscription 
    >
      <Container>
        <Title>{showActive ? "Assinaturas Ativas" : "Assinaturas Canceladas"}</Title>

        <FilterContainer>
          <FilterButton active={showActive} onPress={() => setShowActive(true)}>
            <FilterText active={showActive}>Ativas</FilterText>
          </FilterButton>
          <FilterButton active={!showActive} onPress={() => setShowActive(false)}>
            <FilterText active={!showActive}>Canceladas</FilterText>
          </FilterButton>
        </FilterContainer>

        <FlatList<Subscription>
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item }) => (
            <ItemContainer>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemValue>{formatCurrency(item.value)}</ItemValue>
              <ItemDate>
                Vence em {dataMask(item.dueDate)}
              </ItemDate>
              <ItemStatus active={item.status}>
                {item.status ? "Ativa" : "Cancelada"}
              </ItemStatus>
            </ItemContainer>
          )}
        />
      </Container>
    </DefaultContainer>
  );
} 