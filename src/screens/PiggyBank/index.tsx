import React, { useEffect, useState } from "react";
import { FlatList, Modal, Platform, View } from "react-native";
//
import { Content, SubTitle, Title } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
//
import { Toast } from "react-native-toast-notifications";
import { Items } from "../../components/Items";
import { useMonth } from "../../context/MonthProvider";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../services";
import { formatCurrency } from "../../utils/formatCurrency";
import { NewLaunch } from "../NewLaunch";

export function PiggyBank() {
  const user = useUserAuth();
  const PiggyBankData = useFirestoreCollection("PiggyBank");
  const { selectedMonth } = useMonth();
  const uid = user?.uid;
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const userPiggyBankData = PiggyBankData.filter(
    (item) => item.uid === uid && item.month === selectedMonth
  );
  const valueTotal = userPiggyBankData.reduce(
    (total, item) => total + parseFloat(item.valueItem),
    0
  );

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
    <DefaultContainer backButton title="Cofrinho" newLaunch>
      <Content>
        <View style={{ top: 40 }}>
          <View>
            {valueTotal > 0 ? (
              <>
                <SubTitle style={{ textAlign: "center" }} type="PRIMARY">
                  Parabéns
                </SubTitle>
                <Title style={{ textAlign: "center", width: "100%" }}>
                  Você economizou {formatCurrency(valueTotal.toString())} esse
                  mês!
                </Title>
                <Title
                  style={{
                    textAlign: "center",
                    width: "100%",
                    marginBottom: 40,
                  }}
                >
                  Guarde em uma poupança para render mais.
                </Title>
              </>
            ) : (
              <>
                <View
                  style={{
                    padding: 20,
                  }}
                >
                  <SubTitle
                    style={{ textAlign: "center", paddingBottom: 40 }}
                    type="PRIMARY"
                  >
                    Transforme pequenas economias em grandes conquistas!
                  </SubTitle>
                  <Title style={{ textAlign: "center", width: "100%" }}>
                    A função Cofrinho é perfeita para quem quer começar a
                    economizar sem complicação. Insira os valores que você
                    conseguir poupar e veja como pequenas economias podem fazer
                    uma grande diferença no seu futuro financeiro.
                  </Title>
                </View>
              </>
            )}
          </View>

          <View>
            {PiggyBankData.filter((item) => item.uid === uid).length ===
            0 ? null : (
              <FlatList
                style={{ marginTop: -40 }}
                data={userPiggyBankData}
                renderItem={({ item }) => (
                  <Items
                    onDelete={() => handleDeleteItem(item.id)}
                    onEdit={() => handleEditItem(item.id)}
                    showItemPiggyBank
                    type={item.description}
                    category={item.name}
                    date={item.date}
                    valueTransaction={
                      item.valueItem
                        ? formatCurrency(item.valueItem)
                        : "R$ 0,00"
                    }
                  />
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
                ListFooterComponent={<View style={{ height: 90 }} />}
              />
            )}
          </View>
        </View>
      </Content>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <NewLaunch
            selectedItemId={selectedItemId}
            showButtonSave
            showButtonRemove
            closeBottomSheet={closeModals}
          />
        </View>
      </Modal>
    </DefaultContainer>
  );
}
