import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useRef, useState } from "react";
import { View } from "react-native";
import { useTheme } from "styled-components/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { ModalContainer } from "../ModalContainer";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-1904400573870779~6241470792";

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
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showNewItemMarketplace, setShowNewItemMarketplace] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false);
  const [showFilterPickerModal, setShowFilterPickerModal] = useState(false);
  const [selectedItemId, setSelectItemId] = useState("");
  const bannerRef = useRef<BannerAd>(null);

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
      navigation.navigate("newitemtask", { selectedItemId: documentId, isCreator: true });
    }
  }

  function handleNewNotes(documentId: string) {
    if (onNewNotes) {
      onNewNotes(documentId);
    } else {
      navigation.navigate("newnotes", { selectedItemId: documentId });
    }
  }

  function handleNewSubscription(documentId: string) {
    if (onNewSubscription) {
      onNewSubscription(documentId);
    } else {
      navigation.navigate("newsubscription", { selectedItemId: documentId });
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
        {monthButton && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
              width: "35%",
            }}
            onPress={handleShowFilter}
          >
            <Icon name="filter-outline" />
          </Button>
        )}

        {type === "PRIMARY" && <Title type={type}>{title}</Title>}

        {type === "SECONDARY" && (
          <ViewHomeCenter>
            <Title type="SECONDARY">{title}</Title>
            {subtitle && <SubTitle>{subtitle}</SubTitle>}
          </ViewHomeCenter>
        )}

        {newItem && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
            }}
            onPress={() => handleNewItemTask(selectedItemId)}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {addActionFn && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
            }}
            onPress={addActionFn}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {newLaunch && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
              position: "absolute",
              right: 0,
            }}
            onPress={handleNewLaunch}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {newItemMarketplace && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
            }}
            onPress={() => handleNewItemMarketplace(selectedItemId)}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {newNotes && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => handleNewNotes(selectedItemId)}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {onNewSubscription && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => handleNewSubscription(selectedItemId)}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {!!closeModalFn && (
          <ButtonClose
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
            }}
            onPress={closeModalFn}
          >
            <Icon name="close-circle-outline" />
          </ButtonClose>
        )}

        {backButton && (
          <ButtonBack
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 60,
            }}
            onPress={handleGoBack}
          >
            <Icon name="arrow-back-circle-outline" />
          </ButtonBack>
        )}
      </Header>
      <Content customBg={customBg}>{children}</Content>
    </Container>
  );
}
