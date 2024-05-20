
import { DefaultContainer } from '../../components/DefaultContainer';
import { Container } from '../../components/Container';
import { Dimensions, FlatList} from 'react-native';
import { LoadData } from '../../components/LoadData';
import useMarketplaceCollections from '../../hooks/useMarketplaceCollections';
import { ItemNotes } from '../../components/ItemNotes';
import { useUserAuth } from '../../hooks/useUserAuth';
const screenWidth = Dimensions.get('screen').width;
export function Notes() {
  const data = useMarketplaceCollections('Notes');
  const user = useUserAuth();
  const uid = user?.uid;

  return (
    <DefaultContainer monthButton newNotes>
      <Container type="SECONDARY" title="Notas">
            {/* <LoadData image='PRIMARY' title='Desculpe!' subtitle='Você ainda não possui notas para exibir aqui!' /> */}
            <FlatList
                data={data.filter(item => item.uid === uid)}
                renderItem={({ item }) => (
                  <ItemNotes title={item.name} description={item.description}/>
                )}
              />
              
      </Container>
    </DefaultContainer>
  );
}
