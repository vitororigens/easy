import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { Toast } from 'react-native-toast-notifications';
import { useUserAuth } from '../../hooks/useUserAuth';
import { database } from '../../services';
import { Button, DividerTask, Input, InputDescription, Span, TitleTask } from "./styles";

type RevenueProps = {
    selectedItemId?: string;
    showButtonRemove?: boolean;
    onCloseModal?: () => void;
    showButtonEdit?: boolean;
    showButtonSave?: boolean;
}

export function Revenue({ selectedItemId, showButtonRemove, onCloseModal, showButtonEdit, showButtonSave }: RevenueProps) {
    const user = useUserAuth()
    const [selectedCategory, setSelectedCategory] = useState('Outros');
    const [name, setName] = useState("");
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
        if (!name || !valueTransaction || !formattedDate) {
            Alert.alert('Atenção!', 'Por favor, preencha os campos obrigatórios antes de salvar.')
            return;
        }

        const [day, month, year] = formattedDate.split('/');
        const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
        const monthNumber = selectedDate.getMonth() + 1;

        const revenueData = {
            name: name,
            category: selectedCategory,
            uid: uid,
            date: formattedDate,
            valueTransaction: valueTransaction,
            description: description,
            repeat: repeat,
            type: 'input',
            month: monthNumber
        };

        // Salva o lançamento de receita para o mês atual
        database.collection('Revenue').add(revenueData)
            .then(() => {
                Toast.show('Transação adicionada!', { type: 'success' });
                setName('');
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setValuetransaction('');
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
                const nextMonthRevenueData = { ...revenueData, date: nextDate, month: nextMonth };
        
                database.collection('Revenue').add(nextMonthRevenueData)
                    .catch(error => {
                        console.error('Erro ao adicionar a transação repetida: ', error);
                    });
            }
        }
    }

    function handleEditRevenue() {
        if (!selectedItemId) {
            console.error('Nenhum documento selecionado para edição!');
            return;
        }

        if (!name || !valueTransaction || !formattedDate) {
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
                name: name,
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
                setName('');
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
                        setName(data.name);
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
                <View>
                <TitleTask>Nome*</TitleTask>
                    <Input
                        value={name}
                        onChangeText={setName}
                    />
                    <TitleTask>Valor* </TitleTask>
                    <Input
                        value={valueTransaction}
                        keyboardType="numeric"
                        onChangeText={setValuetransaction}
                    />
                </View>
                <View style={{ flexDirection: 'row',  marginBottom: 10 }}>
                    <View style={{ width: '50%' }}>
                        <View>
                            <TitleTask>Data*</TitleTask>
                            <TouchableOpacity style={{ height: 50 }} onPress={showDatePickerModal}>
                                <Input value={formattedDate} editable={false} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display='calendar'
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>
                        <View>
                            <TitleTask style={{ marginTop: 20 }}>Categorias <Span>(opicional)</Span> </TitleTask>
                            <View style={{ height: 50 }}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedCategory(value)}
                                    items={[
                                        { label: 'Salário', value: 'salario' },
                                        { label: 'Vendas', value: 'vendas' },
                                        { label: 'Investimentos', value: 'investimentos' },
                                        { label: 'Comissão', value: 'Comissão' },
                                        { label: 'Adiantamentos', value: 'Adiantamentos'},
                                        { label: 'Outros', value: 'Outros'}
                                    ]}
                                    value={selectedCategory}
                                    placeholder={{ label: 'Selecione', value: 'Selecione' }}
                                />
                            </View>
                        </View>
                    </View>
                    <DividerTask />
                    <View style={{ width: '40%' }}>
                        <TitleTask>Repetir essa receita? <Span>(opicional)</Span></TitleTask>
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
                <View style={{  marginBottom: 5 }}>
                    <TitleTask>Descrição <Span>(opcional)</Span></TitleTask>
                    <InputDescription
                        multiline
                        numberOfLines={5}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                        style={{padding: 12}}
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
