import { Button, Container, Content, ContentItems, Divider, Icon, ItemsTypeStyleProps, SubTitle, Title } from "./styles";
import { useTheme } from "styled-components/native";

type ItemsProps = {
    category?: string;
    date: string;
    repeat?: boolean;
    status?: boolean;
    type?: string;
    handleStatus: () => void;
    selected: boolean;
    income?: boolean;
}

export function ItemsAccounts({ handleStatus, category, date, status, type, selected, income }: ItemsProps) {
    const transactionType = income ? 'Despesa fixa' : 'Despesa variável';
    const { COLORS } = useTheme();
    const textStatus = status ? 'Pago' : 'Pendente';
    const typeMode = type === 'input' ? transactionType : textStatus;
    const dateToday = formatDate(new Date());

    function formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <Container>
            <Button onPress={handleStatus} type='PRIMARY'>
                <Icon name={selected ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}/>
            </Button>
            <Content>
                <ContentItems>
                    <Title type='PRIMARY'>
                        {transactionType}
                    </Title>
                    <Title type='PRIMARY'>
                        {category}
                    </Title>
                </ContentItems>
                <Divider />
                <ContentItems>
                    <SubTitle>
                        {date}
                    </SubTitle>
                </ContentItems>
            </Content>
        </Container>
    );
}
