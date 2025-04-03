import React, { useEffect, useState } from "react";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { database } from "../../libs/firebase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Button,
  Header,
  NavBar,
  Title,
  ContentTitle,
  Icon,
  DividerContent,
  Container,
  SubTitle,
} from "./styles";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";

export interface ISubscription {
  id: string;
  uid: string;
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  createdAt: Date;
  status: boolean;
}

export function Subscriptions() {
  const user = useUserAuth();
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [activeButton, setActiveButton] = useState("ativas");

  useEffect(() => {
    fetchSubscriptions();
  }, [user?.uid]);

  async function fetchSubscriptions() {
    if (!user?.uid) return;
    try {
      setIsLoaded(true);
      const subscriptionsRef = useFirestoreCollection("Task");
      const snapshot = await subscriptionsRef.where("uid", "==", user.uid).get();
      
      const subscriptionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as ISubscription[];

      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
      Toast.show("Erro ao carregar assinaturas", { type: "error" });
    } finally {
      setIsLoaded(false);
    }
  }

  function handleNewSubscription() {
    navigation.navigate("new-subscription", { selectedItemId: "" });
  }

  function handleEditSubscription(id: string) {
    navigation.navigate("new-subscription", { selectedItemId: id });
  }

  async function handleDeleteSubscription(id: string) {
    try {
      await database.collection("Subscriptions").doc(id).delete();
      Toast.show("Assinatura excluída!", { type: "success" });
      fetchSubscriptions();
    } catch (error) {
      console.error("Erro ao excluir assinatura:", error);
      Toast.show("Erro ao excluir assinatura", { type: "error" });
    }
  }

  function handleButtonClick(buttonName: string) {
    setActiveButton(buttonName);
  }

  const filteredSubscriptions = subscriptions.filter(sub => 
    activeButton === "ativas" ? sub.status : !sub.status
  );

  if (isLoaded || !user?.uid) {
    return <Loading />;
  }

  return (
    <DefaultContainer onNewSubscription={handleNewSubscription} monthButton title="Assinaturas">
      <Header>
        <NavBar>
          <Button
            onPress={() => handleButtonClick("ativas")}
            active={activeButton !== "ativas"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Ativas</Title>
          </Button>
          <Button
            onPress={() => handleButtonClick("canceladas")}
            active={activeButton !== "canceladas"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Canceladas</Title>
          </Button>
        </NavBar>
      </Header>

      <Container>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditSubscription(item.id)}>
              <View
                style={{
                  backgroundColor: COLORS.TEAL_600,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 10,
                }}
              >
                <Title style={{ color: COLORS.WHITE }}>{item.name}</Title>
                <SubTitle>
                  R$ {item.price.toFixed(2)} - {item.billingCycle}
                </SubTitle>
                <SubTitle>
                  Próxima cobrança: {format(new Date(item.nextBillingDate), "dd 'de' MMMM", { locale: ptBR })}
                </SubTitle>
                <SubTitle>Categoria: {item.category}</SubTitle>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <LoadData
              imageSrc={require("../../assets/illustrations/expense.png")}
              title="Nenhuma assinatura"
              subtitle="Adicione uma assinatura clicando em +"
              width={300}
            />
          }
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      </Container>
    </DefaultContainer>
  );
} 