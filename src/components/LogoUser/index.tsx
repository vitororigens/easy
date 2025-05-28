import { useEffect, useState } from "react";
import { Container, ContainerIcon, Icon, StyledImage, Title } from "./styles";
import { useUserAuth } from "../../hooks/useUserAuth";
import { database } from "../../libs/firebase";
import { doc, onSnapshot } from "@react-native-firebase/firestore";

type LogoUserProps = {
  color: string;
};

export function LogoUser({ color }: LogoUserProps) {
  const user = useUserAuth();
  const uid = user.user?.uid;
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (uid) {
      const docRef = doc(database, "Perfil", uid);
      
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        console.log("Document snapshot received: ", docSnapshot.data());
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setImage(data?.image ?? null);
        }
      });

      // Cleanup the listener on component unmount
      return () => unsubscribe();
    }
  }, [uid]);

  function getInitials(name: string | undefined): string {
    if (!name) return "";
    const nameArray = name.split(" ");
    const initials = nameArray
      .slice(0, 2) // Pega apenas os dois primeiros nomes
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  }

  return (
    <Container style={{ backgroundColor: color }}>
      {image ? (
        <StyledImage source={{ uri: image }} />
      ) : (
        <Title>{getInitials(user.user?.displayName ?? "")}</Title>
      )}
      <ContainerIcon style={{ backgroundColor: color }}>
        <Icon name="menu" />
      </ContainerIcon>
    </Container>
  );
}
