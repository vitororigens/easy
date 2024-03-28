import React, { useState } from 'react';
import { DividerTask, Input, TitleTask, InputDescription, Button } from "./styles";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { database } from '../../services';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Toast } from 'react-native-toast-notifications';


export function Revenue() {
    const user = useUserAuth()
    const [selectedCategory, setSelectedCategory] = useState('');
    const [valueTransaction, setValuetransaction] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [repeat, setRepeat] = useState(false);

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


    function handleExpense() {
        if (!selectedCategory || !valueTransaction || !formattedDate || !description) {
            Alert.alert('Atenção!', 'Por favor, preencha todos os campos antes de salvar.')
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
                Toast.show('Transação adicionada!', { type: 'sucess' })
                setDescription('');
                setFormattedDate('');
                setRepeat(false);
                setValuetransaction('');
            })
            .catch(error => {
                console.error('Erro ao adicionar a transação: ', error);
            });
    }


    return (
        <View style={{ flex: 1, padding: 10 }}>
            <ScrollView>
                <View style={{ height: '20%' }}>
                    <TitleTask>Valor</TitleTask>
                    <Input
                        value={valueTransaction}
                        keyboardType="numeric"
                        onChangeText={setValuetransaction}
                    />
                </View>
                <View style={{ flexDirection: 'row', height: 180, marginBottom: 10 }}>
                    <View style={{ width: '50%', height: 180 }}>
                        <View>
                            <TitleTask>Data:</TitleTask>
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
                            <TitleTask style={{
                                marginTop: 20
                            }}>Categorias:</TitleTask>
                            <View style={{
                                height: 50,
                            }}>
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedCategory(value)}
                                    items={[
                                        { label: 'Salário', value: 'salario' },
                                        { label: 'Vendas', value: 'vendas' },
                                        { label: 'Investimentos', value: 'investimentos' },
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
                            style={{
                                width: 50,

                            }}
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
                <View style={{
                    marginBottom: 10
                }}>
                    <Button onPress={handleExpense}>
                        <TitleTask>
                            Salvar
                        </TitleTask>
                    </Button>
                </View>
            </ScrollView>

        </View>

    );
}
