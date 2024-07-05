import { useEffect, useState } from "react";
import { Container, ContainerIcon, Icon, StyledImage, Title } from "./styles";
import { database } from "../../services";
import { useUserAuth } from "../../hooks/useUserAuth";

type LogoUserProps = {
  color: string;
};

export function LogoUser({ color }: LogoUserProps) {
  const user = useUserAuth();
  const uid = user?.uid;
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (uid) {
      const unsubscribe = database.collection("Perfil").doc(uid).onSnapshot((doc) => {
        console.log("Document snapshot received: ", doc.data());
        if (doc.exists) {
          const data = doc.data();
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
    const initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
  }

  return (
    <Container style={{ backgroundColor: color }}>
      {image ? (
        <StyledImage source={{ uri: image }} />
      ) : (
        <Title>{getInitials(user?.displayName ?? "")}</Title>
      )}
      <ContainerIcon style={{ backgroundColor: color }}>
        <Icon name="menu" />
      </ContainerIcon>
    </Container>
  );
}
