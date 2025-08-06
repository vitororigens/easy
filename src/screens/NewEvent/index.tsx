import React, { useEffect, useState } from 'react';
import { Alert, Switch, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useUserAuth } from '../../hooks/useUserAuth';
import useSendNotifications from '../../hooks/useSendNotifications';
import { ICalendarEvent, createEvent, findEventById, updateEvent } from '../../services/firebase/calendar.firebase';
import { Timestamp } from '@react-native-firebase/firestore';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ShareWithUsers } from '../../components/ShareWithUsers';
import { createSharing, getSharing, ESharingStatus } from '../../services/firebase/sharing.firebase';
import { createNotification } from '../../services/firebase/notifications.firebase';
import { z } from 'zod';
import {
  NotificationContainer,
  NotificationLabel,
} from './styles';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { InputDate, InputTime } from '@/components';
import { dataMask } from '../../utils/mask';

const formSchema = z.object({
  name: z.string().min(1, 'Nome do evento é obrigatório'),
  formattedDate: z.string().min(1, 'Data é obrigatória'),
  description: z.string().optional(),
  sharedUsers: z.array(
    z.object({
      uid: z.string(),
      userName: z.string(),
      acceptedAt: z.union([z.null(), z.instanceof(Timestamp)]),
    }),
  ),
  time: z.string().default(''),
});

type FormSchemaType = z.infer<typeof formSchema>;

// Extrair o objeto de estilo do styled-component para usar no contentContainerStyle
const scrollContentStyle = {
  flexGrow: 1,
  padding: 16,
  borderTopLeftRadius: 40,
  borderTopRightRadius: 40,
};

