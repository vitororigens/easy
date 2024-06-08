import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, ScrollView, View } from "react-native";
import { useTheme } from "styled-components/native";
//
import { Content, Divider, Header, SubTitle, Title } from "./styles";
//
import { Container } from "../../components/Container";
import { DefaultContainer } from "../../components/DefaultContainer";
import { LoadData } from "../../components/LoadData";
import { Loading } from "../../components/Loading";
//
import { Items } from "../../components/Items";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";
import { NewLaunch } from "../NewLaunch";

const screenWidth = Dimensions.get("window").width;

export function PiggyBank() {
  const user = useUserAuth();
  const PiggyBankData = useFirestoreCollection('PiggyBank');
  const { selectedMonth } = useMonth();
  const uid = user?.uid;
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");



  const { COLORS } = useTheme();

  const userPiggyBankData = PiggyBankData.filter(item => item.uid === uid && item.month === selectedMonth);
  const valueTotal = userPiggyBankData.reduce((total, item) => total + parseFloat(item.valueItem), 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || uid === undefined) {
    return <Loading />;
  }

  function closeModals() {
    setShowNotesModal(false);
  }


  function handleEditItem(documentId: string) {
    setShowNotesModal(true);
    setSelectedItemId(documentId);
  }

  function handleDeleteItem(documentId: string) {
    database
      .collection("PiggyBank")
      .doc(documentId)
      .delete()
      .then(() => {
        Toast.show("Lançamento excluído!", { type: "success" });
      })
      .catch((error) => {
        console.error("Erro ao excluir a nota: ", error);
      });
  }

  return (
    <DefaultContainer newLaunch monthButton backButton>
      <Container type="SECONDARY" title="Cofrinho">
        <Content>
          <Header>
            <Divider />
          </Header>

          <View style={{ top: 40 }}>
            <View>
              {valueTotal > 0 ? (
                <>
                  <SubTitle style={{ textAlign: 'center' }} type="PRIMARY">Parabéns</SubTitle>
                  <Title style={{ textAlign: 'center', width: '100%' }}>
                    Você economizou {formatCurrency(valueTotal.toString())} esse mês!
                  </Title>
                  <Title style={{ textAlign: 'center', width: '100%', marginBottom: 40 }}>
                    Guarde em uma poupança para render mais.
                  </Title>
                </>
              ) : (
                <>
                  <View style={{
                    padding: 20
                  }}>
                    <SubTitle style={{ textAlign: 'center', paddingBottom: 40 }} type="PRIMARY">Comece a economizar!</SubTitle>
                    <Title style={{ textAlign: 'center', width: '100%' }}>
                      Comece a controlar e organizar suas finanças, comece guardando dinheiro em uma poupança e anote aqui para ter mais controle
                    </Title>
                    <Title style={{ textAlign: 'center', width: '100%', marginBottom: 40 }}>
                      Guarde em uma poupança para render mais.
                    </Title>
                  </View>
                </>
              )}
            </View>

            <View>
              {PiggyBankData.filter(item => item.uid === uid).length === 0 ? (
                <ScrollView>
                  <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui lançamentos de entradas! Comece adicionando uma nova entrada.' />
                </ScrollView>
              ) : (
                <FlatList
                  data={userPiggyBankData}
                  renderItem={({ item }) => (
                    <Items
                      onDelete={() => handleDeleteItem(item.id)}
                      onEdit={() => handleEditItem(item.id)}
                      showItemPiggyBank
                      type={item.description}
                      category={item.name}
                      date={item.date}
                      valueTransaction={formatCurrency(item.valueItem)}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </Content>
      </Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >

        <NewLaunch selectedItemId={selectedItemId}
          showButtonSave
          showButtonRemove
          closeBottomSheet={closeModals} />

      </Modal>
    </DefaultContainer>
  );
}
