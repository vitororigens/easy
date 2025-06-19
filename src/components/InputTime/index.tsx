import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import { Input } from '../Input';
import { Platform } from 'react-native';

interface InputTimeProps {
  value: string;
  onChange: (time: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
}

const TimePickerContainer = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 5px;
`;

export function InputTime({ value, onChange, onBlur, placeholder = "Hora" }: InputTimeProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!value) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      onChange(formattedTime);
    }
  }, []);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === "set" && selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      onChange(formattedTime);
      setShowTimePicker(false);
    } else if (event.type === "dismissed") {
      setShowTimePicker(false);
    }
  };

  const handleInputFocus = () => {
    setShowTimePicker(true);
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
        name="clock"
        showIcon
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={onChange}
        value={value}
      />
      
      {showTimePicker && (
        <TimePickerContainer>
          <DateTimePicker
            value={value ? new Date(`2000-01-01T${value}`) : new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
            onChange={handleTimeChange}
          />
        </TimePickerContainer>
      )}
    </View>
  );
}