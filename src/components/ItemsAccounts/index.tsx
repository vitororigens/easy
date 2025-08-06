import { TouchableOpacity } from 'react-native';
import { Popover } from 'react-native-popper';
import { ContainerMenu } from '../Items/styles';
import {
  Button,
  ButtonPoppover,
  Container,
  Content,
  ContentItems,
  Divider,
  Icon,
  IconMenu,
  SubTitle,
  Title,
} from './styles';

type ItemsProps = {
  category?: string;
  date: string;
  repeat?: boolean;
  status?: boolean;
  type?: string;
  handleStatus: () => void;
  selected: boolean;
  income?: boolean;
  handleExpenseConfirmation?: () => void
};

export function ItemsAccounts({
  handleStatus,
  category,
  date,
  selected,
  income,
  handleExpenseConfirmation,
}: ItemsProps) {
  const transactionType = income ? 'Despesa fixa' : 'Despesa variável';

  return (
    <Container>
      <Button onPress={handleStatus} type="PRIMARY">
        <Icon
          name={
            selected
              ? 'checkbox-marked-circle-outline'
              : 'checkbox-blank-circle-outline'
          }
        />
      </Button>

      <Content>
        <ContentItems>
          <Title type={selected ? 'SECONDARY' : 'PRIMARY'}>
            {transactionType}
          </Title>
          <Title type={selected ? 'SECONDARY' : 'PRIMARY'}>{category}</Title>
        </ContentItems>
        <Divider />
        <ContentItems>
          <SubTitle>{date}</SubTitle>
        </ContentItems>
      </Content>

      <Popover
        trigger={
          <TouchableOpacity>
            <IconMenu type="PRIMARY" name="dots-three-vertical" />
          </TouchableOpacity>
        }
      >
        <Popover.Backdrop />
        <Popover.Content>
          <ContainerMenu>
            <ButtonPoppover onPress={handleExpenseConfirmation}>
              <IconMenu type="PRIMARY" name="pencil" />
              <Title type="PRIMARY">Editar</Title>
            </ButtonPoppover>
          </ContainerMenu>
        </Popover.Content>
      </Popover>
    </Container>
  );
}
