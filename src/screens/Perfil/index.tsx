import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "styled-components/native";
import { CustomModal } from "../../components/CustomModal";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import { LogoUser } from "../../components/LogoUser";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Content, ContentItems, Header, Items, SubTitle, Title } from "./styles";


export function Perfil() {
  const navigation = useNavigation()
  const { COLORS } = useTheme()
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

  function handleMarketplace() {
    navigation.navigate('marketplace')
  }


  function handleGraphics() {
    navigation.navigate('graphics')
  }


  return (
    <DefaultContainer backButton title="Perfil">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            {user ?
              <View>
                <Header>
                  {/* <Divider /> */}
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
                </ContentItems>
              </View>
              : <Loading />
            }
          </Content>
        </ScrollView>
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
