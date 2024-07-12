import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useState } from "react";
import { Modal } from "react-native";
import { NewItem } from "../../screens/NewItem";
import { NewItemTask } from "../../screens/NewItemTask";
import { NewLaunch } from "../../screens/NewLaunch";
import { NewNotes } from "../../screens/NewNotes";
import { Filter } from "../Filter";
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
  type?: "PRIMARY" | "SECONDARY";
  closeModalFn?: () => void;
  addActionFn?: () => void
};

export function DefaultContainer({
  children,
  title,
  subtitle,
  closeModalFn,
  addActionFn,
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
}: DefaultContainerProps) {
  const navigation = useNavigation();
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showNewItemMarketplace, setShowNewItemMarketplace] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false);
  const [showFilterPickerModal, setShowFilterPickerModal] = useState(false);

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

  function handleNewItem() {
    setShowNewItemModal(true);
  }

  function handleNewNotes() {
    setShowNotesModal(true);
  }

  function handleNewItemMarketplace() {
    setShowNewItemMarketplace(true);
  }

  function handleNewLaunch() {
    setShowNewLaunchModal(true);
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
            onPress={() => setShowFilterPickerModal(true)}
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
            onPress={handleNewItem}
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
            onPress={handleNewItemMarketplace}
          >
            <Icon name="add-outline" />
          </Button>
        )}
        {newNotes && (
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
              width: "35%",
            }}
            onPress={handleNewNotes}
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
      <Content>{children}</Content>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterPickerModal}
        onRequestClose={closeModals}
      >
        <Filter closeBottomSheet={closeModals} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewItemModal}
        onRequestClose={closeModals}
      >
        <NewItemTask showButtonSave closeBottomSheet={closeModals} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewLaunchModal}
        onRequestClose={closeModals}
      >
        <NewLaunch closeBottomSheet={closeModals} showButtonSave />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewItemMarketplace}
        onRequestClose={closeModals}
      >
        <NewItem showButtonSave closeBottomSheet={closeModals} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={closeModals}
      >
        <NewNotes showButtonSave closeBottomSheet={closeModals} />
      </Modal>
    </Container>
  );
}
