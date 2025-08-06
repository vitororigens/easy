import React from 'react';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Container, Content, InputDescription, InputValue, TextError, ScrollContent, KeyboardAvoiding } from './styles';
import { useEffect, useState, useCallback } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  addDoc,
} from '@react-native-firebase/firestore';
import { currencyMask, currencyUnMask, dataMask } from '../../utils/mask';
import { Switch } from '../../components/Switch';
import { View, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { InputTime } from '../../components/InputTime';
import { InputDate } from '../../components/InputDate';
import { Timestamp } from '@react-native-firebase/firestore';
import { ShareWithUsers } from '../../components/ShareWithUsers';
import { createNotification } from '../../services/firebase/notifications.firebase';
import {
  createSharing,
  ESharingStatus,
  getSharing,
} from '../../services/firebase/sharing.firebase';
import { sendPushNotification } from '../../services/one-signal';
import useSendNotifications from '@/hooks/useSendNotifications';

// Categorias específicas
const REVENUE_CATEGORIES = [
  { label: 'Salário', value: 'salario' },
  { label: 'Vendas', value: 'vendas' },
  { label: 'Investimentos', value: 'investimentos' },
  { label: 'Comissão', value: 'Comissão' },
  { label: 'Adiantamentos', value: 'Adiantamentos' },
  { label: 'Outros', value: 'Outros' },
];

const EXPENSE_CATEGORIES = [
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
];

const formSchema = z.object({
  category: z.string().min(1, 'Categoria é obrigatória'),
  name: z.string().min(1, 'Nome é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Hora é obrigatória'),
  value: z.string().min(1, 'Valor é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  hasNotification: z.boolean().optional(),
  status: z.boolean().optional(),
  expenseType: z.boolean().optional(),
  repeat: z.boolean().optional(),
  repeatType: z.enum(['finite', 'infinite']).optional(),
  repeatCount: z.number().min(1).optional(),
  notificationDate: z.string().optional(),
  notificationHour: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    }),
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

type NewLaunchProps = {
  selectedItemId?: string;
};

// Define a type for items with optional id
type ItemDataWithId = FormSchemaType & { id?: string };
// Define a type for sharing users
type SharingUser = { target: string; status: string };

export function NewLaunch(props: NewLaunchProps) {
  const route = useRoute();
  const navigation = useNavigation();
  const routeParams = route.params as {
        type?: 'revenue' | 'expense';
        selectedItemId?: string;
        initialActiveButton?: string;
        collectionType?: string;
        isCreator?: boolean;
    };
  const selectedItemId = props.selectedItemId ?? routeParams?.selectedItemId;
  const {
    type,
    initialActiveButton,
    collectionType,
    isCreator,
  } = routeParams;

  // Determinar o tipo baseado no initialActiveButton se não estiver definido
  const determinedType = type || (initialActiveButton === 'receitas' ? 'revenue' : 'expense');

  // Determinar a coleção baseada no collectionType ou initialActiveButton
  const determinedCollectionType = collectionType || (initialActiveButton === 'receitas' ? 'Revenue' : 'Expense');

  const { user } = useUserAuth();
  const uid = user?.uid;
  const [isLoading, setIsLoading] = useState(false);

  // Use o hook corretamente no início do componente
  const { sendNotification } = useSendNotifications();

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
      sharedUsers: [],
    },
  });

  const { control, handleSubmit, reset, watch, formState: { errors } } = form;

  // Função para resetar o formulário com dados específicos
  const resetFormWithData = useCallback((data: FormSchemaType) => {
    reset(data);
  }, [reset]);

  const notifications = watch('hasNotification');
  const repeat = watch('repeat');
  const isExpense = determinedType === 'expense';

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
        errorMessage: 'Horário ou data de notificação não definido.',
      };
    }

    const [hour, minute] = notificationHour.split(':');
    if (isNaN(Number(hour)) || isNaN(Number(minute))) {
      return { isValid: false, errorMessage: 'Hora ou minuto inválido.' };
    }

    const [day, month, year] = watch('date').split('/');
    const notificationDateObj = new Date(Number(year), Number(month) - 1, Number(day));
    notificationDateObj.setHours(Number(hour), Number(minute), 0, 0);

    switch (notificationDate) {
    case 'um dia antes':
      notificationDateObj.setDate(notificationDateObj.getDate() - 1);
      break;
    case 'tres dias antes':
      notificationDateObj.setDate(notificationDateObj.getDate() - 3);
      break;
    case 'cinco dias antes':
      notificationDateObj.setDate(notificationDateObj.getDate() - 5);
      break;
    default:
      // "no dia" - não altera a data
      break;
    }

    if (notificationDateObj < new Date()) {
      return {
        isValid: false,
        errorMessage: 'A data de notificação está no passado.',
      };
    }

    return { isValid: true, notificationDate: notificationDateObj };
  };

  // Agendar notificação local (agora agenda push via OneSignal)
  const scheduleNotification = async ({
    title,
    message,
    subscriptionsIds,
    date,
    hour,
  }: {
    title: string;
    message: string;
    subscriptionsIds: string[];
    date: string; // formato dd/mm/yyyy
    hour: string; // formato HH:mm
  }) => {
    await sendNotification({
      title,
      message,
      subscriptionsIds,
      date,
      hour,
    });
  };

  // Criar itens recorrentes
  const createRepeatedItems = async (itemData: unknown, monthNumber: number, year: number, day: number) => {
    if (!itemData || !repeat) return;

    const itemDataTyped = itemData as ItemDataWithId;
    const repeatType = itemDataTyped.repeatType || 'finite';
    const repeatCount = itemDataTyped.repeatCount || 1;

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

      for (let i = 1; i <= monthsToCreate; i++) {
        const nextMonth = monthNumber + i;
        const nextYear = year + Math.floor((nextMonth - 1) / 12);
        const adjustedMonth = ((nextMonth - 1) % 12) + 1;

        // Verificar se o dia existe no mês
        const daysInMonth = new Date(nextYear, adjustedMonth, 0).getDate();
        const adjustedDay = Math.min(day, daysInMonth);

        const repeatedItemData = {
          ...itemDataTyped,
          month: adjustedMonth,
          date: `${adjustedDay.toString().padStart(2, '0')}/${adjustedMonth.toString().padStart(2, '0')}/${nextYear}`,
          createdAt: new Date().toISOString(),
          isRepeated: true,
          originalItemId: (itemDataTyped as ItemDataWithId).id || Date.now().toString(),
          repeatIndex: i,
        };

        await addDoc(collection(db, collectionName), repeatedItemData);
      }

      // Itens repetidos criados com sucesso
    } catch {
      Toast.show('Erro ao criar itens repetidos!', { type: 'danger' });
    }
  };

  // Notificações para usuários compartilhados
  const handleUserNotifications = async (
    sharedUsers: FormSchemaType['sharedUsers'],
    usersInvitedByMe: unknown[],
    createdItemId: string,
  ) => {
    if (!sharedUsers?.length || !uid || !user?.displayName) return;

    const notificationPromises = sharedUsers.map(async (userSharing) => {
      const alreadySharing = (usersInvitedByMe as SharingUser[]).some(
        (u) => u.target === userSharing.uid && u.status === 'accepted',
      );

      const possibleSharingRequestExists = (usersInvitedByMe as SharingUser[]).some(
        (u) => u.target === userSharing.uid,
      );

      const message = alreadySharing
        ? `${user.displayName} adicionou um novo item`
        : `${user.displayName} convidou você para compartilhar um item`;

      const notificationData = {
        sender: uid,
        receiver: userSharing.uid,
        status: alreadySharing ? 'sharing_accepted' as const : 'pending' as const,
        type: 'sharing_invite' as const,
        source: {
          type: isExpense ? 'expense' as const : 'expense' as const,
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
          }),
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
        Toast.show(notificationValidation.errorMessage ?? 'Erro desconhecido', { type: 'danger' });
        return;
      }

      // Parse da data para obter mês, ano e dia
      const [day, month, year] = data.date.split('/');
      const dayNumber = Number(day);
      const monthNumber = Number(month);
      const yearNumber = Number(year);

      // Definir a hora da notificação
      const [hour, minute] = (data.notificationHour || '08:00').split(':');

      // Lista de usuários para notificação
      const subscriptionsIds = data.sharedUsers?.map(u => u.uid) ?? [];

      if (data.repeat) {
        const repeatType = data.repeatType || 'finite';
        const repeatCount = data.repeatCount || 1;
        const monthsToNotify = repeatType === 'finite' ? repeatCount : 12;

        for (let i = 0; i < monthsToNotify; i++) {
          const nextMonth = monthNumber + i;
          const nextYear = yearNumber + Math.floor((nextMonth - 1) / 12);
          const adjustedMonth = ((nextMonth - 1) % 12) + 1;

          // Verificar se o dia existe no mês
          const daysInMonth = new Date(nextYear, adjustedMonth, 0).getDate();
          const adjustedDay = Math.min(dayNumber, daysInMonth);

          await scheduleNotification({
            title: `Compartilhamento de ${isExpense ? 'despesa' : 'receita'}`,
            message: `${user?.displayName} convidou você para compartilhar um item`,
            subscriptionsIds,
            date: `${adjustedDay.toString().padStart(2, '0')}/${adjustedMonth.toString().padStart(2, '0')}/${nextYear}`,
            hour: `${hour}:${minute}`,
          });
        }
      } else {
        // Notificação única
        await scheduleNotification({
          title: `Compartilhamento de ${isExpense ? 'despesa' : 'receita'}`,
          message: `${user?.displayName} convidou você para compartilhar um item`,
          subscriptionsIds,
          date: `${dayNumber.toString().padStart(2, '0')}/${monthNumber.toString().padStart(2, '0')}/${yearNumber}`,
          hour: `${hour}:${minute}`,
        });
      }
    } catch {
      Toast.show('Erro ao agendar notificações!', { type: 'danger' });
    }
  };

  const onSubmit = async (data: FormSchemaType) => {
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
        profile: 'invitedBy',
        uid: uid || '',
      });

      const transactionValue = data.value ? currencyUnMask(data.value) : '0';

      const baseData = {
        name: data.name,
        category: data.category,
        uid: uid || '',
        date: data.date,
        time: data.time,
        valueTransaction: transactionValue,
        description: data.description || '',
        repeat: data.repeat || false,
        repeatType: data.repeatType || 'finite',
        repeatCount: data.repeatCount || 1,
        type: isExpense ? 'output' : 'input',
        month: monthNumber,
        status: data.status || false,
        shareWith: data.sharedUsers?.map((user) => user.uid) || [],
        shareInfo: data.sharedUsers?.map((user) => ({
          uid: user.uid,
          userName: user.userName,
          acceptedAt: usersInvitedByMe.some(
            (u) => u.target === user.uid && u.status === ESharingStatus.ACCEPTED,
          )
            ? Timestamp.now()
            : null,
        })) || [],
        createdAt: new Date().toISOString(),
      };

      // Criar ou atualizar o item principal
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, baseData, { merge: true });

      // Criar itens recorrentes se habilitado
      await createRepeatedItems(baseData, monthNumber, yearNumber, dayNumber);

      // Enviar notificações para usuários compartilhados
      await handleUserNotifications(
        data.sharedUsers,
        usersInvitedByMe,
        docId,
      );

      await updateTotals();

      Toast.show(
        selectedItemId ? 'Lançamento atualizado!' : 'Lançamento adicionado!',
        { type: 'success' },
      );

      if (!selectedItemId) {
        reset();
      }

      navigation.goBack();
    } catch {
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
        collection(db, 'Revenue'),
        where('uid', '==', uid),
      );
      const expenseQuery = query(
        collection(db, 'Expense'),
        where('uid', '==', uid),
      );

      await Promise.all([
        getDocs(revenueQuery),
        getDocs(expenseQuery),
      ]);
      // Totals are not used, so calculation is omitted
    } catch {
      // No-op
    }
  };

  useEffect(() => {
    if (selectedItemId) {
      const collectionName = determinedCollectionType;
      const db = getFirestore();

      db
        .collection(collectionName)
        .doc(selectedItemId)
        .get()
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();

            if (data) {
              // Formatar a hora corretamente se existir
              let formattedTime = '';
              if (data['time']) {
                // Se o time já estiver no formato HH:MM, usar diretamente
                if (typeof data['time'] === 'string' && data['time'].includes(':')) {
                  formattedTime = data['time'];
                } else {
                  // Se for um timestamp ou outro formato, converter
                  try {
                    const timeDate = new Date(data['time']);
                    formattedTime = timeDate.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });
                  } catch {
                    formattedTime = '';
                  }
                }
              } else {
                // Definir hora padrão quando não existir no banco
                const now = new Date();
                formattedTime = now.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              }

              const formData = {
                name: data['name'] || '',
                category: data['category'] || '',
                date: data['date'] || '',
                time: formattedTime,
                value: data['valueTransaction'] || '',
                description: data['description'] || '',
                hasNotification: data['hasNotification'] || false,
                status: data['status'] || false,
                repeat: data['repeat'] || false,
                repeatType: data['repeatType'] || 'finite',
                repeatCount: data['repeatCount'] || 1,
                notificationDate: data['notificationDate'] || 'no dia',
                notificationHour: data['notificationHour'] || '08:00',
                sharedUsers: data['shareInfo'] || [],
              };

              resetFormWithData(formData);
            }
          }
        })
        .catch(() => {
          Toast.show('Erro ao carregar dados do lançamento!', { type: 'danger' });
        });
    }
  }, [selectedItemId, determinedCollectionType, resetFormWithData]);

  return (
    <DefaultContainer title={determinedType === 'revenue' ? 'Nova Entrada' : 'Nova Saída'} backButton>
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollContent keyboardShouldPersistTaps="handled">

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
                      value={selectedItemId ? currencyMask((Number(value ?? '') * 100).toString()) : currencyMask(value ?? '')}
                    />
                    {errors.value && <TextError>{errors.value.message}</TextError>}
                  </View>
                )}
              />
              <Content>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <Select
                        onValueChange={onChange}
                        value={value ?? ''}
                        placeholder="Selecione uma categoria"
                        items={getCategories()}
                        errorMessage={errors.category?.message ?? ''}
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
                      value={value ?? ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name?.message ?? ''}
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
                        value={dataMask(value ?? '')}
                      />
                      {errors.date && <TextError>{errors.date.message}</TextError>}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name="time"
                  render={({ field: { onChange, onBlur, value } }) => {
                    return (
                      <>
                        <InputTime
                          placeholder="Hora"
                          name="clock"
                          onBlur={onBlur}
                          onChange={(newValue) => {
                            onChange(newValue ?? '');
                          }}
                          value={value ?? ''}
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
                      value={!!value}
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
                            value={value ?? ''}
                            placeholder="Tipo de repetição"
                            items={[
                              { label: 'Parcelado', value: 'finite' },
                              { label: 'Recorrente', value: 'infinite' },
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
                            value={String(value ?? '')}
                            onChangeText={(text) => {
                              const numValue = parseInt(text.replace(/\D/g, ''));
                              onChange(numValue || '');
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
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      onValueChange={onChange}
                      title="Adicionar notificação"
                      value={!!value}
                    />
                  )}
                />
                {notifications && (
                  <>
                    <Controller
                      control={control}
                      name="notificationDate"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          <Select
                            onValueChange={onChange}
                            value={value ?? ''}
                            placeholder="Quando notificar?"
                            items={[
                              { label: 'No dia', value: 'no dia' },
                              { label: 'Um dia antes', value: 'um dia antes' },
                              { label: 'Tres dias antes', value: 'tres dias antes' },
                              { label: 'Cinco dias antes', value: 'cinco dias antes' },
                            ]}
                          />
                        </View>
                      )}
                    />
                    <Controller
                      control={control}
                      name="notificationHour"
                      render={({ field: { onChange, value } }) => (
                        <View>
                          <Select
                            onValueChange={onChange}
                            value={value ?? ''}
                            placeholder="Horário da notificação"
                            items={[
                              { label: '07:00', value: '07:00' },
                              { label: '08:00', value: '08:00' },
                              { label: '09:00', value: '09:00' },
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
                        value={!!value}
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
                        value={value ?? ''}
                      />
                      {errors.description && <TextError>{errors.description.message}</TextError>}
                    </>
                  )}
                />
                {isCreator && (
                  <FormProvider {...form}>
                    <ShareWithUsers />
                  </FormProvider>
                )}
              </Content>
              <Button title="Salvar" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            </Container>

          </ScrollContent>
        </TouchableWithoutFeedback>
      </KeyboardAvoiding>
    </DefaultContainer>
  );
}
