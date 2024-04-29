import React, { useEffect, useState } from 'react';
import { DividerTask, Input, TitleTask, InputDescription, Button } from "./styles";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { database } from '../../services';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Toast } from 'react-native-toast-notifications';

type RevenueProps = {
    selectedItemId?: string;
    showButtonRemove?: boolean;
    onCloseModal?: () => void;
    showButtonEdit?: boolean;
    showButtonSave?: boolean;
}

export function Revenue({ selectedItemId, showButtonRemove, onCloseModal, showButtonEdit, showButtonSave }: RevenueProps) {
    const user = useUserAuth()
    const [selectedCategory, setSelectedCategory] = useState('');
    const [valueTransaction, setValuetransaction] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 

    const uid = user?.uid

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


    function handleSaveRevenue() {
        if (!selectedCategory || !valueTransaction || !formattedDate) {
            Alert.alert('Atenção!', 'Por favor, preencha os campos obrigatório antes de salvar.')
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        database
            .collection('Revenue')
            .doc()
            .set({
                category: selectedCategory,
                uid: uid,
                date: formattedDate,
                valueTransaction: valueTransaction,
                description: description,
                repeat: repeat,
                type: 'input',
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
    }

    function handleEditRevenue() {
        if (!selectedItemId) {
            console.error('Nenhum documento selecionado para edição!');
            return;
        }

        if (!selectedCategory || !valueTransaction || !formattedDate) {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos obrigatórios antes de salvar.')
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        database
            .collection('Revenue')
            .doc(selectedItemId)
            .set({
                category: selectedCategory,
                uid: uid,
                date: formattedDate,
                valueTransaction: valueTransaction,
                description: description,
                repeat: repeat,
                type: 'input',
                month: monthNumber
            })
            .then(() => {
                Toast.show('Transação editada!', { type: 'success' })
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setValuetransaction('');
                setIsEditing(false);
                if (onCloseModal) {
                    onCloseModal();
                }
            })
            .catch(error => {
                console.error('Erro ao editar a transação: ', error);
            });
    }

    function handleDeleteRevenue() {
        if (!selectedItemId) {
            console.error('Nenhum documento selecionado para exclusão!');
            return;
        }

        const revenueRef = database.collection('Revenue').doc(selectedItemId);
        revenueRef.delete()
            .then(() => {
                console.log('Documento de receita excluído com sucesso.');
                if (onCloseModal) {
                    onCloseModal();
                }
            })
            .catch((error) => {
                console.error('Erro ao excluir o documento de receita:', error);
            });
    }

    useEffect(() => {
        if (selectedItemId) {
            database.collection('Revenue').doc(selectedItemId).get().then((doc) => {
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
                            <TitleTask>Data*</TitleTask>
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
                            <TitleTask style={{ marginTop: 20 }}>Categorias*</TitleTask>
                            <View style={{ height: 50 }}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedCategory(value)}
                                    items={[
                                        { label: 'Salário', value: 'salario' },
                                        { label: 'Vendas', value: 'vendas' },
                                        { label: 'Investimentos', value: 'investimentos' },
                                        { label: 'Comissão', value: 'Comissão' },
                                        { label: 'Adiantamentos', value: 'Adiantamentos'}
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
                        <Button style={{ marginBottom: 10 }} onPress={isEditing ? handleEditRevenue : handleSaveRevenue}>
                            <TitleTask>{isEditing ? 'Editar' : 'Salvar'}</TitleTask>
                        </Button>
                    )}
                    {showButtonEdit && (
                        <Button style={{ marginBottom: 10 }} onPress={handleEditRevenue}>
                            <TitleTask>Editar</TitleTask>
                        </Button>
                    )}
                    {showButtonRemove && (
                        <Button style={{ marginBottom: 10 }} onPress={handleDeleteRevenue}>
                            <TitleTask>Excluir</TitleTask>
                        </Button>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
