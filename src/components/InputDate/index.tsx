import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import styled from 'styled-components/native';
import { dataMask } from '../../utils/mask';
import { Input } from '../Input';


interface InputDateProps {
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
}

const CalendarContainer = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 5px;  
`;

export function InputDate({ value, onChange, onBlur, placeholder = "Data" }: InputDateProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!value) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('pt-BR');
      onChange(formattedDate);
    }
  }, []);

  const handleDateChange = (date: Date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('pt-BR');
      onChange(formattedDate);
      setShowCalendar(false);
    }
  };

  const handleInputFocus = () => {
    setShowCalendar(true);
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <Input
        placeholder={placeholder}
        type="TERTIARY"
        name="calendar"
        showIcon
       onFocus={() => setShowCalendar(true)}
        onBlur={handleInputBlur}
        onChangeText={onChange}
        value={dataMask(value)}
      />
      
      {showCalendar && (
        <CalendarContainer>
          <CalendarPicker
            width={300}
            initialDate={new Date()}
            onDateChange={handleDateChange}
            weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            previousTitle="Anterior"
            nextTitle="Próximo"
            selectedDayColor="#007AFF"
            selectedDayTextColor="#FFFFFF"
          />
        </CalendarContainer>
      )}
    </View>
  );
}