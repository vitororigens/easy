import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header, SubTitle, Title, Items, ContentItems, ButtonIcon, Icon } from "./styles";
import { Button } from "../../components/Button";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { CustomModal } from "../../components/CustomModal";
import { LogoUser } from "../../components/LogoUser";
import { ScrollView, View } from "react-native";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Loading } from "../../components/Loading";
import LogoLineChart from '../../assets/Icones/icones_brokerx_cinza-07.svg';
import LogoPiggBank from '../../assets/Icones/icones_brokerx_cinza-01.svg';
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


export function Gears() {
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

  function handlePiggyBank() {
    navigation.navigate('piggybank')
  }


  function handleGraphics() {
    navigation.navigate('graphics')
  }
  function handlePefil() {
    navigation.navigate('perfil')
  }


  return (
    <DefaultContainer>
      <Container type="SECONDARY" title="Configurações">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            {user ?
              <View>
                <Header>
                  <Divider />
                </Header>
                <ContentItems>

                  <ButtonIcon onPress={handleGraphics}>
                    <Items>
                      <Title>
                        Grafícos
                      </Title>
                     <Icon>
                     <FontAwesome name="line-chart" size={30} color={COLORS.PURPLE_800} />
                     </Icon>

                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handlePiggyBank}>
                    <Items>
                      <Title>
                        Cofrinho
                      </Title>
                      <Icon>
                      <FontAwesome5 name="piggy-bank" size={30} color={COLORS.PURPLE_800} />
                      </Icon>

                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handlePefil}>
                    <Items>
                      <Title>
                        Perfil
                      </Title>
                      <Icon>
                        <FontAwesome name="user" size={30} color={COLORS.PURPLE_800} />
                      </Icon>
                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handleDeleteUser}>
                    <Items>
                      <Title>
                        Deletar Conta
                      </Title>
                      <Icon>
                        <FontAwesome name="trash" size={30} color={COLORS.PURPLE_800} />
                      </Icon>

                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handleLogout}>
                    <Items>
                      <Title>
                        Sair
                      </Title>
                      <Icon>
                        <Entypo name="log-out" size={30} color={COLORS.PURPLE_800} />
                      </Icon>

                    </Items>
                  </ButtonIcon>
                </ContentItems>
              </View>
              : <Loading />
            }
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
