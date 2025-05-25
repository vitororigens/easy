import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
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
} from './styles';

export function NewEvent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItemId, isCreator } = route.params as { selectedItemId?: string; isCreator: boolean };
  const user = useUserAuth();
  const { sendNotification } = useSendNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedItemId) {
      loadEvent();
    }
  }, [selectedItemId]);

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

  const handleSave = async () => {
    if (!user?.uid) return;
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
          userId: user.uid,
          createdAt: Timestamp.now(),
        } as ICalendarEvent);

        // Send notification using useSendNotifications hook
        await sendNotification({
          title: 'Novo evento criado',
          message: `Novo evento: ${title}`,
          subscriptionsIds: [user.uid],
          date: date.toLocaleDateString(),
          hour: time.toLocaleTimeString().slice(0, 5),
        });
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
            <DateTimeValue>{date.toLocaleDateString()}</DateTimeValue>
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
            <DateTimeValue>{time.toLocaleTimeString().slice(0, 5)}</DateTimeValue>
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

        <Button
          title={selectedItemId ? 'Salvar' : 'Criar'}
          onPress={handleSave}
          isLoading={isLoading}
        />
      </Content>
    </DefaultContainer>
  );
} 