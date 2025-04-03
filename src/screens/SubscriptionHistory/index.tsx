import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { database } from "../../libs/firebase";
import { useUserAuth } from "../../hooks/useUserAuth";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Container,
  Title,
  ContentTitle,
  Icon,
  DividerContent,
  SubTitle,
} from "./styles";

export interface ISubscriptionHistory {
  id: string;
  uid: string;
  subscriptionId: string;
  subscriptionName: string;
  price: number;
  category: string;
  canceledAt: Date;
  reason: string;
}

export function SubscriptionHistory() {
  const navigation = useNavigation();
  const user = useUserAuth();
  const { COLORS } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<ISubscriptionHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, [user?.uid]);

  async function fetchHistory() {
    if (!user?.uid) return;
    try {
      setIsLoaded(true);
      const historyRef = database.collection("SubscriptionHistory");
      const snapshot = await historyRef.where("uid", "==", user.uid).get();
      
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        canceledAt: doc.data().canceledAt.toDate(),
      })) as ISubscriptionHistory[];

      setHistory(historyData);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setIsLoaded(false);
    }
  }

  if (isLoaded || !user?.uid) {
    return <Loading />;
  }

  return (
    <DefaultContainer title="Histórico de Assinaturas" backButton>
      <Container>
        <ContentTitle>
          <Title>Histórico de Assinaturas Canceladas</Title>
        </ContentTitle>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: COLORS.TEAL_600,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 10,
                }}
              >
                <Title style={{ color: COLORS.WHITE }}>
                  {item.subscriptionName}
                </Title>
                <SubTitle>
                  R$ {item.price.toFixed(2)} - {item.category}
                </SubTitle>
                <SubTitle>
                  Cancelado em: {format(item.canceledAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </SubTitle>
                <SubTitle>Motivo: {item.reason}</SubTitle>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <LoadData
              imageSrc={require("../../assets/illustrations/expense.png")}
              title="Nenhum histórico"
              subtitle="Você ainda não cancelou nenhuma assinatura"
              width={300}
            />
          }
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      </Container>
    </DefaultContainer>
  );
} 