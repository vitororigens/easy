import { useNavigation } from "@react-navigation/native";
import React, { ReactNode, useState } from "react";
import { Modal, Platform, View } from "react-native";
import { NewItem } from "../../screens/NewItem";
import { NewItemTask } from "../../screens/NewItemTask";
import { NewLaunch } from "../../screens/NewLaunch";

import { useTheme } from "styled-components/native";
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
  customBg?: string
  type?: "PRIMARY" | "SECONDARY";
  closeModalFn?: () => void;
  addActionFn?: () => void
  showMonthFilter?: boolean;
  showCategoryFilter?: boolean;
  showMinValueFilter?: boolean;
  showMaxValueFilter?: boolean;
};

export function DefaultContainer({
  children,
  title,
  subtitle,
  closeModalFn,
  addActionFn,
  customBg,
  showCategoryFilter,
  showMaxValueFilter,
  showMinValueFilter,
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
  showMonthFilter = true,
}: DefaultContainerProps) {
  const navigation = useNavigation();
  const {COLORS} = useTheme()
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showNewItemMarketplace, setShowNewItemMarketplace] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false);
  const [showFilterPickerModal, setShowFilterPickerModal] = useState(false);
  const [selectedItemId, setSelectItemId] = useState('');

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
    navigation.navigate('newitemtask', { selectedItemId: documentId });
  }

  function handleNewNotes(documentId: string) {
    navigation.navigate('newnotes', { selectedItemId: documentId });
  }

  function handleNewItemMarketplace(documentId: string) {
    navigation.navigate('newitem', { selectedItemId: documentId });
  }

  function handleShowFilter() {
    navigation.navigate('filter', {showCategoryFilter, showMaxValueFilter, showMinValueFilter, showMonthFilter});
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewItemModal}
        onRequestClose={closeModals}
      >
        <View style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0
        }}>
          <NewItemTask showButtonSave closeBottomSheet={closeModals} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewLaunchModal}
        onRequestClose={closeModals}
      >
        <View style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0
        }}>
          <NewLaunch closeBottomSheet={closeModals} showButtonSave />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewItemMarketplace}
        onRequestClose={closeModals}
      >
        <View style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0
        }}>
          <NewItem showButtonSave closeBottomSheet={closeModals} />

        </View>
      </Modal>
    </Container>
  );
}
