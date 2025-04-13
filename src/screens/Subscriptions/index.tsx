import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { DefaultContainer } from "../../components/DefaultContainer";
import { deleteSubscription } from "../../services/firebase/subscription.firebase";
import { Subscription } from "../../services/firebase/subscription.firebase";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";

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
  MenuButton,
  MenuOptions,
  MenuOption,
  MenuOptionText,
} from "./styles";
import { formatCurrency } from "../../utils/formatCurrency";
import { dataMask } from "../../utils/mask";
import Popover from "react-native-popover-view";

export function Subscriptions() {
  const navigation = useNavigation();
  const user = useUserAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("subscriptions")
      .where("userId", "==", user?.uid || "")
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Subscription[];
          setSubscriptions(data);
          setLoading(false);
        },
        (err) => {
          console.error("Erro ao carregar assinaturas:", err);
          setError(true);
          setLoading(false);
        }
      );

    return () => unsubscribe(); // Remove o listener ao desmontar o componente
  }, [user?.uid]);

  const filteredSubscriptions = subscriptions.filter(
    (sub) => sub.status === showActive
  );

  const handleEdit = (subscription: Subscription) => {
    console.log("Edit subscription:", subscription);
    if (subscription.id) {
      navigation.navigate("new-subscription", { selectedItemId: subscription.id });
    }
  };

  const handleDelete = async (subscription: Subscription) => {
    Alert.alert(
      "Excluir Assinatura",
      "Tem certeza que deseja excluir esta assinatura?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              if (subscription.id) {
                await deleteSubscription(subscription.id);
              }
            } catch (error) {
              console.error("Erro ao excluir assinatura:", error);
              Alert.alert("Erro", "Não foi possível excluir a assinatura");
            }
          },
        },
      ]
    );
  };

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

        <FlatList<Subscription>
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id || ""}
          renderItem={({ item }) => (
            <ItemContainer onPress={() => handleEdit(item)}>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemValue>{formatCurrency(item.value)}</ItemValue>
              <ItemDate>Vence em {dataMask(item.dueDate)}</ItemDate>
              <ItemStatus active={item.status}>
                {item.status ? "Ativa" : "Cancelada"}
              </ItemStatus>
              <Popover
                isVisible={menuVisible === item.id}
                onRequestClose={() => setMenuVisible(null)}
                from={
                  <MenuButton onPress={() => setMenuVisible(item.id || null)}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                  </MenuButton>
                }
              >
                <MenuOptions>
                  <MenuOption
                    onPress={() => {
                      setMenuVisible(null);
                      handleEdit(item);
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#333" />
                    <MenuOptionText>Editar</MenuOptionText>
                  </MenuOption>
                  <MenuOption
                    onPress={() => {
                      setMenuVisible(null);
                      handleDelete(item);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <MenuOptionText style={{ color: "#FF3B30" }}>
                      Excluir
                    </MenuOptionText>
                  </MenuOption>
                </MenuOptions>
              </Popover>
            </ItemContainer>
          )}
        />
      </Container>
    </DefaultContainer>
  );
}