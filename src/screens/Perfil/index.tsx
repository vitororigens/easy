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
import { Content, ContentItems, Header, ImageContainer, Items, StyledImage, SubTitle, Title } from "./styles";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Controller, useForm } from "react-hook-form";
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

  const { control, handleSubmit, setValue, watch, reset } = useForm<FormSchemaType>({
    defaultValues: {
      image: undefined,
    },
  });

  useEffect(() => {
    if (uid) {
      const fetchImage = async () => {
        const doc = await database.collection("Perfil").doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          if (data?.image) {
            setImage(data.image);
            setValue('image', data.image);
          }
        }
      };
      fetchImage();
    }
  }, [uid]);

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out'));
  }

  function handleDeleteUser() {
    auth().currentUser?.delete();
  }

  const pickImage = async () => {
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
      handleSaveItem({ image: uri }); 
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = storage.ref(`perfil/${uid}/${new Date().getTime()}`);
    await imageRef.put(blob);
    return await imageRef.getDownloadURL();
  };

  const handleSaveItem = async ({ image }: FormSchemaType) => {
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImage(image);
    }
    database
      .collection("Perfil")
      .doc(uid) // Save the document with the user's UID
      .set({
        image: imageUrl, // Save the image URL
        uid,
      })
      .then(() => {
        Toast.show("Imagem adicionada!", { type: "success" });
        reset();
      })
      .catch((error) => {
        console.error("Erro ao adicionar o item: ", error);
      });
  };

  return (
    <DefaultContainer backButton title="Perfil">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          {user ? (
            <View>
              <Header>
                {image ? (
                  <StyledImage source={{ uri: image }} />
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
