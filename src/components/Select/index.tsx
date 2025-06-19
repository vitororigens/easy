import React, { useRef } from "react";
import RNPickerSelect from "react-native-picker-select";
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

  const handlePress = () => {
    if (!disabled && pickerRef.current) {
      pickerRef.current.togglePicker();
    }
  };

  return (
    <Container onPress={handlePress} disabled={disabled}>
      <SelectWrapper error={!!errorMessage} disabled={disabled}>
        {showIcon && name && <IconInput name={name} />}
        
        <RNPickerSelect
          ref={pickerRef}
          onValueChange={(value) => onValueChange?.(value)}
          value={value}
          items={items}
          disabled={disabled}
          placeholder={{ label: placeholder, value: null }}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              flex: 1,
              color: '#4B5563', // GRAY_600
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              padding: 15,
              backgroundColor: 'transparent',
            },
            inputAndroid: {
              flex: 1,
              color: '#4B5563', // GRAY_600
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              padding: 15,
              backgroundColor: 'transparent',
            },
            placeholder: {
              color: '#9CA3AF', // GRAY_400
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
            },
            iconContainer: {
              display: 'none', // Hide the default icon
            },
          }}
        />
      </SelectWrapper>
      <ChevronIcon 
        name="chevron-down" 
        size={16} 
        color="#9CA3AF"
      />
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
} 