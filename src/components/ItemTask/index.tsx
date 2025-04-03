import { TouchableOpacity, View } from "react-native";
import { Popover } from 'react-native-popper';
import { Button, Container, ContainerMenu, Icon, IconCheck, Title } from "./styles";

type ItemNotesProps = {
  title: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isChecked: boolean;
  hasActions?: boolean
  onToggle?: () => void;
};

export function ItemTask({ title, onDelete, onEdit, isChecked, onToggle, hasActions = true }: ItemNotesProps) {
  return (
    <Container onPress={onToggle}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
      }}>
        <IconCheck
          type={isChecked ? 'PRIMARY' : 'SECONDARY'}
          name={isChecked ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
        />
        <Title type={isChecked ? 'PRIMARY' : 'SECONDARY'}>{title}</Title>
      </View>
      {hasActions && (
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
      )}
    </Container>
  );
}
