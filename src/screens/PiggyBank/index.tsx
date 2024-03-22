import { DefaultContainer } from "../../components/DefaultContainer";
import { Container } from "../../components/Container";
import { Content, Divider, Header } from "./styles";


export function PiggyBank() {

  return (
    <DefaultContainer >
      <Container type="SECONDARY" title="Cofrinho">
        <Content>
          <Header>
            <Divider />
          </Header>
        </Content>
      </Container>
    </DefaultContainer>
  );
}
