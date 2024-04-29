import React, { useState, useEffect } from 'react';
import { DividerTask, Input, TitleTask, InputDescription, Button } from "./styles";
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
    const [selectedCategory, setSelectedCategory] = useState('');
    const [valueTransaction, setValuetransaction] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [repeat, setRepeat] = useState(false);
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
        if (!selectedCategory || !valueTransaction || !formattedDate ) {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos obrigatórios antes de salvar.');
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        database
            .collection('Expense')
            .doc()
            .set({
                category: selectedCategory,
                date: formattedDate,
                valueTransaction: valueTransaction,
                description: description,
                repeat: repeat,
                type: 'output',
                uid: uid,
                month: monthNumber
            })
            .then(() => {
                Toast.show('Transação adicionada!', { type: 'success' });
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setValuetransaction('');
            })
            .catch(error => {
                console.error('Erro ao adicionar a transação: ', error);
            });
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

        if (!selectedCategory || !valueTransaction || !formattedDate || !description) {
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
                category: selectedCategory,
                date: formattedDate,
                valueTransaction: valueTransaction,
                description: description,
                repeat: repeat,
                type: 'output',
                uid: uid,
                month: monthNumber
            })
            .then(() => {
                Toast.show('Transação editada!', { type: 'success' });
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setValuetransaction('');
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
                        setSelectedCategory(data.category);
                        setValuetransaction(data.valueTransaction);
                        setDescription(data.description);
                        setFormattedDate(data.date);
                        setRepeat(data.repeat);
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
                <View style={{ height: '20%' }}>
                    <TitleTask>Valor* </TitleTask>
                    <Input
                        value={valueTransaction}
                        keyboardType="numeric"
                        onChangeText={setValuetransaction}
                    />
                </View>
                <View style={{ flexDirection: 'row', height: 180, marginBottom: 10 }}>
                    <View style={{ width: '50%', height: 180 }}>
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
                            <TitleTask style={{ marginTop: 20 }}>Categorias* </TitleTask>
                            <View style={{ height: 50 }}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedCategory(value)}
                                    items={[
                                        { label: 'Investimentos', value: 'investimentos' },
                                        { label: 'Contas', value: 'Contas' },
                                        { label: 'Compras', value: 'compras' },
                                        { label: 'Faculdade', value: 'Faculdade' },
                                        { label: 'Internet', value: 'Internet' },
                                        { label: 'Academia', value: 'Academia' },
                                        { label: 'Emprestimo', value: 'Emprestimo' },
                                        { label: 'Comida', value: 'comida' },
                                        { label: 'Telefone', value: 'telefone' },
                                        { label: 'Entretenimento', value: 'entretenimento' },
                                        { label: 'Educação', value: 'educacao' },
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
                                    ]}
                                    value={selectedCategory}
                                    placeholder={{ label: 'Selecione', value: 'Selecione' }}
                                />
                            </View>
                        </View>
                    </View>
                    <DividerTask />
                    <View style={{ width: '50%' }}>
                        <TitleTask>Repetir?</TitleTask>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={repeat ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setRepeat(!repeat)}
                            value={repeat}
                            style={{ width: 50 }}
                        />
                    </View>
                </View>
                <View style={{ height: '25%', marginBottom: 5 }}>
                    <TitleTask>Descrição</TitleTask>
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
