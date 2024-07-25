import { ImageSourcePropType } from "react-native";
import PersonBlack from "../../assets/personblack.png";
import PersonWhite from "../../assets/personwhite.png";
import { Container, StyledImage, SubTitle, Title } from "./styles";

type ImageTypeProps = "PRIMARY" | "SECONDARY";

type LoadDataProps = {
  title?: string;
  subtitle?: string;
  image?: ImageTypeProps;
  imageSrc?: ImageSourcePropType;
  width?: number
  height?: number
};

export function LoadData({
  image = "PRIMARY",
  title,
  subtitle,
  imageSrc,
  width = 300,
  height = 300
}: LoadDataProps) {
  return (
    <Container>
      <Title>{title}</Title>
      {!!image && !imageSrc && (
        <StyledImage source={image === "PRIMARY" ? PersonWhite : PersonBlack} />
      )}

      {!!imageSrc && <StyledImage width={width} height={height} source={imageSrc} />}

      <SubTitle>{subtitle}</SubTitle>
    </Container>
  );
}
