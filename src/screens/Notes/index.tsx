
import { DefaultContainer } from '../../components/DefaultContainer';
import { Container } from '../../components/Container';
import { Dimensions} from 'react-native';
import { LoadData } from '../../components/LoadData';
const screenWidth = Dimensions.get('screen').width;
export function Notes() {


  return (
    <DefaultContainer monthButton newNotes>
      <Container type="SECONDARY" title="Notas">
            <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui notas para exibir aqui!' />

      </Container>
    </DefaultContainer>
  );
}
