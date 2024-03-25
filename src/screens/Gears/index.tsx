import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, SubTitle, Title, Items, ContentItems } from "./styles";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { CustomModal } from "../../components/CustomModal";
import { LogoUser } from "../../components/LogoUser";
import { ScrollView } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";


export function Gears() {
  const user = useUserAuth();
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



  

  return (
    <DefaultContainer>
      <Container type="SECONDARY" title="Configurações">
        <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          <Header>
            <Divider />
            <LogoUser title={user?.displayName || ""} />
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
                {user?.uid ? (user.uid.length > 10 ? user.uid.substring(0, 15) + '...' : user.uid) : ""}
              </SubTitle>


            </Items>
            <Button style={{
              marginTop: 20,
              marginBottom: 20
            }} title={'Sair'} onPress={handleLogoutConfirmation} />
            <Button title={'Deletar Conta'} onPress={handleDeleteUserConfirmation} />
          </ContentItems>
        </Content>
        </ScrollView>
      </Container>
      <CustomModal
        animationType="slide"
        transparent={true}
        onCancel={() => setConfirmLogoutVisible(false)}
        onClose={() => { setConfirmLogoutVisible(false); }}
        onConfirme={() => {
          setConfirmLogoutVisible(false);
          handleLogout();
        }}
        title="Deseja realmente sair da conta?"
        visible={confirmLogoutVisible}
      />
      <CustomModal
        animationType="slide"
        transparent={true}
        onCancel={() => setConfirmDeleteVisible(false)}
        onClose={() => { setConfirmDeleteVisible(false); }}
        onConfirme={() => {
          setConfirmDeleteVisible(false);
          handleDeleteUser()
        }}
        title="Deseja realmente excluir essa conta?"
        visible={confirmDeleteVisible}
      />

    </DefaultContainer>
  );
}
