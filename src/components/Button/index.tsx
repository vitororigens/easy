import { TouchableOpacityProps } from "react-native";
import { Container, Title } from "./style";

type ButtonProps = TouchableOpacityProps & {
    title: string | JSX.Element;
}

export function Button({ title, ...rest }: ButtonProps) {
    return (
        <Container {...rest}>
            {typeof title === 'string' ? <Title>{title}</Title> : title}
        </Container>
    );
}
