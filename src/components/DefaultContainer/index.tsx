import { useNavigation } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import {
  Button,
  ButtonBack,
  ButtonClose,
  Container,
  Content,
  Header,
  Icon,
  Title,
} from './style';

// Tipos das props do container
interface DefaultContainerProps {
  children: ReactNode;
  backButton?: boolean;
  monthButton?: boolean;
  addActionFn?: () => void;
  newItem?: boolean;
  newLaunch?: boolean;
  newItemMarketplace?: boolean;
  newNotes?: boolean;
  newSubscription?: boolean;
  newEvent?: boolean;
  title?: string;
  customBg?: string;
  type?: 'PRIMARY' | 'SECONDARY';
  closeModalFn?: () => void;
  onNewItemTask?: (documentId: string) => void;
  onNewNotes?: (documentId: string) => void;
  onNewItemMarketplace?: (documentId: string) => void;
  onNewLaunch?: () => void;
  onNewSubscription?: (documentId: string) => void;
  onNewEvent?: () => void;
}

export function DefaultContainer({
  children,
  title,
  closeModalFn,
  addActionFn,
  customBg,
  type = 'PRIMARY',
  newNotes = false,
  newItemMarketplace = false,
  backButton = false,
  monthButton = false,
  newSubscription = false,
  newItem = false,
  newLaunch = false,
  newEvent = false,
  onNewItemTask,
  onNewNotes,
  onNewItemMarketplace,
  onNewLaunch,
  onNewSubscription,
  onNewEvent,
}: DefaultContainerProps) {
  const navigation = useNavigation();
  const selectedItemId = '';

  // Navegação e handlers
  const handleGoBack = () => navigation.goBack();
  const handleShowFilter = () => navigation.navigate('filter' as never);

  const handleNewItemTask = (documentId: string) =>
    onNewItemTask ? onNewItemTask(documentId) : navigation.navigate('newitemtask', { selectedItemId: documentId });

  const handleNewNotes = (documentId: string) =>
    onNewNotes ? onNewNotes(documentId) : navigation.navigate('newnotes', { selectedItemId: documentId, isCreator: true });

  const handleNewSubscription = (documentId: string) =>
    onNewSubscription ? onNewSubscription(documentId) : navigation.navigate('new-subscription', { selectedItemId: documentId });

  const handleNewItemMarketplace = (documentId: string) =>
    onNewItemMarketplace ? onNewItemMarketplace(documentId) : navigation.navigate('market-item', { selectedItemId: documentId });

  const handleNewLaunch = () =>
    onNewLaunch ? onNewLaunch() : null;

  const handleNewEvent = () =>
    onNewEvent ? onNewEvent() : navigation.navigate('new-event' as never);

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
          {newSubscription && (
            <Button onPress={() => handleNewSubscription(selectedItemId)}>
              <Icon name="add-outline" />
            </Button>
          )}
          {newEvent && (
            <Button onPress={handleNewEvent}>
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
      <Content customBg={customBg ?? ''}>{children}</Content>
    </Container>
  );
}
