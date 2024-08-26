import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { useForm } from "react-hook-form";
import { database } from "../../services";
import { Toast } from "react-native-toast-notifications";
import { Button } from '../Button';
import { Input } from '../Input';
import { getInitials } from "../../utils/getInitials";

interface EditshareModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: any) => void;
  share: string;
  initialValue: string | null;
  uid: string;
}

export function EditshareModal({ visible, onClose, onSelectUser, share, initialValue, uid }: EditshareModalProps) {
  const [value, setValue] = useState(initialValue || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);
  const { handleSubmit } = useForm();

  // Function to search for users by their username
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

  // UseEffect to search for users when searchTerm changes
  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm]);

  // Function to add the selected user's UID to the shared users list
  const addSharedUser = (user: any) => {
    if (sharedUsers.find(u => u.uid === user.uid)) return; // avoid duplicates
    setSharedUsers([...sharedUsers, user]);
    setSearchTerm("");
    setSearchResults([]);
    onSelectUser(user); // Notify parent component about the selected user
  };

  const onSubmit = async () => {
    try {
      const sharedUserUids = sharedUsers.map(user => user.uid);
      await database.collection("User").doc(uid).update({
        [share]: {
          value,
          sharedWith: sharedUserUids
        }
      });
      Toast.show(`${share} updated successfully!`, { type: "success" });
      onClose();
    } catch (error) {
      console.error(`Error updating ${share}:`, error);
      Toast.show(`Error updating ${share}.`, { type: "danger" });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>

          <Input
            name='user'
            placeholder="Search user"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            style={{ marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc' }}
          />
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => addSharedUser(item)}>
                <Text style={{
                  color: '#000'
                }}>{item.userName}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
            {sharedUsers.map(user => (
              <View key={user.uid} style={{ marginRight: 10 }}>
                <Text>{getInitials(user.userName)}</Text>
              </View>
            ))}
          </View>
          <Button title="Save" onPress={handleSubmit(onSubmit)} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
