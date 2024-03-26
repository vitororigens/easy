import { Container, Content, ContentItems, Divider, Icon, SubTitle, Title } from "./styles";
import { AntDesign } from '@expo/vector-icons';

type ItemsProps ={
    category: string;
    date: string;
    valueTransaction: string;
    repeat: boolean;
    type: string;
}

export function Items({ category, date, valueTransaction, repeat, type }: ItemsProps){
    const transactionType = repeat ? 'Despesa fixa' : 'Despesa variável';
    const titleType = type === 'output' ? 'SECONDARY' : 'PRIMARY';

    return(
        <Container>
            <Icon type={titleType}>
            <AntDesign name="infocirlce" size={24} color="white" />
            </Icon>
            <Content>
                <ContentItems>
                    <Title type={titleType}>
                        {category}
                    </Title>
                    <Title type={titleType}> 
                        R$: {valueTransaction}
                    </Title>
                </ContentItems>
                <Divider/>
                <ContentItems>
                    <SubTitle>
                        {date}
                    </SubTitle>
                    <SubTitle>
                        {transactionType}
                    </SubTitle>
                </ContentItems>
            </Content>
        </Container>
    )
}
