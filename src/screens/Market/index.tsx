import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, Platform, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import { Cart } from "../../components/Cart";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import useHistoryMarketplaceCollections from "../../hooks/useHistoryMarketplaceCollection";
import { useUserAuth } from "../../hooks/useUserAuth";
import { MarketItem } from "../MarketItem";
import { Button, Header, NavBar, Title } from "./styles";
import { database } from "../../libs/firebase";
import {
  deleteMarket,
  listMarkets,
  listMarketsSharedWithMe,
  listMarketsSharedByMe,
} from "../../services/firebase/market.firebase";
import { MarketTabContent } from "./MarketTabContent";
//import { SharedMarketsTabContent } from "./SharedMarketsTabContent";
import {
  createMarketHistory,
  IMarketHistory,
  listMarketHistories,
  listMarketHistoriesSharedWithMe,
} from "../../services/firebase/market-history.firebase";
import { Timestamp } from "firebase/firestore";
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from "../../services/firebase/sharing.firebase";
import { MarketHistoryTabContent } from "./MarketHistoryTabContent";
import { createNotification } from "../../services/firebase/notifications.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const modalBottom = Platform.OS === "ios" ? 50 : 60;

const sharedUserSchema = z.object({
  uid: z.string(),
  userName: z.string(),
  acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
});

type TShareInfo = {
  acceptedAt: Timestamp | null;
  uid: string;
  userName: string;
};

export interface IMarket {
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  category?: string;
  measurement?: string;
  observation?: string;
  uid: string;
  createdAt: Timestamp;
  shareWith: string[];
  shareInfo: TShareInfo[];
}

const formSchema = z.object({
  selectedMarkets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number().optional(),
      price: z.number().optional(),
      category: z.string().optional(),
      measurement: z.string().optional(),
      observation: z.string().optional(),
      uid: z.string(),
      createdAt: z.instanceof(Timestamp),
      shareWith: z.array(z.string()),
      shareInfo: z.array(sharedUserSchema),
    })
  ),
  sharedUsers: z.array(sharedUserSchema),
});

type FormSchemaType = z.infer<typeof formSchema>;

type TTabName = "market" | "history";

