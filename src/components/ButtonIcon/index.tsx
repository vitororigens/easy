import { Button, Container, Icon } from "./styles";

type ButtonIconProps = {
    name: string;
    color: string;
}


export function ButtonIcon({ name, color }: ButtonIconProps) {
    return (
        <Container style={{
            backgroundColor: color
        }}>
            <Button>
                <Icon name={name} />
            </Button>
        </Container>
    )
}