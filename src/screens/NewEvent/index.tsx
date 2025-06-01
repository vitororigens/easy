import React, { useEffect, useState } from 'react';
import { Alert, Platform, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DefaultContainer } from '../../components/DefaultContainer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useUserAuth } from '../../hooks/useUserAuth';
import useSendNotifications from '../../hooks/useSendNotifications';
import { ICalendarEvent, createEvent, findEventById, updateEvent } from '../../services/firebase/calendar.firebase';
import { Timestamp } from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import {OneSignal} from 'react-native-onesignal';
import {
  Container,
  Content,
  Title,
  Description,
  DateTimeContainer,
  DateTimeLabel,
  DateTimeValue,
  DateTimePickerButton,
  NotificationContainer,
  NotificationLabel,
} from './styles';
import { horaMask } from '../../utils/mask';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

export function NewEvent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItemId, isCreator } = route.params as { selectedItemId?: string; isCreator: boolean };
  const user = useUserAuth();
  const { sendNotification, subscriptionId } = useSendNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [subscriberIds, setSubscriberIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedItemId) {
      loadEvent();
    }
  }, [selectedItemId]);

  useEffect(() => {
    const loadSubscriberIds = async () => {
      if (!user.user?.uid) {
        console.log('Usuário não está autenticado');
        return;
      }
      
      try {
        const db = getFirestore();
        const userRef = doc(db, "User", user.user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log('Dados do usuário:', userData);
          
          if (userData?.subscribers && userData.subscribers.length > 0) {
            console.log('Subscribers encontrados:', userData.subscribers);
            setSubscriberIds(userData.subscribers);
          } else if (subscriptionId) {
            console.log('Usando subscriptionId direto:', subscriptionId);
            setSubscriberIds([subscriptionId]);
          } else {
            console.log('Nenhum subscriber encontrado');
            setSubscriberIds([]);
          }
        } else {
          console.log('Documento do usuário não existe');
          if (subscriptionId) {
            console.log('Usando subscriptionId direto:', subscriptionId);
            setSubscriberIds([subscriptionId]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar subscriberIds:", error);
      }
    };

    loadSubscriberIds();
  }, [user.user?.uid, subscriptionId]);

  const loadEvent = async () => {
    if (!selectedItemId) return;
    try {
      const event = await findEventById(selectedItemId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description);
        setDate(new Date(event.date));
        setTime(new Date(`2000-01-01T${event.time}`));
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      Alert.alert('Erro', 'Não foi possível carregar o evento');
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date) => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSave = async () => {
    if (!user.user?.uid) return;
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título do evento');
      return;
    }

    try {
      setIsLoading(true);
      const eventData: Partial<ICalendarEvent> = {
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString().split('T')[0],
        time: time.toTimeString().split(' ')[0].slice(0, 5),
      };

      if (selectedItemId) {
        await updateEvent(selectedItemId, eventData);
      } else {
        await createEvent({
          ...eventData,
          userId: user.user?.uid,
          createdAt: Timestamp.now(),
        } as ICalendarEvent);

        if (notificationsEnabled && subscriberIds.length > 0) {
          console.log('Enviando notificação com os seguintes dados:');
          console.log('Título:', title);
          console.log('SubscriberIds:', subscriberIds);
          console.log('Data:', formatDate(date));
          console.log('Hora:', formatTime(time));

          await sendNotification({
            title: title,
            message: "Você tem um novo evento agendado!",
            subscriptionsIds: subscriberIds,
            date: formatDate(date),
            hour: formatTime(time),
          });
          console.log('Notificação enviada com sucesso');
        } else {
          console.log('Notificação não enviada. Motivos:');
          console.log('NotificationsEnabled:', notificationsEnabled);
          console.log('SubscriberIds length:', subscriberIds.length);
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o evento');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <DefaultContainer title={selectedItemId ? 'Editar Evento' : 'Novo Evento'} backButton addButton>
      <Content>
        <Input
          name='title'
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o título do evento"
        />

        <Input
          name="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Digite a descrição do evento"
          multiline
          numberOfLines={4}
        />

        <DateTimeContainer>
          <DateTimeLabel>Data</DateTimeLabel>
          <DateTimePickerButton onPress={() => setShowDatePicker(true)}>
            <DateTimeValue>{formatDate(date)}</DateTimeValue>
          </DateTimePickerButton>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </DateTimeContainer>

        <DateTimeContainer>
          <DateTimeLabel>Hora</DateTimeLabel>
          <DateTimePickerButton onPress={() => setShowTimePicker(true)}>
            <DateTimeValue>
              {formatTime(time)}
            </DateTimeValue>
          </DateTimePickerButton>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </DateTimeContainer>

        <NotificationContainer>
          <NotificationLabel>Enviar notificação</NotificationLabel>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </NotificationContainer>

        {isCreator && (
          <FormProvider {...form}>
            <ShareWithUsers />
          </FormProvider>
        )}

        <Button
          title={selectedItemId ? 'Salvar' : 'Criar'}
          onPress={handleSave}
          isLoading={isLoading}
        />
      </Content>
    </DefaultContainer>
  );
}