import { Container, Content, ContentItems, Divider, Icon, ItemsTypeStyleProps, SubTitle, Title } from "./styles";
import { Feather } from '@expo/vector-icons';
import { useTheme } from "styled-components/native";

type ItemsProps = {
    category?: string;
    date: string;
    valueTransaction?: string;
    repeat?: boolean;
    status?: boolean;
    alert?: boolean;
    type?: string;
    showItemPiggyBank?: boolean;
    showItemTask?: boolean;
    showItemTaskRevenue?: boolean;
    handlewStatus?: () => void;
}

export function ItemsList({ handlewStatus, category, date, valueTransaction, repeat, alert, status, type, showItemPiggyBank, showItemTaskRevenue, showItemTask }: ItemsProps) {
    const transactionType = repeat ? 'Despesa fixa' : 'Despesa variável';
    const { COLORS } = useTheme();
    const textStatus = status ? 'Pago' : 'Pendente';
    const typeMode = type === 'input' ? transactionType : textStatus;
    const dateToday = formatDate(new Date());
    console.log(dateToday)

    function formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            <Container>
             
                {showItemTask && date <= dateToday && !status && (
                    <>
                        <Icon onPress={() => handlewStatus} type='SECONDARY'>
                            <Feather name="circle" size={24} color="white" />
                        </Icon>
                        <Content>
                            <ContentItems>
                                <Title type='SECONDARY'>
                                    {category}
                                </Title>
                                <Title type='SECONDARY'>
                                    {valueTransaction}
                                </Title>
                            </ContentItems>
                            <Divider />
                            <ContentItems>
                                <SubTitle>
                                    {date}
                                </SubTitle>
                                <SubTitle>
                                    Atrasado
                                </SubTitle>
                            </ContentItems>
                        </Content>
                    </>
                )}
                {showItemTask && date >= dateToday && !status && (
                    <>
                        <Icon onPress={() => handlewStatus} type='TERTIARY'>
                            <Feather name="circle" size={24} color="white" />
                        </Icon>
                        <Content>
                            <ContentItems>
                                <Title type='TERTIARY'>
                                    {category}
                                </Title>
                                <Title type='TERTIARY'>
                                    {valueTransaction}
                                </Title>
                            </ContentItems>
                            <Divider />
                            <ContentItems>
                                <SubTitle>
                                    {date}
                                </SubTitle>
                                <SubTitle>
                                {typeMode}
                                </SubTitle>
                            </ContentItems>
                        </Content>
                    </>
                )}
                {showItemTask && status && (
                    <>
                        <Icon onPress={() => handlewStatus} type='PRIMARY'>
                            <Feather name="check-circle" size={24} color="white" />
                        </Icon>
                        <Content>
                            <ContentItems>
                                <Title type='PRIMARY'>
                                    {category}
                                </Title>
                                <Title type='PRIMARY'>
                                    {valueTransaction}
                                </Title>
                            </ContentItems>
                            <Divider />
                            <ContentItems>
                                <SubTitle>
                                    {date}
                                </SubTitle>
                                <SubTitle>
                                    {typeMode}
                                </SubTitle>
                            </ContentItems>
                        </Content>
                    </>
                )}
                   {showItemTaskRevenue && (
                    <>
                        <Icon onPress={() => handlewStatus} type='PRIMARY'>
                            <Feather name="check-circle" size={24} color="white" />
                        </Icon>
                        <Content>
                            <ContentItems>
                                <Title type='PRIMARY'>
                                    {category}
                                </Title>
                                <Title type='PRIMARY'>
                                    {valueTransaction}
                                </Title>
                            </ContentItems>
                            <Divider />
                            <ContentItems>
                                <SubTitle>
                                    {date}
                                </SubTitle>
                                <SubTitle>
                                    {transactionType}
                                </SubTitle>
                            </ContentItems>
                        </Content>
                    </>
                )}
            </Container>
        </>
    );
}
