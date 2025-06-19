import React from 'react';
import { z } from "zod";
import { Button } from "../../components/Button";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { Container, Content, InputDescription, InputValue, TextError } from "./styles";
import { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Controller, useForm } from "react-hook-form";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    addDoc
} from '@react-native-firebase/firestore';
import { currencyMask, currencyUnMask, dataMask, horaMask } from "../../utils/mask";
import useSendNotificaitons from "../../hooks/useSendNotifications";
import { Switch } from "../../components/Switch";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { InputTime } from "../../components/InputTime";
import { InputDate } from "../../components/InputDate";
import useFirestoreCollection from '../../hooks/useFirestoreCollection';

const formSchema = z.object({
    category: z.string().min(1, "Categoria é obrigatória"),
    name: z.string().min(1, "Nome é obrigatório"),
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Hora é obrigatória"),
    value: z.string().min(1, "Valor é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    hasNotification: z.boolean().optional(),
    status: z.boolean().optional(),
    expenseType: z.boolean().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewLaunch() {
    const route = useRoute();
    const navigation = useNavigation();
    const { type, selectedItemId } = route.params as { type: "revenue" | "expense"; selectedItemId?: string };
    const { sendNotification, notificationId } = useSendNotificaitons();
    const { data: dataExpense, loading: loadingExpense } = useFirestoreCollection("Expense");
    const { data: dataRevenue, loading: loadingRevenue } = useFirestoreCollection("Revenue");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUserAuth();
    const uid = user?.uid;
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const [subscriberIds, setSubscriberIds] = useState<string[]>([]);
    const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<FormSchemaType>({
        defaultValues: {
            name: '',
            category: '',
            date: '',
            time: '',
            value: '',
            description: '',
            hasNotification: false,
            expenseType: false,
            status: false
        },
    });

    const notifications = watch('hasNotification')

    useEffect(() => {
        if (!loadingExpense && dataExpense) {
            // Aqui, você precisa ajustar a lógica para carregar os subscribers a partir dos dados disponíveis
            const currentUserSubscribers = dataExpense
                .flatMap(item => item.subscribers || [])
                .filter((subscriberId): subscriberId is string => typeof subscriberId === 'string');

            const areEqual = JSON.stringify(currentUserSubscribers) === JSON.stringify(subscriberIds);
            if (!areEqual) {
                setSubscriberIds(currentUserSubscribers);
                console.log("Current User Subscribers:", currentUserSubscribers);
            }
        }
    }, [loadingExpense, dataExpense]);


    const handleScheduleNotification = async (data: FormSchemaType) => {
        if (!subscriberIds || subscriberIds.length === 0 || !uid) {
            console.warn("Nenhum assinante encontrado para enviar notificações.");
            return;
        }

        const [day, month, year] = data.date.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        try {
            await sendNotification({
                title: data.name,
                message: "Você tem um novo evento agendado!",
                subscriptionsIds: subscriberIds,
                date: formattedDate,
                hour: data.time,
            });

            const db = getFirestore();
            const notificationsRef = collection(db, "User", uid, "Notifications");
            await addDoc(notificationsRef, {
                title: data.name,
                message: "Você tem um novo evento agendado!",
                date: formattedDate,
                hour: data.time,
                createdAt: new Date(),
            });

            console.log("Notificação enviada e salva com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar e salvar notificação:", error);
            Toast.show("Erro ao enviar a notificação.", { type: 'danger' });
        }
    };

    const onSubmit = async (data: FormSchemaType) => {
        if (!data.name || !data.value || !data.category || !data.date || !data.time) {
            Toast.show('Por favor, preencha todos os campos obrigatórios antes de salvar.', { type: 'danger' });
            return;
        }

        setIsLoading(true);

        const db = getFirestore();
        const collectionName = type === "revenue" ? "Revenue" : "Expense";
        const docId = selectedItemId || Date.now().toString();

        if (data.hasNotification) {
            await handleScheduleNotification(data);
        }

        const baseData = {
            ...data,
            uid,
            value: currencyUnMask(data.value),
            type,
            createdAt: new Date().toISOString(),
            notificationId: null,
        };

        try {
            if (type === "expense" && data.expenseType) {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();

                const promises = [];
                for (let month = currentMonth; month <= 12; month++) {
                    const date = `${currentYear}-${month.toString().padStart(2, "0")}-01`;
                    const monthData = { ...baseData, date };
                    const newDocRef = doc(collection(db, collectionName));
                    promises.push(setDoc(newDocRef, monthData));
                }

                await Promise.all(promises);
                await updateTotals();
                Toast.show('Despesa fixa salva para todos os meses!', { type: 'success' });
            } else {
                const docRef = doc(db, collectionName, docId);
                await setDoc(docRef, baseData, { merge: true });
                await updateTotals();
                Toast.show(
                    selectedItemId ? 'Lançamento atualizado!' : 'Lançamento adicionado!',
                    { type: 'success' }
                );
            }

            reset();
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar/atualizar lançamento: ', error);
            Toast.show('Erro ao criar/atualizar lançamento!', { type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    const updateTotals = async () => {
        if (!uid) return;

        try {
            const db = getFirestore();
            const revenueQuery = query(
                collection(db, "Revenue"),
                where("uid", "==", uid)
            );
            const expenseQuery = query(
                collection(db, "Expense"),
                where("uid", "==", uid)
            );

            const [revenueSnapshot, expenseSnapshot] = await Promise.all([
                getDocs(revenueQuery),
                getDocs(expenseQuery)
            ]);

            const totalRevenue = revenueSnapshot.docs.reduce(
                (sum, doc) => sum + Number(doc.data().value),
                0
            );
            const totalExpense = expenseSnapshot.docs.reduce(
                (sum, doc) => sum + Number(doc.data().value),
                0
            );

            setTotalRevenue(totalRevenue);
            setTotalExpense(totalExpense);
        } catch (error) {
            console.error("Erro ao calcular totais:", error);
        }
    };

    useEffect(() => {
        if (selectedItemId) {
            const collectionName = type === "revenue" ? "Revenue" : "Expense";
            const db = getFirestore();

            db
                .collection(collectionName)
                .doc(selectedItemId)
                .get()
                .then((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();

                        if (data) {
                            reset({
                                name: data.name || '',
                                category: data.category || '',
                                date: data.date || '',
                                time: data.time || '',
                                value: data.value || '',
                                description: data.description || '',
                                hasNotification: data.hasNotification || false,
                                expenseType: data.expenseType || false,
                                status: data.status || false
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar lançamento: ", error);
                    Toast.show("Erro ao carregar dados do lançamento!", { type: "danger" });
                });
        }
    }, [selectedItemId, type, reset]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <DefaultContainer title={type === "revenue" ? "Nova Entrada" : "Nova Saída"} showButtonBack>
                        <Container>
                            <Controller
                                control={control}
                                name="value"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View>
                                        <InputValue
                                            placeholder="R$ 00,00"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={selectedItemId ? currencyMask((Number(value) * 100).toString()) : currencyMask(value)}
                                        />
                                        {errors.value && <TextError>{errors.value.message}</TextError>}
                                    </View>
                                )}
                            />
                            <Content>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <Input
                                                placeholder="Categoria"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            {errors.category && <TextError>{errors.category.message}</TextError>}
                                        </View>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <>
                                            <Input
                                                placeholder="Nome"
                                                name='user'
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            {errors.name && <TextError>{errors.name.message}</TextError>}
                                        </>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="date"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <>
                                             <InputDate
                                                placeholder="Data"
                                                name="calendar"
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={dataMask(value)}
                                            />
                                            {errors.date && <TextError>{errors.date.message}</TextError>}
                                        </>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="time"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <>
                                             <InputTime
                                                placeholder="Hora"
                                                name="clock"
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                value={horaMask(value ?? "")}
                                            />
                                            {errors.time && <TextError>{errors.time.message}</TextError>}
                                        </>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="hasNotification"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Switch
                                            onValueChange={onChange}
                                            title="Adiconar notificação"
                                            value={value}

                                        />
                                    )}
                                />
                                {type === "expense" && (
                                    <Controller
                                        control={control}
                                        name="expenseType"
                                        render={({ field: { onChange, value } }) => (

                                            <Switch
                                                onValueChange={onChange}
                                                title="Despesa fixa?"
                                                value={value}
                                            />

                                        )}
                                    />
                                )}
                                {type === "expense" && (
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field: { onChange, value } }) => (
                                            <Switch
                                                onValueChange={onChange}
                                                title="Essa conta já está paga?"
                                                value={value}
                                            />
                                        )}
                                    />
                                )}

                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <>
                                            <InputDescription
                                                multiline
                                                numberOfLines={5}
                                                placeholder="Descrição"
                                                textAlignVertical="top"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            {errors.description && <TextError>{errors.description.message}</TextError>}
                                        </>
                                    )}
                                />
                            </Content>
                            <Button title="Salvar" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
                        </Container>
                    </DefaultContainer>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
