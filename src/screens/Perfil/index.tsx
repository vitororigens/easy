import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "styled-components/native";
import { CustomModal } from "../../components/CustomModal";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Loading } from "../../components/Loading";
import { LogoUser } from "../../components/LogoUser";
import { useUserAuth } from "../../hooks/useUserAuth";
import { ContainerIcon, Content, ContentItems, Header, Icon, ImageContainer, Items, StyledImage, SubTitle, Title } from "./styles";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { database, storage } from "../../services";
import { Toast } from "react-native-toast-notifications";

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

  const { setValue, reset } = useForm<FormSchemaType>({
    defaultValues: {
      image: undefined,
    },
  });

  useEffect(() => {
    if (uid) {
      const fetchImage = async () => {
        try {
          const doc = await database.collection("Perfil").doc(uid).get();
          if (doc.exists) {
            const data = doc.data();
            if (data?.image) {
              setImage(data.image);
              setValue('image', data.image);
            }
          }
        } catch (error) {
          console.error("Error fetching image: ", error);
        }
      };
      fetchImage();
    }
  }, [uid]);

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out'))
      .catch((error) => console.error("Error signing out: ", error));
  }

  function handleDeleteUser() {
    auth().currentUser?.delete()
      .then(() => console.log('User deleted'))
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
        setValue('image', uri);
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

  const handleSaveItem = async ({ image }: FormSchemaType) => {
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }
      await database.collection("Perfil").doc(uid).set({
        image: imageUrl,
        uid,
      });
      Toast.show("Imagem adicionada!", { type: "success" });
      reset();
    } catch (error) {
      console.error("Erro ao adicionar o item: ", error);
    }
  };

  const deleteImage = async () => {
    if (image) {
      try {
        const filePath = decodeURIComponent(image.substring(image.indexOf('/o/') + 3, image.indexOf('?')));
        const imageRef = storage.ref(filePath);
        await imageRef.delete();
        await database.collection("Perfil").doc(uid).update({ image: null });
        Toast.show("Imagem deletada!", { type: "success" });
        setImage(null);
        setValue('image', undefined);
      } catch (error) {
        if (error === 'storage/object-not-found') {
          console.error("Erro ao deletar a imagem: Objeto não encontrado.", error);
        } else {
          console.error("Erro ao deletar a imagem: ", error);
        }
      }
    }
  };
  
  

  return (
    <DefaultContainer backButton title="Perfil">
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
                  <Title>Nome:</Title>
                  <SubTitle type="SECONDARY">{user?.displayName}</SubTitle>
                </Items>

                <Items>
                  <Title>Email:</Title>
                  <SubTitle type="SECONDARY">{user?.email}</SubTitle>
                </Items>
                <Items>
                  <Title>ID:</Title>
                  <SubTitle type="SECONDARY">
                    {user?.uid ? (user.uid.length > 10 ? user.uid.substring(0, 15) + '...' : user.uid) : ""}
                  </SubTitle>
                </Items>
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
          handleDeleteUser();
        }}
        title="Deseja realmente excluir essa conta?"
        visible={confirmDeleteVisible}
      />
    </DefaultContainer>
  );
}
