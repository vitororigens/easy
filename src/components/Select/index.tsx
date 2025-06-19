import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { Container, SelectWrapper, ErrorText, IconInput } from "./styles";
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
  return (
    <Container>
      <SelectWrapper error={!!errorMessage} disabled={disabled}>
        {showIcon && name && <IconInput name={name} />}
        
        <RNPickerSelect
          onValueChange={(value) => onValueChange?.(value)}
          value={value}
          items={items}
          disabled={disabled}
          placeholder={{ label: placeholder, value: null }}
          style={{
            inputIOS: {
              flex: 1,
              minHeight: 60,
              maxHeight: 60,
              color: '#4B5563', // GRAY_600
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              padding: 15,
              backgroundColor: 'transparent',
            },
            inputAndroid: {
              flex: 1,
              minHeight: 60,
              maxHeight: 60,
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
              top: 15,
              right: 15,
            },
          }}
          Icon={() => (
            <FontAwesome5 
              name="chevron-down" 
              size={16} 
              color="#9CA3AF" 
              style={{ marginTop: 2 }}
            />
          )}
        />
      </SelectWrapper>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
} 