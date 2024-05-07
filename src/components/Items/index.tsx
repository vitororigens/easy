import { useState } from "react";
import { Container, Content, ContentItems, Divider, Icon, ItemsTypeStyleProps, SubTitle, Title } from "./styles";
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from "styled-components/native";

type ItemsProps = {
    category: string;
    date: string;
    valueTransaction: string;
    repeat: boolean;
    status?: boolean;
    alert?: boolean;
    type: string;
}

export function Items({ category, date, valueTransaction, repeat, alert, status, type }: ItemsProps) {
    const transactionType = repeat ? 'Despesa fixa' : 'Despesa variável';
    const { COLORS } = useTheme();
    const statusPayment = status ? 'PRIMARY' : 'SECONDARY';
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
        <Container>
            {type === 'input' && (
                <>
                    <Icon style={{ backgroundColor: COLORS.GREEN_700 }} type={statusPayment}>
                        <AntDesign name="infocirlce" size={24} color="white" />
                    </Icon>
                    <Content>
                        <ContentItems>
                            <Title style={{
                                color: COLORS.GREEN_700
                            }} type={statusPayment}>
                                {category}
                            </Title>
                            <Title style={{
                                color: COLORS.GREEN_700
                            }} type={statusPayment}>
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
            {date >= dateToday ? (
                <>
                    <Icon type={statusPayment}>
                        <AntDesign name="infocirlce" size={24} color="white" />
                    </Icon>
                    <Content>
                        <ContentItems>
                            <Title type={statusPayment}>
                                {category}
                            </Title>
                            <Title type={statusPayment}>
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

            ) : (
                <>
                    <Icon style={{ backgroundColor: COLORS.RED_700 }} type={statusPayment}>
                        <AntDesign name="infocirlce" size={24} color="white" />
                    </Icon>
                    <Content>
                        <ContentItems>
                            <Title style={{
                                color: COLORS.RED_700
                            }} type={statusPayment}>
                                {category}
                            </Title>
                            <Title style={{
                                color: COLORS.RED_700
                            }} type={statusPayment}>
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

        </Container>
    );
}
