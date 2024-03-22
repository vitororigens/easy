import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header} from "./styles";


export function Gears() {
  return (
    <DefaultContainer>
      <Container type="SECONDARY" title="Configurações">
        <Content>
          <Header>
            <Divider/>
            
          </Header>
        </Content>
      </Container>
    </DefaultContainer>
  );
}
