import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuth, signOut, deleteUser } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components/native";
import { CustomModal } from "../../components/CustomModal";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  ButtonIcon,
  Content,
  ContentItems,
  Icon,
  Items,
  Title,
  SectionTitle,
  SectionContainer,
} from "./styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


export function Gears() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const user = useUserAuth();
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const auth = getAuth();

  function handleLogoutConfirmation() {
    setConfirmLogoutVisible(true);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      console.log("User signed out");
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
      }, 1000);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  function handleDeleteUserConfirmation() {
    setConfirmDeleteVisible(true);
  }

  async function handleDeleteUser() {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        await AsyncStorage.removeItem("user");
        console.log("User deleted account");
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "login" }],
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error delete account: ", error);
    }
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

  function handleNotifications() {
    navigation.navigate("notifications");
  }

  function handleShared() {
    navigation.navigate("shared");
  }

  function handleSubscriptions() {
    navigation.navigate("subscriptions");
  }

  function handleNotes() {
    navigation.navigate("notes");
  }

  return (
    <DefaultContainer title="Configurações">
      <ScrollView showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
      }}
      >
        <Content>
          {user ? (
            <View>
              {/* Seção Funcionalidades */}
              <SectionContainer>
                <SectionTitle>Funcionalidades</SectionTitle>
                <ContentItems>
                  <ButtonIcon onPress={handleSubscriptions}>
                    <Items>
                      <Title>Assinaturas</Title>
                      <Icon>
                        <FontAwesome
                          name="pencil"
                          size={30}
                          color={COLORS.PURPLE_800}
                        />
                      </Icon>
                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handleShared}>
                    <Items>
                      <Title>Compartilhamentos</Title>
                      <Icon>
                        <FontAwesome
                          name="share"
                          size={30}
                          color={COLORS.PURPLE_800}
                        />
                      </Icon>
                    </Items>
                  </ButtonIcon>
                  <ButtonIcon onPress={handleNotes}>
                    <Items>
                      <Title>Notas</Title>
                      <Icon>
                        <FontAwesome
                          name="sticky-note"
                          size={30}
                          color={COLORS.PURPLE_800}
                        />
                      </Icon>
                    </Items>
                  </ButtonIcon>
                </ContentItems>
              </SectionContainer>

              {/* Seção Configurações */}
              <SectionContainer>
                <SectionTitle>Configurações</SectionTitle>
                <ContentItems>
                  <ButtonIcon onPress={handleNotifications}>
                    <Items>
                      <Title>Notificações</Title>
                      <Icon>
                        <FontAwesome
                          name="bell"
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
                </ContentItems>
              </SectionContainer>

              {/* Seção Conta */}
              <SectionContainer>
                <SectionTitle>Conta</SectionTitle>
                <ContentItems>
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
                </ContentItems>
              </SectionContainer>
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
