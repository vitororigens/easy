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
import { INote } from "../../services/firebase/notes.firebase";
import { format } from "date-fns";

type ItemNotesProps = {
  note: INote;
  handleDelete: () => void;
  handleUpdate: () => void;
};

export function ItemNotes({
  note,
  handleDelete,
  handleUpdate,
}: ItemNotesProps) {
  return (
    <Container onPress={handleUpdate}>
      <View style={{ flex: 1 }}>
        <Title>{note.name}</Title>
        {note.description && (
          <SubTitle>
            {note.description.length > 10
              ? note.description.substring(0, 10) + "..."
              : note.description}
          </SubTitle>
        )}
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
              <Button onPress={handleDelete}>
                <Icon name="trash" />
                <Title>Excluir</Title>
              </Button>
              <Button onPress={handleUpdate}>
                <Icon name="pencil" />
                <Title>Editar</Title>
              </Button>
            </ContainerMenu>
          </Popover.Content>
        </Popover>
        <DateNote>{format(note.createdAt.toDate(), "dd/MM/yyyy")}</DateNote>
      </View>
    </Container>
  );
}
