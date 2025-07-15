import React, { useRef, useState } from "react";
import {Picker} from '@react-native-picker/picker';
import { Platform, Modal, TouchableOpacity, FlatList, View, Text } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);

  const handleValueChange = (itemValue: string | number) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
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
          
          <Picker
            ref={pickerRef}
            selectedValue={selectedValue ?? ''}
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

  // For iOS, use custom modal
  return (
    <>
      <Container onPress={handlePress} disabled={disabled}>
        <SelectWrapper error={!!errorMessage} disabled={disabled}>
          {showIcon && name && <IconInput name={name} />}
          
          <Text style={{
            flex: 1,
            color: selectedValue ? '#4B5563' : '#9CA3AF',
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            paddingLeft: 0,
            paddingRight: 0,
          }}>
            {getSelectedLabel()}
          </Text>
          
          <ChevronIcon name="chevron-down" size={16} color="#9CA3AF" />
        </SelectWrapper>
      </Container>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '85%',
            maxHeight: '70%',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
              color: '#1F2937',
            }}>
              {placeholder}
            </Text>
            
            <FlatList
              data={items}
              keyExtractor={( index) => index.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedValue === item.value;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handleValueChange(item.value);
                      setModalVisible(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? '#8B5CF6' : '#E5E7EB',
                      backgroundColor: isSelected ? '#F3F4F6' : '#fff',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: isSelected ? '#8B5CF6' : '#4B5563',
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <FontAwesome5 name="check" size={16} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: '#6B7280',
                fontSize: 16,
                fontWeight: '500',
              }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
} 