import { TouchableOpacity, View } from "react-native";
import { Button, Container, ContainerMenu, Icon, SubTitle, Title } from "./styles";
import { Popover } from 'react-native-popper';

type ItemNotesProps = {
  title: string;
  description: string;
  onDelete: () => void;
  onEdit: () => void;
};

export function ItemNotes({ description, title, onDelete, onEdit }: ItemNotesProps) {
  return (
    <Container onPress={onEdit}>
      <View style={{ flex: 1 }}>
        <Title>
          {title}
        </Title>
        <SubTitle>
          {description ? (description.length > 10 ? description.substring(0, 10) + '...' : description) : ""}
        </SubTitle>
      </View>
      <View>
        <Popover
          trigger={
            <TouchableOpacity>
              <Icon name="dots-three-horizontal" />
            </TouchableOpacity>
          }
        >
          <Popover.Backdrop />
          <Popover.Content>
            <ContainerMenu>
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
      </View>
    </Container>
  );
}
