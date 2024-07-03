import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { MMKV } from "react-native-mmkv";
import { useTheme } from "styled-components/native";
import { CustomModal } from "../../components/CustomModal";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  ButtonIcon,
  Content,
  ContentItems,
  Divider,
  Header,
  Icon,
  Items,
  Title,
} from "./styles";

const storage = new MMKV();

export function Gears() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const user = useUserAuth();
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  function handleLogoutConfirmation() {
    setConfirmLogoutVisible(true);
  }

  function handleLogout() {
    auth()
      .signOut()
      .then(() => {
        storage.delete("user");
        console.log("User signed out");
        navigation.reset({
          index: 0,
          routes: [{name: "login"}]
        });
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  function handleDeleteUserConfirmation() {
    setConfirmDeleteVisible(true);
  }

  function handleDeleteUser() {
    auth().currentUser?.delete();
  }

  function handlePiggyBank() {
    navigation.navigate("piggybank");
  }

  function handleGraphics() {
    navigation.navigate("graphics");
  }
  function handlePefil() {
    navigation.navigate("perfil");
  }

  return (
    <DefaultContainer title="Configurações">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {user ? (
            <View>
              <Header>
                <Divider />
              </Header>
              <ContentItems>
                <ButtonIcon onPress={handleGraphics}>
                  <Items>
                    <Title>Gráficos</Title>
                    <Icon>
                      <FontAwesome
                        name="line-chart"
                        size={30}
                        color={COLORS.PURPLE_800}
                      />
                    </Icon>
                  </Items>
                </ButtonIcon>
                <ButtonIcon onPress={handlePiggyBank}>
                  <Items>
                    <Title>Cofrinho</Title>
                    <Icon>
                      <FontAwesome5
                        name="piggy-bank"
                        size={30}
                        color={COLORS.PURPLE_800}
                      />
                    </Icon>
                  </Items>
                </ButtonIcon>
                <ButtonIcon onPress={handlePefil}>
                  <Items>
                    <Title>Perfil</Title>
                    <Icon>
                      <FontAwesome
                        name="user"
                        size={30}
                        color={COLORS.PURPLE_800}
                      />
                    </Icon>
                  </Items>
                </ButtonIcon>
                <ButtonIcon onPress={handleDeleteUserConfirmation}>
                  <Items>
                    <Title>Deletar Conta</Title>
                    <Icon>
                      <FontAwesome
                        name="trash"
                        size={30}
                        color={COLORS.PURPLE_800}
                      />
                    </Icon>
                  </Items>
                </ButtonIcon>
                <ButtonIcon onPress={handleLogoutConfirmation}>
                  <Items>
                    <Title>Sair</Title>
                    <Icon>
                      <Entypo
                        name="log-out"
                        size={30}
                        color={COLORS.PURPLE_800}
                      />
                    </Icon>
                  </Items>
                </ButtonIcon>
              </ContentItems>
            </View>
          ) : (
            <Loading />
          )}
        </Content>
      </ScrollView>
      <CustomModal
        animationType="slide"
        transparent={true}
        onCancel={() => setConfirmLogoutVisible(false)}
        onClose={() => {
          setConfirmLogoutVisible(false);
        }}
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
        onClose={() => {
          setConfirmDeleteVisible(false);
        }}
        onConfirme={() => {
          setConfirmDeleteVisible(false);
          handleDeleteUser();
        }}
        title="Deseja realmente excluir essa conta?"
        visible={confirmDeleteVisible}
      />
    </DefaultContainer>
  );
}
