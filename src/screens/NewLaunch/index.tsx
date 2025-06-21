import React from 'react';
import { z } from "zod";
import { Button } from "../../components/Button";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Container, Content, InputDescription, InputValue, TextError } from "./styles";
import { useEffect, useState, useCallback } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { Timestamp } from "@react-native-firebase/firestore";
import { ShareWithUsers } from '../../components/ShareWithUsers';
// import notifee, {
//     AndroidImportance,
//     TimestampTrigger,
//     TriggerType,
// } from "@notifee/react-native";
import { createNotification } from "../../services/firebase/notifications.firebase";
import {
    createSharing,
    ESharingStatus,
    getSharing,
} from "../../services/firebase/sharing.firebase";
import { sendPushNotification } from "../../services/one-signal";
import { useMonth } from "../../context/MonthProvider";

// Categorias específicas
const REVENUE_CATEGORIES = [
    { label: "Salário", value: "salario" },
    { label: "Vendas", value: "vendas" },
    { label: "Investimentos", value: "investimentos" },
    { label: "Comissão", value: "Comissão" },
    { label: "Adiantamentos", value: "Adiantamentos" },
    { label: "Outros", value: "Outros" },
];

const EXPENSE_CATEGORIES = [
    { label: "Investimentos", value: "Investimentos" },
    { label: "Contas", value: "Contas" },
    { label: "Compras", value: "Compras" },
    { label: "Faculdade", value: "Faculdade" },
    { label: "Internet", value: "Internet" },
    { label: "Academia", value: "Academia" },
    { label: "Emprestimo", value: "Emprestimo" },
    { label: "Comida", value: "Comida" },
    { label: "Telefone", value: "Telefone" },
    { label: "Entretenimento", value: "Entretenimento" },
    { label: "Educação", value: "Educacao" },
    { label: "Beleza", value: "beleza" },
    { label: "Esporte", value: "esporte" },
    { label: "Social", value: "social" },
    { label: "Transporte", value: "transporte" },
    { label: "Roupas", value: "roupas" },
    { label: "Carro", value: "carro" },
    { label: "Bebida", value: "bebida" },
    { label: "Cigarro", value: "cigarro" },
    { label: "Eletrônicos", value: "eletronicos" },
    { label: "Viagem", value: "viagem" },
    { label: "Saúde", value: "saude" },
    { label: "Estimação", value: "estimacao" },
    { label: "Reparar", value: "reparar" },
    { label: "Moradia", value: "moradia" },
    { label: "Presente", value: "presente" },
    { label: "Doações", value: "doacoes" },
    { label: "Loteria", value: "loteria" },
    { label: "Lanches", value: "lanches" },
    { label: "Filhos", value: "filhos" },
    { label: "Outros", value: "outros" },
];

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
    repeat: z.boolean().optional(),
    repeatType: z.enum(["finite", "infinite"]).optional(),
    repeatCount: z.number().min(1).optional(),
    notificationDate: z.string().optional(),
    notificationHour: z.string().optional(),
    sharedUsers: z.array(
        z.object({
            uid: z.string(),
            userName: z.string(),
            acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
        })
    ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function NewLaunch() {
    const route = useRoute();
    const navigation = useNavigation();
    const { 
        type, 
        selectedItemId, 
        initialActiveButton, 
        collectionType, 
        isCreator 
    } = route.params as { 
        type?: "revenue" | "expense"; 
        selectedItemId?: string; 
        initialActiveButton?: string;
        collectionType?: string;
        isCreator?: boolean;
    };
    
    // Determinar o tipo baseado no initialActiveButton se não estiver definido
    const determinedType = type || (initialActiveButton === "receitas" ? "revenue" : "expense");
    
    // Determinar a coleção baseada no collectionType ou initialActiveButton
    const determinedCollectionType = collectionType || (initialActiveButton === "receitas" ? "Revenue" : "Expense");
    
    const { sendNotification, notificationId } = useSendNotificaitons();
    const { data: dataExpense, loading: loadingExpense } = useFirestoreCollection("Expense");
    const { data: dataRevenue, loading: loadingRevenue } = useFirestoreCollection("Revenue");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUserAuth();
    const uid = user?.uid;
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const { selectedMonth } = useMonth();

    const [subscriberIds, setSubscriberIds] = useState<string[]>([]);
    
    const form = useForm<FormSchemaType>({
        defaultValues: {
            name: '',
            category: '',
            date: '',
            time: '',
            value: '',
            description: '',
            hasNotification: false,
            expenseType: false,
            status: false,
            repeat: false,
            repeatType: 'finite',
            repeatCount: 1,
            notificationDate: 'no dia',
            notificationHour: '08:00',
            sharedUsers: []
        },
    });
    
    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

    // Função para resetar o formulário com dados específicos
    const resetFormWithData = useCallback((data: any) => {
        console.log('=== RESET FORM WITH DATA ===');
        console.log('Dados para reset:', data);
        reset(data);
    }, [reset]);

    const notifications = watch('hasNotification')
    const repeat = watch('repeat')
    const isExpense = determinedType === "expense";

    // Obter categorias baseadas no tipo
    const getCategories = () => {
        return isExpense ? EXPENSE_CATEGORIES : REVENUE_CATEGORIES;
    };

    // Função para validar parâmetros de notificação
    const validateNotificationParams = () => {
        const notificationDate = watch('notificationDate');
        const notificationHour = watch('notificationHour');

        if (!notificationHour || !notificationDate) {
            return {
                isValid: false,
                errorMessage: "Horário ou data de notificação não definido.",
            };
        }

        const [hour, minute] = notificationHour.split(":");
        if (isNaN(Number(hour)) || isNaN(Number(minute))) {
            return { isValid: false, errorMessage: "Hora ou minuto inválido." };
        }

        const [day, month, year] = watch('date').split('/');
        const notificationDateObj = new Date(Number(year), Number(month) - 1, Number(day));
        notificationDateObj.setHours(Number(hour), Number(minute), 0, 0);

        switch (notificationDate) {
            case "um dia antes":
                notificationDateObj.setDate(notificationDateObj.getDate() - 1);
                break;
            case "tres dias antes":
                notificationDateObj.setDate(notificationDateObj.getDate() - 3);
                break;
            case "cinco dias antes":
                notificationDateObj.setDate(notificationDateObj.getDate() - 5);
                break;
            default:
                // "no dia" - não altera a data
                break;
        }

        if (notificationDateObj < new Date()) {
            return {
                isValid: false,
                errorMessage: "A data de notificação está no passado.",
            };
        }

        return { isValid: true, notificationDate: notificationDateObj };
    };

    // Agendar notificação local
    const scheduleNotification = async (notificationDate: Date) => {
        // TODO: Replace with alternative notification solution
        console.log("Notification would be scheduled for:", notificationDate);
        console.log("Item:", watch('name'));
        
        // Temporary: Using OneSignal for now instead of local notifications
        try {
            // For now, just log the notification details
            console.log("Scheduling notification for:", {
                title: "Lembrete de conta!",
                body: `Você tem uma ${isExpense ? 'despesa' : 'receita'} agendada: ${watch('name')}`,
                date: notificationDate
            });
        } catch (error) {
            console.error("Erro ao agendar notificação:", error);
        }
    };

    // Criar itens recorrentes
    const createRepeatedItems = async (itemData: any, monthNumber: number, year: number, day: number) => {
        if (!itemData.repeat) return;

        const repeatType = itemData.repeatType || 'finite';
        const repeatCount = itemData.repeatCount || 1;
        
        console.log('=== CRIANDO ITENS REPETIDOS ===');
        console.log('Tipo de repetição:', repeatType);
        console.log('Quantidade:', repeatCount);

        try {
            const db = getFirestore();
            const collectionName = determinedCollectionType;
            
            // Determinar quantos meses criar
            let monthsToCreate = 0;
            if (repeatType === 'finite') {
                monthsToCreate = repeatCount - 1; // -1 porque o item principal já conta como 1
            } else {
                // Para infinito, criar para os próximos 12 meses
                monthsToCreate = 12;
            }

            console.log('Meses a criar:', monthsToCreate);

            for (let i = 1; i <= monthsToCreate; i++) {
                const nextMonth = monthNumber + i;
                const nextYear = year + Math.floor((nextMonth - 1) / 12);
                const adjustedMonth = ((nextMonth - 1) % 12) + 1;

                // Verificar se o dia existe no mês
                const daysInMonth = new Date(nextYear, adjustedMonth, 0).getDate();
                const adjustedDay = Math.min(day, daysInMonth);

                const repeatedItemData = {
                    ...itemData,
                    month: adjustedMonth,
                    date: `${adjustedDay.toString().padStart(2, '0')}/${adjustedMonth.toString().padStart(2, '0')}/${nextYear}`,
                    createdAt: new Date().toISOString(),
                    isRepeated: true,
                    originalItemId: itemData.id || Date.now().toString(),
                    repeatIndex: i
                };

                console.log(`Criando item para ${adjustedMonth}/${nextYear} - Dia: ${adjustedDay}`);

                await addDoc(collection(db, collectionName), repeatedItemData);
            }

            console.log('Itens repetidos criados com sucesso');
        } catch (error) {
            console.error('Erro ao criar itens repetidos:', error);
            Toast.show('Erro ao criar itens repetidos!', { type: 'danger' });
        }
    };

    // Notificações para usuários compartilhados
    const handleUserNotifications = async (
        sharedUsers: FormSchemaType['sharedUsers'],
        usersInvitedByMe: any[],
        createdItemId: string
    ) => {
        if (!sharedUsers?.length || !uid || !user?.displayName) return;

        const notificationPromises = sharedUsers.map(async (userSharing) => {
            const alreadySharing = usersInvitedByMe.some(
                (u) => u.target === userSharing.uid && u.status === "accepted"
            );

            const possibleSharingRequestExists = usersInvitedByMe.some(
                (u) => u.target === userSharing.uid
            );

            const message = alreadySharing
                ? `${user.displayName} adicionou um novo item`
                : `${user.displayName} convidou você para compartilhar um item`;

            const notificationData = {
                sender: uid,
                receiver: userSharing.uid,
                status: alreadySharing ? "sharing_accepted" as const : "pending" as const,
                type: "sharing_invite" as const,
                source: {
                    type: isExpense ? "expense" as const : "expense" as const,
                    id: createdItemId,
                },
                title: `Compartilhamento de ${isExpense ? 'despesa' : 'receita'}`,
                description: message,
                createdAt: Timestamp.now(),
            };

            const promises = [
                createNotification(notificationData),
                sendPushNotification({
                    title: `Compartilhamento de ${isExpense ? 'despesa' : 'receita'}`,
                    message,
                    uid: userSharing.uid,
                }),
            ];

            if (!alreadySharing && !possibleSharingRequestExists) {
                promises.push(
                    createSharing({
                        invitedBy: uid,
                        status: ESharingStatus.PENDING,
                        target: userSharing.uid,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    })
                );
            }

            return Promise.allSettled(promises);
        });

        await Promise.all(notificationPromises);
    };

    const handleScheduleNotification = async (data: FormSchemaType) => {
        if (!data.hasNotification) return;

        try {
            const notificationValidation = validateNotificationParams();
            if (!notificationValidation.isValid) {
                Toast.show(notificationValidation.errorMessage, { type: 'danger' });
                return;
            }

            if (notificationValidation.notificationDate) {
                // Se for repetição, criar notificações para todos os meses
                if (data.repeat) {
                    const repeatType = data.repeatType || 'finite';
                    const repeatCount = data.repeatCount || 1;
                    
                    let monthsToNotify = 0;
                    if (repeatType === 'finite') {
                        monthsToNotify = repeatCount;
                    } else {
                        // Para infinito, criar notificações para os próximos 12 meses
                        monthsToNotify = 12;
                    }

                    console.log('=== CRIANDO NOTIFICAÇÕES REPETIDAS ===');
                    console.log('Meses para notificar:', monthsToNotify);

                    // Parse da data para obter mês, ano e dia
                    const [day, month, year] = data.date.split('/');
                    const monthNumber = Number(month);
                    const yearNumber = Number(year);
                    const dayNumber = Number(day);

                    for (let i = 0; i < monthsToNotify; i++) {
                        const nextMonth = monthNumber + i;
                        const nextYear = yearNumber + Math.floor((nextMonth - 1) / 12);
                        const adjustedMonth = ((nextMonth - 1) % 12) + 1;

                        // Verificar se o dia existe no mês
                        const daysInMonth = new Date(nextYear, adjustedMonth, 0).getDate();
                        const adjustedDay = Math.min(dayNumber, daysInMonth);

                        const notificationDate = new Date(nextYear, adjustedMonth - 1, adjustedDay);
                        
                        // Ajustar a data baseado na opção de notificação
                        switch (data.notificationDate) {
                            case 'um dia antes':
                                notificationDate.setDate(notificationDate.getDate() - 1);
                                break;
                            case 'tres dias antes':
                                notificationDate.setDate(notificationDate.getDate() - 3);
                                break;
                            case 'cinco dias antes':
                                notificationDate.setDate(notificationDate.getDate() - 5);
                                break;
                            default: // 'no dia'
                                break;
                        }

                        // Definir a hora da notificação
                        const [hour, minute] = (data.notificationHour || '08:00').split(':');
                        notificationDate.setHours(Number(hour), Number(minute), 0, 0);

                        console.log(`Agendando notificação para ${notificationDate.toLocaleDateString()} ${notificationDate.toLocaleTimeString()}`);

                        await scheduleNotification(notificationDate);
                    }
                } else {
                    // Notificação única
                    await scheduleNotification(notificationValidation.notificationDate);
                }
            }
        } catch (error) {
            console.error('Erro ao agendar notificações:', error);
            Toast.show('Erro ao agendar notificações!', { type: 'danger' });
        }
    };

    const onSubmit = async (data: FormSchemaType) => {
        console.log('=== INÍCIO DO SUBMIT ===');
        console.log('Hora no formulário:', data.time);
        console.log('selectedItemId:', selectedItemId);
        
        if (!data.name || !data.value || !data.category || !data.date || !data.time) {
            Toast.show('Por favor, preencha todos os campos obrigatórios antes de salvar.', { type: 'danger' });
            return;
        }

        setIsLoading(true);

        try {
            const db = getFirestore();
            const collectionName = determinedCollectionType;
            const docId = selectedItemId || Date.now().toString();

            // Validar notificação se habilitada
            await handleScheduleNotification(data);

            // Parse da data para obter mês, ano e dia
            const [day, month, year] = data.date.split('/');
            const monthNumber = Number(month);
            const yearNumber = Number(year);
            const dayNumber = Number(day);

            // Obter usuários convidados por mim para verificar status de compartilhamento
            const usersInvitedByMe = await getSharing({
                profile: "invitedBy",
                uid: uid || "",
            });

            const transactionValue = data.value ? currencyUnMask(data.value) : "0";

            const baseData = {
                name: data.name,
                category: data.category,
                uid: uid || "",
                date: data.date,
                time: data.time,
                valueTransaction: transactionValue,
                description: data.description || "",
                repeat: data.repeat || false,
                repeatType: data.repeatType || 'finite',
                repeatCount: data.repeatCount || 1,
                type: isExpense ? "output" : "input",
                month: monthNumber,
                status: data.status || false,
                shareWith: data.sharedUsers?.map((user) => user.uid) || [],
                shareInfo: data.sharedUsers?.map((user) => ({
                    uid: user.uid,
                    userName: user.userName,
                    acceptedAt: usersInvitedByMe.some(
                        (u) => u.target === user.uid && u.status === ESharingStatus.ACCEPTED
                    )
                        ? Timestamp.now()
                        : null,
                })) || [],
                createdAt: new Date().toISOString(),
            };

            console.log('Hora no baseData:', baseData.time);

            // Criar ou atualizar o item principal
            const docRef = doc(db, collectionName, docId);
            await setDoc(docRef, baseData, { merge: true });

            // Criar itens recorrentes se habilitado
            await createRepeatedItems(baseData, monthNumber, yearNumber, dayNumber);

            // Enviar notificações para usuários compartilhados
            await handleUserNotifications(
                data.sharedUsers,
                usersInvitedByMe,
                docId
            );

            await updateTotals();
            
            Toast.show(
                selectedItemId ? 'Lançamento atualizado!' : 'Lançamento adicionado!',
                { type: 'success' }
            );

            console.log('Vou resetar?', !selectedItemId);

            // Só resetar o formulário se for uma criação nova, não uma atualização
            if (!selectedItemId) {
                console.log('RESETANDO FORMULÁRIO (criação nova)');
                reset();
            } else {
                console.log('NÃO RESETANDO FORMULÁRIO (atualização)');
            }
            
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
        console.log('=== USEEFFECT CARREGAMENTO ===');
        console.log('selectedItemId:', selectedItemId);
        console.log('determinedCollectionType:', determinedCollectionType);
        
        if (selectedItemId) {
            const collectionName = determinedCollectionType;
            const db = getFirestore();

            console.log('Buscando documento na coleção:', collectionName);

            db
                .collection(collectionName)
                .doc(selectedItemId)
                .get()
                .then((doc) => {
                    console.log('Documento encontrado:', doc.exists());
                    if (doc.exists()) {
                        const data = doc.data();
                        console.log('Dados brutos do documento:', data);

                        if (data) {
                            // Formatar a hora corretamente se existir
                            let formattedTime = '';
                            if (data.time) {
                                console.log('Hora original:', data.time, 'Tipo:', typeof data.time);
                                // Se o time já estiver no formato HH:MM, usar diretamente
                                if (typeof data.time === 'string' && data.time.includes(':')) {
                                    formattedTime = data.time;
                                } else {
                                    // Se for um timestamp ou outro formato, converter
                                    try {
                                        const timeDate = new Date(data.time);
                                        formattedTime = timeDate.toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        });
                                    } catch (error) {
                                        console.error('Erro ao formatar hora:', error);
                                        formattedTime = '';
                                    }
                                }
                                console.log('Hora formatada:', formattedTime);
                            } else {
                                console.log('Nenhuma hora encontrada nos dados, definindo hora padrão');
                                // Definir hora padrão quando não existir no banco
                                const now = new Date();
                                formattedTime = now.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                });
                                console.log('Hora padrão definida:', formattedTime);
                            }
                            console.log(data.shareInfo);
                            
                            const formData = {
                                name: data.name || '',
                                category: data.category || '',
                                date: data.date || '',
                                time: formattedTime,
                                value: data.valueTransaction || '',
                                description: data.description || '',
                                hasNotification: data.hasNotification || false,
                                status: data.status || false,
                                repeat: data.repeat || false,
                                repeatType: data.repeatType || 'finite',
                                repeatCount: data.repeatCount || 1,
                                notificationDate: data.notificationDate || 'no dia',
                                notificationHour: data.notificationHour || '08:00',
                                sharedUsers: data.shareInfo || []
                            };
                            
                            console.log('=== DADOS DO FORMULÁRIO ===');
                            console.log('Dados que serão setados no formulário:', formData);
                            console.log('Hora que será setada:', formData.time);
                            
                            resetFormWithData(formData);
                            
                            console.log('=== APÓS RESET ===');
                            console.log('Formulário resetado com os dados');
                        }
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar lançamento: ", error);
                    Toast.show("Erro ao carregar dados do lançamento!", { type: "danger" });
                });
        } else {
            console.log('Nenhum selectedItemId, não carregando dados');
        }
    }, [selectedItemId, determinedCollectionType, resetFormWithData]);

    return (
      <DefaultContainer title={determinedType === "revenue" ? "Nova Entrada" : "Nova Saída"} backButton>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                  
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
                                            <Select
                                                onValueChange={onChange}
                                                value={value}
                                                placeholder="Selecione uma categoria"
                                                items={getCategories()}
                                                errorMessage={errors.category?.message}
                                            />
                                        </View>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            name="name"
                                            placeholder="Nome"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            errorMessage={errors.name?.message}
                                        />
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
                                    render={({ field: { onChange, onBlur, value } }) => {
                                        console.log('=== CONTROLLER TIME ===');
                                        console.log('Value no controller:', value);
                                        console.log('Tipo do value:', typeof value);
                                        console.log('Value é string vazia?', value === '');
                                        console.log('Value é null?', value === null);
                                        console.log('Value é undefined?', value === undefined);
                                        
                                        return (
                                            <>
                                                 <InputTime
                                                    placeholder="Hora"
                                                    name="clock"
                                                    onBlur={onBlur}
                                                    onChange={(newValue) => {
                                                        console.log('=== ONCHANGE TIME ===');
                                                        console.log('Novo valor:', newValue);
                                                        onChange(newValue);
                                                    }}
                                                    value={value || ""}
                                                />
                                                {errors.time && <TextError>{errors.time.message}</TextError>}
                                            </>
                                        );
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="repeat"
                                    render={({ field: { onChange, value } }) => (
                                        <Switch
                                            onValueChange={onChange}
                                            title="Repetir mensalmente?"
                                            value={value}
                                        />
                                    )}
                                />
                                {repeat && (
                                    <>
                                        <Controller
                                            control={control}
                                            name="repeatType"
                                            render={({ field: { onChange, value } }) => (
                                                <View>
                                                    <Select
                                                        onValueChange={onChange}
                                                        value={value}
                                                        placeholder="Tipo de repetição"
                                                        items={[
                                                            { label: "Quantidade definida", value: "finite" },
                                                            { label: "Infinitamente", value: "infinite" },
                                                        ]}
                                                    />
                                                </View>
                                            )}
                                        />
                                        
                                        {watch('repeatType') === 'finite' && (
                                            <Controller
                                                control={control}
                                                name="repeatCount"
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <Input
                                                        name="repeatCount"
                                                        placeholder="Quantidade de vezes"
                                                        value={value ? String(value) : "1"}
                                                        onChangeText={(text) => {
                                                            const numValue = parseInt(text.replace(/\D/g, '')) || 1;
                                                            onChange(Math.min(Math.max(numValue, 1), 60)); // Limitar entre 1 e 60
                                                        }}
                                                        onBlur={onBlur}
                                                        keyboardType="numeric"
                                                    />
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                                <Controller
                                    control={control}
                                    name="hasNotification"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Switch
                                            onValueChange={onChange}
                                            title="Adicionar notificação"
                                            value={value}
                                        />
                                    )}
                                />
                                {notifications && (
                                    <>
                                        <Controller
                                            control={control}
                                            name="notificationDate"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <View>
                                                    <Select
                                                        onValueChange={onChange}
                                                        value={value}
                                                        placeholder="Quando notificar?"
                                                        items={[
                                                            { label: "No dia", value: "no dia" },
                                                            { label: "Um dia antes", value: "um dia antes" },
                                                            { label: "Tres dias antes", value: "tres dias antes" },
                                                            { label: "Cinco dias antes", value: "cinco dias antes" },
                                                        ]}
                                                    />
                                                </View>
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="notificationHour"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <View>
                                                    <Select
                                                        onValueChange={onChange}
                                                        value={value}
                                                        placeholder="Horário da notificação"
                                                        items={[
                                                            { label: "07:00", value: "07:00" },
                                                            { label: "08:00", value: "08:00" },
                                                            { label: "09:00", value: "09:00" },
                                                        ]}
                                                    />
                                                </View>
                                            )}
                                        />
                                    </>
                                )}
                                {isExpense && (
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
                                {isCreator && (
                                    <FormProvider {...form}>
                                        <ShareWithUsers 
                                            control={control} 
                                            name="sharedUsers" 
                                        />
                                    </FormProvider>
                                )}
                            </Content>
                            <Button title="Salvar" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
                        </Container>
           
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </DefaultContainer>
    );
}
