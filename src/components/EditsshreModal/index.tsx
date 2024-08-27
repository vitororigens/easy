import React, { useEffect, useState } from 'react';
import { Modal, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { database } from "../../services";
import { Button } from '../Button';
import { Input } from '../Input';
import { getInitials } from "../../utils/getInitials";
import { Container, ModalContent, SharedUserContainer, SharedUser, Title, IconCheck, ButtonSelect } from './styles';

interface EditshareModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: any) => void;
  share: string;
  initialValue?: string | null;
  uid: string;
}

export function EditshareModal({ visible, onClose, onSelectUser }: EditshareModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const searchUsers = async (username: string) => {
    if (!username) {
      setSearchResults([]);
      return;
    }
    try {
      const userRef = database.collection('User');
      const snapshot = await userRef.where('userName', '==', username).get();
      if (!snapshot.empty) {
        const results = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm]);

  const addSharedUser = (user: any) => {
    if (sharedUsers.find(u => u.uid === user.uid)) return;
    setSharedUsers([...sharedUsers, user]);
    setSearchTerm("");
    setSearchResults([]);
    onSelectUser(user);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <Container>
        <ModalContent>
          <Input
            name='user'
            placeholder="Buscar usuários"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => {
              const isChecked = !!sharedUsers.find(u => u.uid === item.uid);
              return (
                <ButtonSelect onPress={() => addSharedUser(item)}>
                  <Title type={isChecked ? 'PRIMARY' : 'SECONDARY'}>{item.userName}</Title>
                  <IconCheck
                    type={isChecked ? 'PRIMARY' : 'SECONDARY'}
                    name={isChecked ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
                  />
                </ButtonSelect>
              );
            }}
          />
          <Button title="Cancelar" onPress={onClose} />
        </ModalContent>
      </Container>
    </Modal>
  );
}
