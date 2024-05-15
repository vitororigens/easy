import React, { useState, useEffect } from 'react';
import { DividerTask, Input, TitleTask, InputDescription, Button, Span } from "./styles";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { database } from '../../services';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Toast } from 'react-native-toast-notifications';

export type ExpenseProps = {
    selectedItemId?: string;
    showButtonRemove?: boolean;
    onCloseModal?: () => void;
    showButtonEdit?: boolean;
    showButtonSave?: boolean;
}

export function Expense({ selectedItemId, showButtonRemove, onCloseModal, showButtonEdit, showButtonSave }: ExpenseProps) {
    const user = useUserAuth();
    const [selectedCategory, setSelectedCategory] = useState('Outros');
    const [valueTransaction, setValuetransaction] = useState('0.00');
    const [listAccounts, setListAccounts] = useState(false);
    const [description, setDescription] = useState('');
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [status, setStatus] = useState(false);
    const [alert, setAlert] = useState(false)
    const [isEditing, setIsEditing] = useState(false);

    const uid = user?.uid;

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        const formattedDateString = currentDate.toLocaleDateString('pt-BR');
        setFormattedDate(formattedDateString);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const handleSaveExpense = () => {
        if (!name || !valueTransaction || !formattedDate) {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos obrigatórios antes de salvar.');
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        const expenseData = {
            name: name,
            category: selectedCategory,
            date: formattedDate,
            valueTransaction: valueTransaction,
            description: description,
            repeat: repeat,
            status: status,
            alert: alert,
            type: 'output',
            uid: uid,
            month: monthNumber,
        };

        // Salva o lançamento de despesa para o mês atual
        database.collection('Expense').add(expenseData)
            .then(() => {
                Toast.show('Transação adicionada!', { type: 'success' });
                setName('');
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setAlert(false);
                setStatus(false);
                setValuetransaction('0.00');
            })
            .catch(error => {
                console.error('Erro ao adicionar a transação: ', error);
            });

        // Se o interruptor de repetição estiver ativado, cria cópias para os próximos 11 meses
        if (repeat) {
            for (let i = 1; i <= 11; i++) {
                // Obtém o próximo mês e ano
                let nextMonth = monthNumber + i;
                let nextYear = year;
        
                if (nextMonth > 12) {
                    nextMonth -= 12;
                    nextYear++;
                }
        
                const nextDate = `${day}/${nextMonth}/${nextYear}`;
                const nextMonthExpenseData = { ...expenseData, date: nextDate, month: nextMonth };
        
                database.collection('Expense').add(nextMonthExpenseData)
                    .catch(error => {
                        console.error('Erro ao adicionar a transação repetida: ', error);
                    });
            }
        }
    };

    const handleDeleteExpense = () => {
        if (!selectedItemId) {
            console.error('Nenhum documento selecionado para exclusão!');
            return;
        }

        const expenseRef = database.collection('Expense').doc(selectedItemId);
        expenseRef.delete()
            .then(() => {
                console.log('Documento de despesa excluído com sucesso.');
                onCloseModal && onCloseModal();
            })
            .catch((error) => {
                console.error('Erro ao excluir o documento de despesa:', error);
            });
    };

    const handleEditExpense = () => {
        if (!selectedItemId) {
            console.error('Nenhum documento selecionado para edição!');
            return;
        }

        if (!name || !valueTransaction || !formattedDate) {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos obrigatórios antes de salvar.');
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        database
            .collection('Expense')
            .doc(selectedItemId)
            .set({
                name: name,
                category: selectedCategory,
                date: formattedDate,
                valueTransaction: valueTransaction,
                description: description,
                repeat: repeat,
                status: status,
                alert: alert,
                type: 'output',
                uid: uid,
                month: monthNumber,
        
            })
            .then(() => {
                Toast.show('Transação editada!', { type: 'success' });
                setName('');
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setAlert(false);
                setStatus(false);
                setValuetransaction('0.00');
                onCloseModal && onCloseModal();
            })
            .catch(error => {
                console.error('Erro ao editar a transação: ', error);
            });
    };

    useEffect(() => {
        if (selectedItemId) {
            database.collection('Expense').doc(selectedItemId).get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data) {
                        setName(data.name);
                        setSelectedCategory(data.category);
                        setValuetransaction(data.valueTransaction);
                        setDescription(data.description);
                        setFormattedDate(data.date);
                        setRepeat(data.repeat);
                        setAlert(data.alert);
                        setStatus(data.status);
                        setDate(new Date(data.date));
                        setIsEditing(true);
                       
                    } else {
                        console.log('Dados do documento estão vazios!');
                    }
                } else {
                    console.log('Nenhum documento encontrado!');
                }
            }).catch((error) => {
                console.error('Erro ao obter o documento:', error);
            });
        }
    }, [selectedItemId]);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <ScrollView>
                <View>
                    <TitleTask>Nome*</TitleTask>
                    <Input
                        value={name}
                        onChangeText={setName}
                    />
                    <TitleTask>Valor*</TitleTask>
                    <Input
                        value={valueTransaction}
                        keyboardType="numeric"
                        onChangeText={setValuetransaction}
                    />

                    <TitleTask>Adicionar esse lançamento a sua lista de contas recorrente? <Span>(opicional)</Span></TitleTask>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={repeat ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setRepeat(!repeat)}
                        value={repeat}
                        style={{ width: 50, marginBottom: 20 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ width: '50%' }}>
                        <View>
                            <TitleTask>Data* </TitleTask>
                            <TouchableOpacity style={{ height: 50 }} onPress={showDatePickerModal}>
                                <Input value={formattedDate} editable={false} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>
                        <View>
                            <TitleTask style={{ marginTop: 20 }}>Categorias <Span>(opicional)</Span></TitleTask>
                            <View style={{ height: 50 }}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedCategory(value)}
                                    items={[
                                        { label: 'Investimentos', value: 'Investimentos' },
                                        { label: 'Contas', value: 'Contas' },
                                        { label: 'Compras', value: 'Compras' },
                                        { label: 'Faculdade', value: 'Faculdade' },
                                        { label: 'Internet', value: 'Internet' },
                                        { label: 'Academia', value: 'Academia' },
                                        { label: 'Emprestimo', value: 'Emprestimo' },
                                        { label: 'Comida', value: 'Comida' },
                                        { label: 'Telefone', value: 'Telefone' },
                                        { label: 'Entretenimento', value: 'Entretenimento' },
                                        { label: 'Educação', value: 'Educacao' },
                                        { label: 'Beleza', value: 'beleza' },
                                        { label: 'Esporte', value: 'esporte' },
                                        { label: 'Social', value: 'social' },
                                        { label: 'Transporte', value: 'transporte' },
                                        { label: 'Roupas', value: 'roupas' },
                                        { label: 'Carro', value: 'carro' },
                                        { label: 'Bebida', value: 'bebida' },
                                        { label: 'Cigarro', value: 'cigarro' },
                                        { label: 'Eletrônicos', value: 'eletronicos' },
                                        { label: 'Viagem', value: 'viagem' },
                                        { label: 'Saúde', value: 'saude' },
                                        { label: 'Estimação', value: 'estimacao' },
                                        { label: 'Reparar', value: 'reparar' },
                                        { label: 'Moradia', value: 'moradia' },
                                        { label: 'Presente', value: 'presente' },
                                        { label: 'Doações', value: 'doacoes' },
                                        { label: 'Loteria', value: 'loteria' },
                                        { label: 'Lanches', value: 'lanches' },
                                        { label: 'Filhos', value: 'filhos' },
                                        { label: 'Outros', value: 'outros' },
                                    ]}
                                    value={selectedCategory}
                                    placeholder={{ label: 'Selecione', value: 'Selecione' }}
                                />
                            </View>
                        </View>
                    </View>
                    <DividerTask />
                    <View style={{ width: '50%' }}>
                        <TitleTask>Essa conta ja está paga? <Span>(opicional)</Span></TitleTask>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={status ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setStatus(!status)}
                            value={status}
                            style={{ width: 50 }}
                        />
                        <TitleTask>Lembrete? <Span>(opicional)</Span></TitleTask>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={alert ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setAlert(!alert)}
                            value={alert}
                            style={{ width: 50 }}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    <TitleTask>Descrição <Span>(opicional)</Span></TitleTask>
                    <InputDescription
                        multiline
                        numberOfLines={5}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
                <View style={{ marginBottom: 10, height: 200 }}>
                    {showButtonSave && (
                        <Button style={{ marginBottom: 10 }} onPress={isEditing ? handleEditExpense : handleSaveExpense}>
                            <TitleTask>{isEditing ? 'Editar' : 'Salvar'}</TitleTask>
                        </Button>
                    )}
                    {showButtonEdit && (
                        <Button style={{ marginBottom: 10 }} onPress={handleEditExpense}>
                            <TitleTask>Editar</TitleTask>
                        </Button>
                    )}
                    {showButtonRemove && (
                        <Button style={{ marginBottom: 10 }} onPress={handleDeleteExpense}>
                            <TitleTask>Excluir</TitleTask>
                        </Button>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
