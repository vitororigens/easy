import React from 'react';
import { Modal, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import {
  Container,
  Content,
  Header,
  Title,
  CloseButton,
  MarketItem,
  MarketName,
  MarketDate,
  GroupName,
} from './styles';

interface HistoryMarketModalProps {
  onClose: () => void;
  groupName: string;
  finishedDate: string;
  finishedTime: string;
  markets: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

export function HistoryMarketModal({ 
  onClose, 
  groupName,
  finishedDate,
  finishedTime,
  markets 
}: HistoryMarketModalProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Container>
        <Content>
          <Header>
            <Title>Itens Finalizados</Title>
            <CloseButton onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </CloseButton>
          </Header>

          <GroupName>{groupName}</GroupName>
          <MarketDate>Finalizado em: {finishedDate} às {finishedTime}</MarketDate>

          <FlatList
            data={markets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <MarketItem>
                  <MarketName>{item.name}</MarketName>
                  <MarketDate>
                    Criado em: {date} às {time}
                  </MarketDate>
                </MarketItem>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </Content>
      </Container>
    </Modal>
  );
} 