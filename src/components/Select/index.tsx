import React, { useRef, useState } from "react";
import {Picker} from '@react-native-picker/picker';
import { Platform } from "react-native";
import { Container, SelectWrapper, ErrorText, IconInput, ChevronIcon } from "./styles";
import { FontAwesome5 } from '@expo/vector-icons';

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = {
  placeholder: string;
  onValueChange?: (value: string | number) => void;
  value?: string | number;
  items: SelectOption[];
  name?: string;
  showIcon?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

/**
 * Componente Select similar ao Input, mas para seleção de opções
 * 
 * @example
 * ```tsx
 * const categories = [
 *   { label: "Salário", value: "salario" },
 *   { label: "Vendas", value: "vendas" },
 *   { label: "Outros", value: "outros" }
 * ];
 * 
 * <Select
 *   placeholder="Selecione uma categoria"
 *   items={categories}
 *   value={selectedCategory}
 *   onValueChange={setSelectedCategory}
 *   errorMessage={errors.category?.message}
 * />
 * ```
 */
export function Select({
  placeholder,
  onValueChange,
  value,
  items,
  name,
  showIcon = false,
  errorMessage,
  disabled = false,
}: SelectProps) {
  const pickerRef = useRef<any>(null);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);

  const handleValueChange = (itemValue: string | number) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
  };

  const handlePress = () => {
    if (!disabled && pickerRef.current && Platform.OS === 'android') {
      pickerRef.current.focus();
    }
  };

  // For Android, render the picker normally without custom press handling
  if (Platform.OS === 'android') {
    return (
      <Container onPress={handlePress} disabled={disabled}>
        <SelectWrapper error={!!errorMessage} disabled={disabled}>
          {showIcon && name && <IconInput name={name} />}
          
          <Picker
            ref={pickerRef}
            selectedValue={selectedValue}
            onValueChange={handleValueChange}
            enabled={!disabled}
            mode="dropdown"
            style={{
              flex: 1,
              color: '#4B5563', // GRAY_600
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              backgroundColor: 'transparent',
            }}
            dropdownIconColor="#9CA3AF"
          >
            <Picker.Item 
              label={placeholder} 
              value={undefined} 
              color="#9CA3AF"
            />
            {items.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.label}
                value={item.value}
                color="#4B5563"
              />
            ))}
          </Picker>
        </SelectWrapper>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </Container>
    );
  }

  // For iOS, keep the custom press handling
  return (
    <Container onPress={handlePress} disabled={disabled}>
      <SelectWrapper error={!!errorMessage} disabled={disabled}>
        {showIcon && name && <IconInput name={name} />}
        
        <Picker
          ref={pickerRef}
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          enabled={!disabled}
          style={{
            flex: 1,
            color: '#4B5563', // GRAY_600
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            backgroundColor: 'transparent',
          }}
          itemStyle={{
            color: '#4B5563',
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
          }}
        >
          <Picker.Item 
            label={placeholder} 
            value={undefined} 
            color="#9CA3AF"
          />
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color="#4B5563"
            />
          ))}
        </Picker>
      </SelectWrapper>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
} 