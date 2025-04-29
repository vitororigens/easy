import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ISharing, acceptSharing, rejectSharing, deleteSharing } from '../../services/firebase/sharing.firebase';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Container, Content, Title, Description, Actions, ActionButton, ActionText } from './styles';

interface ItemSharedUserProps {
  sharing: ISharing;
  onDeleteSharing: (id: string) => void;
}

export function ItemSharedUser({ sharing, onDeleteSharing }: ItemSharedUserProps) {
  const user = useUserAuth();

  const isReceived = user?.uid === sharing.target;

  const handleAccept = async () => {
    try {
      await acceptSharing(sharing.id);
      Alert.alert('Sucesso', 'Compartilhamento aceito com sucesso!');
    } catch (error) {
      console.error('Error accepting sharing:', error);
      Alert.alert('Erro', 'Não foi possível aceitar o compartilhamento');
    }
  };

  const handleReject = async () => {
    try {
      await rejectSharing(sharing.id);
      Alert.alert('Aviso', 'Compartilhamento rejeitado');
    } catch (error) {
      console.error('Error rejecting sharing:', error);
      Alert.alert('Erro', 'Não foi possível rejeitar o compartilhamento');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSharing(sharing.id);
      onDeleteSharing(sharing.id);
    } catch (error) {
      console.error('Error deleting sharing:', error);
      Alert.alert('Erro', 'Não foi possível excluir o compartilhamento');
    }
  };

  const getStatusText = () => {
    switch (sharing.status) {
      case 'accepted':
        return 'Aceito';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
        return 'Pendente';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Content>
        <View>
          <Title>
            {isReceived ? 'Recebido de:' : 'Enviado para:'} {sharing.invitedBy}
          </Title>
          <Description>Status: {getStatusText()}</Description>
          <Description>
            {sharing.createdAt?.toDate().toLocaleDateString('pt-BR') || 'Data não disponível'}
          </Description>
        </View>

        <Actions>
          {isReceived && sharing.status === 'pending' && (
            <>
              <ActionButton onPress={handleAccept} type="accept">
                <ActionText>Aceitar</ActionText>
              </ActionButton>
              <ActionButton onPress={handleReject} type="reject">
                <ActionText>Rejeitar</ActionText>
              </ActionButton>
            </>
          )}

          {!isReceived && (
            <ActionButton onPress={handleDelete} type="delete">
              <ActionText>Excluir</ActionText>
            </ActionButton>
          )}
        </Actions>
      </Content>
    </Container>
  );
}
