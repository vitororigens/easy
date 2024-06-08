import { TouchableOpacity, View } from "react-native";
import { Popover } from "react-native-popper";
import {
  Button,
  Container,
  ContainerMenu,
  DateNote,
  Icon,
  SubTitle,
  Title,
} from "./styles";

type ItemNotesProps = {
  title: string;
  description: string;
  date?: string;
  onDelete: () => void;
  onEdit: () => void;
};

export function ItemNotes({
  description,
  title,
  onDelete,
  onEdit,
  date,
}: ItemNotesProps) {
  return (
    <Container onPress={onEdit}>
      <View style={{ flex: 1 }}>
        <Title>{title}</Title>
        <SubTitle>
          {description
            ? description.length > 10
              ? description.substring(0, 10) + "..."
              : description
            : ""}
        </SubTitle>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Popover
          trigger={
            <TouchableOpacity>
              <Icon name="dots-three-horizontal" />
            </TouchableOpacity>
          }
        >
          <Popover.Backdrop />
          <Popover.Content>
            <ContainerMenu style={{ alignSelf: "flex-end" }}>
              <Button onPress={onDelete}>
                <Icon name="trash" />
                <Title>Excluir</Title>
              </Button>
              <Button onPress={onEdit}>
                <Icon name="pencil" />
                <Title>Editar</Title>
              </Button>
            </ContainerMenu>
          </Popover.Content>
        </Popover>
        {!!date && <DateNote>{date}</DateNote>}
      </View>
    </Container>
  );
}
