import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, SubTitle, Title, Items, ContentItems } from "./styles";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export function Gears() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  function handleLogoutConfirmation() {
    setConfirmLogoutVisible(true);
  }

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out'));
  }

  function handleDeleteUserConfirmation() {
    setConfirmDeleteVisible(true);
  }

  function handleDeleteUser() {
   
   auth().currentUser?.delete() 
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);
    return subscriber;
  }, []);

  return (
    <DefaultContainer>
      <Container type="SECONDARY" title="Configurações">
        <Content>
          <Header>
            <Divider />
          </Header>
          <ContentItems>
            <Items>
              <Title>
                Nome:
              </Title>
              <SubTitle type="SECONDARY">
                {user?.displayName}
              </SubTitle>
            </Items>
            <Items>
              <Title>
                Email:
              </Title>
              <SubTitle type="SECONDARY">
                {user?.email}
              </SubTitle>
            </Items>
            <Items>
              <Title>
                ID:
              </Title>
              <SubTitle type="SECONDARY">
                {user?.uid}
              </SubTitle>
            </Items>
            <Button style={{
              marginTop:20,
              marginBottom: 20 
            }} title={'Sair'} onPress={handleLogoutConfirmation} />
            <Button title={'Deletar Conta'} onPress={handleDeleteUserConfirmation} />
          </ContentItems>
        </Content>
      </Container>
      {/* Modal de confirmação para sair da conta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmLogoutVisible}
        onRequestClose={() => {
          setConfirmLogoutVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Deseja realmente sair da conta?</Text>
            <TouchableOpacity onPress={() => {
              setConfirmLogoutVisible(false);
              handleLogout();
            }}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmLogoutVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => {
          setConfirmDeleteVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Deseja realmente excluir sua conta?</Text>
            <TouchableOpacity onPress={() => {
              setConfirmDeleteVisible(false);
              handleDeleteUser();
            }}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DefaultContainer>
  );
}
