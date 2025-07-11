import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { ISharing, acceptSharing, rejectSharing, deleteSharing } from '../../services/firebase/sharing.firebase';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Container, Content, Title, Description, Actions, ActionButton, ActionText, Status } from './styles';
import { findUserById, IUser } from '../../services/firebase/users.firestore';
import { updateNotes } from '../../services/firebase/updateShareInfo';
import { findNoteById } from '../../services/firebase/notes.firebase';

interface ItemSharedUserProps {
  sharing: ISharing;
  onDeleteSharing: (id: string) => void;
  onStatusChange?: () => void;
}

export function ItemSharedUser({ sharing, onDeleteSharing, onStatusChange }: ItemSharedUserProps) {
  const user = useUserAuth();
  const [targetUser, setTargetUser] = useState<IUser | null>(null);
  const [senderUser, setSenderUser] = useState<IUser | null>(null);
  const [currentStatus, setCurrentStatus] = useState(sharing.status);
  console.log('sharing', sharing);

  const isReceived = user.user?.uid === sharing.target;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [targetData, senderData] = await Promise.all([
          findUserById(sharing.target),
          findUserById(sharing.invitedBy)
        ]);
        setTargetUser(targetData);
        setSenderUser(senderData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, [sharing.target, sharing.invitedBy]);

  useEffect(() => {
    setCurrentStatus(sharing.status);
  }, [sharing.status]);

  const handleAccept = async () => {
    try {
      await acceptSharing(sharing.id);
      
      // Buscar todas as notas compartilhadas e atualizar o acceptedAt
      const notes = await findNoteById(sharing.id);
      if (notes) {
        await updateNotes(notes.id, user.user?.uid || '');
      }
      
      setCurrentStatus('accepted');
      onStatusChange?.();
      Alert.alert('Sucesso', 'Compartilhamento aceito com sucesso!');
    } catch (error) {
      console.error('Error accepting sharing:', error);
      Alert.alert('Erro', 'Não foi possível aceitar o compartilhamento');
    }
  };

  const handleReject = async () => {
    try {
      await rejectSharing(sharing.id);
      setCurrentStatus('rejected');
      onStatusChange?.();
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
      onStatusChange?.();
    } catch (error) {
      console.error('Error deleting sharing:', error);
      Alert.alert('Erro', 'Não foi possível excluir o compartilhamento');
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      let date: Date;
      
      // Check if it's a Firestore Timestamp object
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      }
      // Check if it's a plain timestamp object with seconds and nanoseconds
      else if (timestamp.seconds && timestamp.nanoseconds) {
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      }
      // Check if it's already a Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Check if it's a number (milliseconds)
      else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      }
      // Check if it's a string that can be parsed
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      }
      else {
        return 'Data não disponível';
      }
      
      // Validate if the date is valid
      if (isNaN(date.getTime())) {
        return 'Data não disponível';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data não disponível';
    }
  };

  return (
    <Container>
      <Content>
        <View style={{ flex: 1 }}>
          <Title>
            {isReceived ? 'Recebido de:' : 'Enviado para:'}{' '}
            {isReceived ? senderUser?.userName || '...' : targetUser?.userName || '...'}
          </Title>
          <Description>
            {formatDate(sharing.createdAt)}
          </Description>
          <Status status={currentStatus}>
            {getStatusText()}
          </Status>
        </View>

        <Actions>
          {isReceived && currentStatus === 'pending' && (
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
