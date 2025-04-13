import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "styled-components/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { ModalContainer } from "../ModalContainer";
import {
  Button,
  ButtonBack,
  ButtonClose,
  Container,
  Content,
  Header,
  Icon,
  SubTitle,
  Title,
  ViewHomeCenter,
} from "./style";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-1904400573870779~6241470792";

type DefaultContainerProps = {
  children: ReactNode;
  backButton?: boolean;
  monthButton?: boolean;
  addButton?: boolean;
  newItem?: boolean;
  newLaunch?: boolean;
  listButtom?: boolean;
  showHeader?: boolean;
  newItemMarketplace?: boolean;
  newNotes?: boolean;
  hasHeader?: boolean;
  title?: string;
  subtitle?: string;
  customBg?: string;
  type?: "PRIMARY" | "SECONDARY";
  closeModalFn?: () => void;
  addActionFn?: () => void;
  onNewItemTask?: (documentId: string) => void;
  onNewNotes?: (documentId: string) => void;
  onNewItemMarketplace?: (documentId: string) => void;
  onNewLaunch?: () => void;
  onNewSubscription?: (documentId: string) => void;
};

export function DefaultContainer({
  children,
  title,
  subtitle,
  closeModalFn,
  addActionFn,
  customBg,
  type = "PRIMARY",
  newNotes = false,
  newItemMarketplace = false,
  showHeader = false,
  backButton = false,
  monthButton = false,
  addButton = false,
  newItem = false,
  newLaunch = false,
  listButtom = false,
  hasHeader = true,
  onNewItemTask,
  onNewNotes,
  onNewItemMarketplace,
  onNewLaunch,
  onNewSubscription,
}: DefaultContainerProps) {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const bannerRef = useRef<BannerAd>(null);

  // Estados
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showNewItemMarketplace, setShowNewItemMarketplace] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false);
  const [showFilterPickerModal, setShowFilterPickerModal] = useState(false);
  const [selectedItemId, setSelectItemId] = useState("");

  // Funções de manipulação de modais
  function closeModals() {
    setShowNewItemModal(false);
    setShowNewLaunchModal(false);
    setShowNewItemMarketplace(false);
    setShowListModal(false);
    setShowNotesModal(false);
    setShowFilterPickerModal(false);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleNewItemTask(documentId: string) {
    if (onNewItemTask) {
      onNewItemTask(documentId);
    } else {
      navigation.navigate("newitemtask", { selectedItemId: documentId });
    }
  }

  function handleNewNotes(documentId: string) {
    if (onNewNotes) {
      onNewNotes(documentId);
    } else {
      navigation.navigate("newnotes", { selectedItemId: documentId, isCreator: true });
    }
  }

  function handleNewSubscription(documentId: string) {
    if (onNewSubscription) {
      onNewSubscription(documentId);
    } else {
      navigation.navigate("subscription-history", { selectedItemId: documentId });
    }
  }

  function handleNewItemMarketplace(documentId: string) {
    if (onNewItemMarketplace) {
      onNewItemMarketplace(documentId);
    } else {
      navigation.navigate("market-item", { selectedItemId: documentId });
    }
  }

  function handleShowFilter() {
    navigation.navigate("filter" as never);
  }

  function handleNewLaunch() {
    if (onNewLaunch) {
      onNewLaunch();
    } else {
      setShowNewLaunchModal(true);
    }
  }

  return (
    <Container type={type}>
      <Header type={type}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {backButton && (
            <ButtonBack onPress={handleGoBack}>
              <Icon name="arrow-back-circle-outline" />
            </ButtonBack>
          )}
          {monthButton && (
            <Button onPress={handleShowFilter}>
              <Icon name="filter-outline" />
            </Button>
          )}
        </View>

        <Title type={type}>{title}</Title>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {newItem && (
            <Button onPress={() => handleNewItemTask(selectedItemId)}>
              <Icon name="add-outline" />
            </Button>
          )}

          {addActionFn && (
            <Button onPress={addActionFn}>
              <Icon name="add-outline" />
            </Button>
          )}

          {newLaunch && (
            <Button onPress={handleNewLaunch}>
              <Icon name="add-outline" />
            </Button>
          )}

          {newItemMarketplace && (
            <Button onPress={() => handleNewItemMarketplace(selectedItemId)}>
              <Icon name="add-outline" />
            </Button>
          )}

          {newNotes && (
            <Button onPress={() => handleNewNotes(selectedItemId)}>
              <Icon name="add-outline" />
            </Button>
          )}

          {onNewSubscription && (
            <Button onPress={() => handleNewSubscription(selectedItemId)}>
              <Icon name="add-outline" />
            </Button>
          )}

          {!!closeModalFn && (
            <ButtonClose onPress={closeModalFn}>
              <Icon name="close-circle-outline" />
            </ButtonClose>
          )}
        </View>
      </Header>

      <Content customBg={customBg}>{children}</Content>
    </Container>
  );
}
