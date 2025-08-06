import { Button, Container, Icon } from './styles';

type ButtonIconProps = {
    name: string;
    color: string;
    onPress?: () => void;
}

export function ButtonIcon({ name, color, onPress }: ButtonIconProps) {
  return (
    <Container style={{
      backgroundColor: color,
    }}>
      <Button onPress={onPress}>
        <Icon name={name} />
      </Button>
    </Container>
  );
}
