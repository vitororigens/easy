import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";

export function Home() {
    return (
      <DefaultContainer backButton>
        <Container  type="PRIMARY" name="file-invoice-dollar" title="R$ 4.793"/>
      </DefaultContainer>
    );
}
