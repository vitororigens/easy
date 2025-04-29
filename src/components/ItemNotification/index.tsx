import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { INotification } from '../../services/firebase/notifications.firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { Container, Content, Title, Description, Time } from './styles';

interface IItemNotificationProps {
  notification: INotification;
  handleRefresh: () => void;
}

export function ItemNotification({ notification, handleRefresh }: IItemNotificationProps) {
  const theme = useTheme();

  const getIconName = () => {
    switch (notification.type) {
      case 'sharing_invite':
        return 'share';
      case 'due_account':
        return 'warning';
      case 'overdue_account':
        return 'error';
      default:
        return 'notifications';
    }
  };

  const getStatusColor = () => {
    switch (notification.status) {
      case 'pending':
        return theme.COLORS.PURPLE_600;
      case 'read':
        return theme.COLORS.GRAY_400;
      case 'sharing_accepted':
        return theme.COLORS.GREEN_700;
      case 'sharing_rejected':
        return theme.COLORS.RED_700;
      default:
        return theme.COLORS.PURPLE_600;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Data não disponível';
    }
    try {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data não disponível';
    }
  };

  return (
    <Container>
      <Content>
        <MaterialIcons
          name={getIconName()}
          size={24}
          color={getStatusColor()}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Title>{notification.title}</Title>
          <Description>{notification.description}</Description>
          <Time>
            {formatDate(notification.createdAt)}
          </Time>
        </View>
      </Content>
    </Container>
  );
}
