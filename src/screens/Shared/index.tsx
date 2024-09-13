import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { Container } from "./styles";

export function Shared(){
    return(
        <DefaultContainer title="Compartilhamento" backButton>
            <Container>
                <Input placeholder="Buscar usuarios"  />
            </Container>
        </DefaultContainer>
    )
}