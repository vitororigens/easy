import auth from "@react-native-firebase/auth";
import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { CustomModal } from "../../components/CustomModal";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import { useUserAuth } from "../../hooks/useUserAuth";
import {
  ActionButton,
  ButtonText,
  ButtonsContainer,
  Container,
  ContainerIcon,
  Content,
  ContentItems,
  GradientBackground,
  Header,
  Icon,
  IconField,
  ImageContainer,
  ItemContent,
  Items,
  StyledImage,
  SubTitle,
  Title,
} from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toast } from "react-native-toast-notifications";
import { database, storage } from "../../libs/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "@react-native-firebase/firestore";

const formSchema = z.object({
  image: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function Perfil() {
  const user = useUserAuth();
  const uid = user?.uid;
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const { setValue, reset } = useForm<FormSchemaType>({
    defaultValues: {
      image: undefined,
    },
  });

  useEffect(() => {
    if (uid) {
      const fetchUserData = async () => {
        try {
          // Buscar imagem do perfil
          const docRef = doc(database, "Perfil", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists) {
            const data = docSnap.data();
            if (data?.image) {
              setImage(data.image);
              setValue("image", data.image);
            }
          }

          // Buscar userName
          const userRef = collection(database, "User");
          const q = query(userRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserName(userData.userName);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };
      fetchUserData();
    }
  }, [uid]);

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Error signing out: ", error));
  }

  function handleDeleteUser() {
    auth()
      .currentUser?.delete()
      .then(() => console.log("User deleted"))
      .catch((error) => console.error("Error deleting user: ", error));
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setValue("image", uri);
        await handleSaveItem({ image: uri });
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = storage.ref(`perfil/${uid}/${new Date().getTime()}`);
      await imageRef.put(blob);
      return await imageRef.getDownloadURL();
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const handleSaveItem = async ({ image }: { image: string }) => {
    if (!uid) return;
    try {
      const docRef = doc(database, "Perfil", uid);
      await setDoc(docRef, { image }, { merge: true });
    } catch (error) {
      console.error("Error saving image: ", error);
    }
  };

  const deleteImage = async () => {
    if (!uid) return;
    try {
      const docRef = doc(database, "Perfil", uid);
      await updateDoc(docRef, { image: null });
      setImage(null);
      setValue("image", undefined);
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  return (
    <DefaultContainer backButton title="Perfil">
      <Container>
        <GradientBackground
          colors={['#6B46C1', '#9F7AEA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            {user ? (
              <View>
                <Header>
                  {image ? (
                    <ImageContainer onPress={pickImage}>
                      <StyledImage source={{ uri: image }} />
                      <ContainerIcon onPress={deleteImage}>
                        <Icon name="trash-o" />
                      </ContainerIcon>
                    </ImageContainer>
                  ) : (
                    <ImageContainer onPress={pickImage}>
                      <MaterialIcons name="add-a-photo" size={36} color="white" />
                    </ImageContainer>
                  )}
                </Header>
                <ContentItems>
                  <Items>
                    <IconField name="person" />
                    <ItemContent>
                      <Title>Nome</Title>
                      <SubTitle type="SECONDARY">{user?.displayName}</SubTitle>
                    </ItemContent>
                  </Items>

                  <Items>
                    <IconField name="person-outline" />
                    <ItemContent>
                      <Title>Nome de Usuário</Title>
                      <SubTitle type="SECONDARY">{userName || "Não definido"}</SubTitle>
                    </ItemContent>
                  </Items>

                  <Items>
                    <IconField name="email" />
                    <ItemContent>
                      <Title>Email</Title>
                      <SubTitle type="SECONDARY">{user?.email}</SubTitle>
                    </ItemContent>
                  </Items>

                  <Items>
                    <IconField name="fingerprint" />
                    <ItemContent>
                      <Title>ID</Title>
                      <SubTitle type="SECONDARY">
                        {user?.uid
                          ? user.uid.length > 10
                            ? user.uid.substring(0, 15) + "..."
                            : user.uid
                          : ""}
                      </SubTitle>
                    </ItemContent>
                  </Items>
                </ContentItems>

                <ButtonsContainer>
                  <ActionButton onPress={() => setConfirmLogoutVisible(true)}>
                    <MaterialIcons name="logout" size={24} color="white" />
                    <ButtonText>Sair</ButtonText>
                  </ActionButton>
                  <ActionButton onPress={() => setConfirmDeleteVisible(true)}>
                    <MaterialIcons name="delete" size={24} color="white" />
                    <ButtonText>Excluir Conta</ButtonText>
                  </ActionButton>
                </ButtonsContainer>
              </View>
            ) : (
              <Loading />
            )}
          </Content>
        </ScrollView>
      </Container>

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
