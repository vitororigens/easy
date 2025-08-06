import React, { useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Platform, Modal, FlatList } from 'react-native';
import { Container, SelectWrapper, ErrorText, IconInput, ChevronIcon, Option, OptionLabel, ModalOverlay, ModalContent, ModalTitle, CancelButton, CancelButtonText, Label, PickerStyled } from './styles';
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
 *   { label: 'Salário', value: 'salario' },
 *   { label: 'Vendas', value: 'vendas' },
 *   { label: 'Outros', value: 'outros' }
 * ];
 *
 * <Select
 *   placeholder='Selecione uma categoria'
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
  const pickerRef = useRef<Picker<unknown> | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value);
  const [modalVisible, setModalVisible] = useState(false);

  const handleValueChange = (itemValue: unknown, _itemIndex: number) => {
    const castValue = itemValue as string | number;
    setSelectedValue(castValue);
    onValueChange?.(castValue);
  };

  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS === 'android' && pickerRef.current) {
        pickerRef.current.focus();
      } else if (Platform.OS === 'ios') {
        setModalVisible(true);
      }
    }
  };

  const getSelectedLabel = () => {
    if (!selectedValue) return placeholder;
    const selectedItem = items.find(item => item.value === selectedValue);
    return selectedItem ? selectedItem.label : placeholder;
  };

  // For Android, render the picker normally without custom press handling
  if (Platform.OS === 'android') {
    return (
      <Container onPress={handlePress} disabled={disabled}>
        <SelectWrapper error={!!errorMessage} disabled={disabled}>
          {showIcon && name && <IconInput name={name} />}
          <PickerStyled
            ref={pickerRef}
            selectedValue={selectedValue ?? ''}
            onValueChange={handleValueChange}
            enabled={!disabled}
            mode='dropdown'
            dropdownIconColor={'#9CA3AF'}
          >
            <Picker.Item
              label={placeholder}
              value={undefined}
              color={'#9CA3AF'}
            />
            {items.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.label}
                value={item.value}
                color={'#4B5563'}
              />
            ))}
          </PickerStyled>
        </SelectWrapper>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </Container>
    );
  }

  // For iOS, use custom modal
  return (
    <>
      <Container onPress={handlePress} disabled={disabled}>
        <SelectWrapper error={!!errorMessage} disabled={disabled}>
          {showIcon && name && <IconInput name={name} />}
          <Label selected={!!selectedValue}>{getSelectedLabel()}</Label>
          <ChevronIcon name='chevron-down' size={16} color={'#9CA3AF'} />
        </SelectWrapper>
      </Container>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>{placeholder}</ModalTitle>
            <FlatList
              data={items}
              keyExtractor={item => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = selectedValue === item.value;
                return (
                  <Option isSelected={isSelected} onPress={() => {
                    handleValueChange(item.value, 0); // Pass a dummy index for iOS modal
                    setModalVisible(false);
                  }}>
                    <OptionLabel isSelected={isSelected}>{item.label}</OptionLabel>
                    {isSelected && (
                      <FontAwesome5 name='check' size={16} color={'#8B5CF6'} />
                    )}
                  </Option>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
            <CancelButton onPress={() => setModalVisible(false)}>
              <CancelButtonText>Cancelar</CancelButtonText>
            </CancelButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
}