export const Market = ({ route }: any) => {
  const reload = route?.params?.reload;
  const [activeTab, setActiveTab] = useState<TTabName>("market");
  const [confirmItemVisible, setConfirmItemVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  // const selectedItemsId = selectedItems.map((item) => item.id);

  const navigation = useNavigation();

  const loggedUser = useUserAuth();
  const uid = loggedUser?.uid;
  const { COLORS } = useTheme();

  const history = useHistoryMarketplaceCollections("HistoryMarketplace").filter(
    (item) => item.uid === uid
  );

  const [isLoading, setIsLoading] = useState(true);
  const [myMarkets, setMyMarkets] = useState<IMarket[]>([]);
  const [sByMemarkets, setMarketsSharedByme] = useState<IMarket[]>([]);
  const [sharedMarkets, setSharedMarkets] = useState<IMarket[]>([]);
  const [marketHistories, setMarketHistories] = useState<IMarketHistory[]>([]);
  const [sharedMarketHistories, setSharedMarketHistories] = useState<
    IMarketHistory[]
  >([]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedMarkets: [],
      sharedUsers: [],
    },
  });

  const { setValue, watch } = form;

  const selectedMarkets = watch("selectedMarkets");
  const sharedUsers = watch("sharedUsers");

  const handleChangeSelectedMarkets = (markets: IMarket[]) => {
    setValue("selectedMarkets", markets);
  };

  const handleChangeTab = (buttonName: TTabName) => {
    if (buttonName === "market") {
      setModalActive(false);
      setValue("selectedMarkets", []);
    }
    setActiveTab(buttonName);
  };

  const handleCreateMarketHistory = async () => {
    if (!loggedUser) return;
    try {
      const usersInvitedByMe = await getSharing({
        profile: "invitedBy",
        uid: uid as string,
      });

      const createdMarketHistory = await createMarketHistory({
        markets: selectedMarkets,
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
        uid: loggedUser.uid,
        createdAt: Timestamp.now(),
      });

      for (const { id } of selectedMarkets) {
        await deleteMarket(id);
      }

      setMyMarkets((p) =>
        p.filter((item) => !selectedMarkets.some((m) => m.id === item.id))
      );
      setSharedMarkets((p) =>
        p.filter((item) => !selectedMarkets.some((m) => m.id === item.id))
      );
      setMarketHistories((p) => [createdMarketHistory, ...p]);

      if (sharedUsers.length > 0) {
        for (const user of sharedUsers) {
          const alreadySharing = usersInvitedByMe.some(
            (u) => u.target === user.uid
          );

          const message = alreadySharing
            ? `${loggedUser?.displayName} adicionou um novo histórico de compras`
            : `${loggedUser?.displayName} convidou você para compartilhar uma histórico de compras`;

          await Promise.allSettled([
            createNotification({
              sender: uid as string,
              receiver: user.uid,
              status: alreadySharing ? "sharing_accepted" : "pending",
              type: "sharing_invite",
              source: {
                type: "note",
                id: createdMarketHistory.id,
              },
              title: "Compartilhamento de compras",
              description: message,
            }),
            ...(!alreadySharing
              ? [
                  createSharing({
                    invitedBy: uid as string,
                    status: ESharingStatus.PENDING,
                    target: user.uid,
                  }),
                ]
              : []),
            sendPushNotification({
              title: "Compartilhamento de compras",
              message,
              uid: user.uid,
            }),
          ]);
        }
      }

      Toast.show("Lista de compras adicionada!", { type: "success" });
      removeMarketItems();
    } catch (error) {
      console.error("Erro ao adicionar lista de compras: ", error);
    }
  };

  const removeMarketItems = async () => {
    const selectedMarketsIds = selectedMarkets.map((item) => item.id);
    const batch = database.batch();

    selectedMarketsIds.forEach((i) => {
      const docRef = database.collection("Market").doc(i);
      batch.delete(docRef);
    });

    try {
      await batch.commit();
      setMyMarkets((prev) =>
        prev.filter((item) => !selectedMarketsIds.includes(item.id))
      );
      setValue("selectedMarkets", []);
      console.log("Itens removidos com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir os produtos: ", error);
    }
  };

  const fetchMarkets = async () => {
    if (!uid) return;
    try {
      setIsLoading(true);
      const [
        mMarkets,
        sMarkets,
        mMarketHistories,
        sMarketHistories,
        sMarketsByMe,
      ] = await Promise.all([
        listMarkets(uid),
        listMarketsSharedWithMe(uid),
        listMarketHistories(uid),
        listMarketHistoriesSharedWithMe(uid),
        listMarketsSharedByMe(uid),
      ]);

      if (sMarketsByMe.length > 0) {
        console.log("markets sharedWithMe", sMarketsByMe[0].id);
      }

      setMyMarkets(mMarkets);
      setSharedMarkets(sMarkets);
      setMarketHistories(mMarketHistories);
      setSharedMarketHistories(sMarketHistories);
      setMarketsSharedByme(sMarketsByMe);
    } catch (error) {
      console.error("Erro ao buscar os mercados: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (reload) {
        fetchMarkets();
      }
    }, [reload])
  );

  useEffect(() => {
    fetchMarkets();
  }, [uid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || uid === undefined) {
    return <Loading />;
  }

  return (
    <DefaultContainer
      monthButton
      newItemMarketplace
      title="Lista de Mercado"
      type="PRIMARY"
    >
      <Header>
        <NavBar>
          <Button
            onPress={() => handleChangeTab("market")}
            active={activeTab !== "market"}
            style={{ borderTopLeftRadius: 40 }}
          >
            <Title>Carrinho</Title>
          </Button>
          <Button
            onPress={() => handleChangeTab("history")}
            active={activeTab !== "history"}
            style={{ borderTopRightRadius: 40 }}
          >
            <Title>Histórico de compra</Title>
          </Button>
        </NavBar>
      </Header>

      {activeTab === "market" && (
        <MarketTabContent
          myMarkets={myMarkets}
          setMyMarkets={setMyMarkets}
          sharedMarkets={sharedMarkets.concat(sByMemarkets)}
          setSharedMarkets={setSharedMarkets}
          selectedItems={selectedMarkets}
          setSelectedItems={handleChangeSelectedMarkets}
        />
      )}

      {activeTab === "history" && (
        <MarketHistoryTabContent
          marketHistories={marketHistories}
          setMarketHistories={setMarketHistories}
          sharedMarketHistories={sharedMarketHistories}
          setSharedMarketHistories={setSharedMarketHistories}
        />
      )}

      <Modal
        visible={confirmItemVisible}
        onRequestClose={() => setConfirmItemVisible(false)}
      >
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <MarketItem
            selectedItemId={selectedItemData}
            closeBottomSheet={() => setConfirmItemVisible(false)}
            onCloseModal={() => setConfirmItemVisible(false)}
            showButtonSave
            showButtonRemove
          />
        </View>
      </Modal>

      {selectedMarkets.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor: COLORS.TEAL_600,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "auto",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
          }}
        >
          <FormProvider {...form}>
            <Cart
              buttonSave={handleCreateMarketHistory}
              selectedItems={selectedMarkets}
            />
          </FormProvider>
        </View>
      )}
    </DefaultContainer>
  );
};