export function NewEvent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItemId, isCreator } = route.params as { selectedItemId?: string; isCreator: boolean };
  const user = useUserAuth();
  const { sendNotification, subscriptionId } = useSendNotifications();
  const form = useForm<FormSchemaType>({
    defaultValues: {
      name: '',
      formattedDate: new Date().toLocaleDateString('pt-BR'),
      description: '',
      sharedUsers: [],
    },
  });
  const { control, handleSubmit, setValue } = form;

  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [subscriberIds, setSubscriberIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedItemId) {
      loadEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId]);

  useEffect(() => {
    const loadSubscriberIds = async () => {
      if (!user.user?.uid) {
        // eslint-disable-next-line no-console
        console.log('Usuário não está autenticado');
        return;
      }
      try {
        const db = getFirestore();
        const userRef = doc(db, 'User', user.user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // eslint-disable-next-line no-console
          console.log('Dados do usuário:', userData);
          if (userData?.['subscribers'] && userData['subscribers'].length > 0) {
            // eslint-disable-next-line no-console
            console.log('Subscribers encontrados:', userData['subscribers']);
            setSubscriberIds(userData['subscribers']);
          } else if (subscriptionId) {
            // eslint-disable-next-line no-console
            console.log('Usando subscriptionId direto:', subscriptionId);
            setSubscriberIds([subscriptionId]);
          } else {
            // eslint-disable-next-line no-console
            console.log('Nenhum subscriber encontrado');
            setSubscriberIds([]);
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('Documento do usuário não existe');
          if (subscriptionId) {
            // eslint-disable-next-line no-console
            console.log('Usando subscriptionId direto:', subscriptionId);
            setSubscriberIds([subscriptionId]);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar subscriberIds:', error);
      }
    };
    loadSubscriberIds();
  }, [user.user?.uid, subscriptionId]);

  const loadEvent = async () => {
    if (!selectedItemId) return;
    try {
      const event = await findEventById(selectedItemId);
      // eslint-disable-next-line no-console
      console.log('Evento encontrado:', event);
      if (event) {
        setValue('name', event.title);
        setValue('description', event.description);
        setValue('formattedDate', new Date(event.date).toLocaleDateString('pt-BR'));
        setValue('sharedUsers', event.sharedWith?.map((uid) => ({ uid, userName: uid, acceptedAt: null })) || []);
        setValue('time', event.time ? String(event.time) : '');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar evento:', error);
      Alert.alert('Erro', 'Não foi possível carregar o evento');
    }
  };

  const onSubmit = async (formData: FormSchemaType & { time?: string }) => {
    if (!user.user?.uid) return;
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título do evento');
      return;
    }
    try {
      setIsLoading(true);
      const sharedUsers = formData.sharedUsers || [];
      const dateObj = formData.formattedDate
        ? (() => { const [d, m, y] = formData.formattedDate.split('/'); return new Date(`${y}-${m}-${d}`); })() : new Date();
      const eventData: Partial<ICalendarEvent> = {
        title: formData.name.trim(),
        description: formData.description?.trim() || '',
        date: dateObj.toISOString().split('T')[0] ?? '',
        time: String(formData.time ?? ''),
        sharedWith: sharedUsers.map((user: { uid: string }) => user.uid),
      };
      let createdEvent;
      if (selectedItemId) {
        await updateEvent(selectedItemId, eventData);
      } else {
        createdEvent = await createEvent({
          ...eventData,
          userId: user.user?.uid,
          createdAt: Timestamp.now(),
        } as ICalendarEvent);
        if (notificationsEnabled && subscriberIds.length > 0) {
          await sendNotification({
            title: formData.name,
            message: 'Você tem um novo evento agendado!',
            subscriptionsIds: subscriberIds,
            date: formData.formattedDate,
            hour: formData.time || '',
          });
        }
        // Handle sharing
        if (sharedUsers.length > 0) {
          const usersInvitedByMe = await getSharing({
            profile: 'invitedBy',
            uid: user.user.uid,
          });
          for (const sharedUser of sharedUsers) {
            const alreadySharing = usersInvitedByMe.some(
              (u) => u.target === sharedUser.uid && u.status === ESharingStatus.ACCEPTED,
            );
            const possibleSharingRequestExists = usersInvitedByMe.some(
              (u) => u.target === sharedUser.uid,
            );
            const message = alreadySharing
              ? `${user.user?.displayName} compartilhou um evento com você`
              : `${user.user?.displayName} convidou você para compartilhar um evento`;
            await Promise.allSettled([
              createNotification({
                sender: user.user.uid,
                receiver: sharedUser.uid,
                status: alreadySharing ? 'sharing_accepted' : 'pending',
                type: 'sharing_invite',
                source: {
                  type: 'event',
                  id: createdEvent.id,
                },
                title: 'Compartilhamento de evento',
                description: message,
                createdAt: Timestamp.now(),
              }),
              ...(!alreadySharing && !possibleSharingRequestExists
                ? [
                  createSharing({
                    invitedBy: user.user.uid,
                    status: ESharingStatus.PENDING,
                    target: sharedUser.uid,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                  }),
                ]
                : []),
            ]);
          }
        }
      }
      Alert.alert('Sucesso', 'Evento salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultContainer title={selectedItemId ? 'Editar Evento' : 'Novo Evento'} backButton>
      <ScrollView
        contentContainerStyle={scrollContentStyle}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              name='title'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Digite o título do evento'
            />
          )}
        />
        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              name='Descrição'
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Digite a descrição do evento'
              multiline
              numberOfLines={4}
            />
          )}
        />
        <Controller
          control={control}
          name='formattedDate'
          render={({ field: { onChange, onBlur, value } }) => (
            <InputDate
              placeholder='Data'
              name='calendar'
              onBlur={onBlur}
              onChange={onChange}
              value={dataMask(value)}
            />
          )}
        />
        <Controller
          control={control}
          name='time'
          render={({ field: { onChange, onBlur, value } }) => (
            <InputTime
              name='time'
              value={typeof value === 'string' ? value : ''}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <NotificationContainer>
          <NotificationLabel>Enviar notificação</NotificationLabel>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </NotificationContainer>
        {isCreator && (
          <FormProvider {...form}>
            {/* @ts-expect-error: ShareWithUsers espera props extras */}
            <ShareWithUsers control={form.control} name='sharedUsers' />
          </FormProvider>
        )}
        <Button
          title={selectedItemId ? 'Salvar' : 'Criar'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </ScrollView>
    </DefaultContainer>
  );
}
