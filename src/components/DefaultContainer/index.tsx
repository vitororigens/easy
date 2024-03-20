import React, { ReactNode } from "react";
import { BackButton, Background, Button, Container } from "./style";

type DefaultContainerProps = {
    children: ReactNode;
    backButton?: boolean;
}

export function DefaultContainer({ children, backButton = false }: DefaultContainerProps) {


    function handleGoBack() {

    }
    return (
        <Background>
            <Container>

                {backButton &&
                    <Button onPress={handleGoBack}>
                        <BackButton name="chevron-back-outline" />
                    </Button>
                }

                {children}

            </Container>
        </Background>
    );
}
