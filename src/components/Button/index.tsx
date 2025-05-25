import React from 'react';
import { TouchableOpacityProps } from "react-native";
import { Container, Title } from "./style";

type ButtonProps = TouchableOpacityProps & {
    title: string | React.ReactNode;
    isLoading?: boolean;
}

export function Button({ title, isLoading, ...rest }: ButtonProps) {
    return (
        <Container {...rest} disabled={isLoading}>
            {typeof title === 'string' ? <Title>{title}</Title> : title}
        </Container>
    );
}
