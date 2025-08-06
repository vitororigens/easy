import { Icon, Title, Container, Button } from './styles';
import { TouchableOpacity, View } from 'react-native';

type ListItemProps = {
  title: string;
  onDelete: () => void;
  onEdit: () => void;
  isChecked: boolean;
  onToggle: () => void;
};

export function ListItem({ title, onDelete, onEdit, isChecked, onToggle }: ListItemProps) {
  return (
    <Container>
      <Button onPress={onToggle}>
        <Icon type={isChecked ? 'PRIMARY' : 'SECONDARY'} name={isChecked ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'} />
        <Title type={isChecked ? 'PRIMARY' : 'SECONDARY'}>{title}</Title>
      </Button>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onEdit}>
          <Icon type="SECONDARY" name="pencil" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Icon type="SECONDARY" name="trash-can" />
        </TouchableOpacity>
      </View>
    </Container>
  );
}
