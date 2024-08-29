import React, { useState } from "react";
//
import {
  InputContainer,
  Label,
  FormContainer,
  TextField,
  ButtonBar,
  Title,
} from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
//
import RNPickerSelect from "react-native-picker-select";
import { useMonth } from "../../context/MonthProvider";
import { Text, View } from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyMask } from "../../utils/currency";
import { useNavigation, useRoute } from "@react-navigation/native";

export interface FilterProps {
  showMonthFilter?: boolean;
  showCategoryFilter?: boolean;
  showMinValueFilter?: boolean;
  showMaxValueFilter?: boolean;
}

// Vars
const months = [
  { id: 1, name: "Janeiro" },
  { id: 2, name: "Fevereiro" },
  { id: 3, name: "Março" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Maio" },
  { id: 6, name: "Junho" },
  { id: 7, name: "Julho" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Setembro" },
  { id: 10, name: "Outubro" },
  { id: 11, name: "Novembro" },
  { id: 12, name: "Dezembro" },
];

const categories = [
  { label: "Investimentos", value: "Investimentos" },
  { label: "Contas", value: "Contas" },
  { label: "Compras", value: "Compras" },
  { label: "Faculdade", value: "Faculdade" },
  { label: "Internet", value: "Internet" },
  { label: "Academia", value: "Academia" },
  { label: "Emprestimo", value: "Emprestimo" },
  { label: "Comida", value: "Comida" },
  { label: "Telefone", value: "Telefone" },
  {
    label: "Entretenimento",
    value: "Entretenimento",
  },
  { label: "Educação", value: "Educacao" },
  { label: "Beleza", value: "beleza" },
  { label: "Esporte", value: "esporte" },
  { label: "Social", value: "social" },
  { label: "Transporte", value: "transporte" },
  { label: "Roupas", value: "roupas" },
  { label: "Carro", value: "carro" },
  { label: "Bebida", value: "bebida" },
  { label: "Cigarro", value: "cigarro" },
  { label: "Eletrônicos", value: "eletronicos" },
  { label: "Viagem", value: "viagem" },
  { label: "Saúde", value: "saude" },
  { label: "Estimação", value: "estimacao" },
  { label: "Reparar", value: "reparar" },
  { label: "Moradia", value: "moradia" },
  { label: "Presente", value: "presente" },
  { label: "Doações", value: "doacoes" },
  { label: "Loteria", value: "loteria" },
  { label: "Lanches", value: "lanches" },
  { label: "Filhos", value: "filhos" },
  { label: "Outros", value: "outros" },
];

const currentDate = new Date();

const currentMonth = currentDate.getMonth() + 1;

// Schema
const filterSchema = z.object({
  month: z.number().min(1, "Este campo é obrigatório"),
  category: z.string().min(1, "Este campo é obrigatório"),
  minValue: z.string(),
  maxValue: z.string(),
});

type FilterType = z.infer<typeof filterSchema>;

export function Filter() {
  // State
  const { selectedMonth, setSelectedMonth } = useMonth();

  // Hooks
  const route = useRoute();

  const { showCategoryFilter, showMaxValueFilter, showMinValueFilter, showMonthFilter } = route.params as FilterProps;

  const navigation = useNavigation();

  const { control, watch, handleSubmit } = useForm<FilterType>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      month: selectedMonth ?? currentMonth,
      category: "outros",
      maxValue: "",
      minValue: "",
    },
  });

  const selectedCategory = watch("category");

  // Vars
  const initialCategory = categories.find(
    (item) => item.value === selectedCategory
  );

  // Funcs
  const selectedCurrentDate = months.find(
    (month) => month.id === currentDate.getMonth() + 1
  )?.name;

  const onSubmitFilter = (data: FilterType) => {
    setSelectedMonth(data.month);
    navigation.goBack();
    console.log(data);
  };

  return (
    <>
      <DefaultContainer hasHeader={false} title="Filtrar" backButton>
        <FormContainer>
          {showMonthFilter && (
            <Controller
              control={control}
              name="month"
              render={({ field: { value, onChange } }) => (
                <InputContainer
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Label>Mês</Label>
                  <RNPickerSelect
                    value={value}
                    onValueChange={onChange}
                    items={months.map((month) => ({
                      label: month.name,
                      value: month.id,
                    }))}
                    placeholder={{
                      label: `${selectedCurrentDate}`,
                      value: currentMonth,
                    }}
                    style={{
                      placeholder: {
                        color: "black",
                      },
                    }}
                  />
                </InputContainer>
              )}
            />
          )}

          {showCategoryFilter && (
            <Controller
              control={control}
              name="category"
              render={({ field: { value, onChange } }) => (
                <InputContainer>
                  <Label>Categoria</Label>
                  <RNPickerSelect
                    value={value}
                    onValueChange={(value) => onChange(value)}
                    items={categories.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    placeholder={{
                      label: initialCategory?.label,
                      value: initialCategory?.value,
                    }}
                    style={{
                      placeholder: {
                        color: "black",
                      },
                    }}
                  />
                </InputContainer>
              )}
            />
          )}
          {(showMaxValueFilter || showMinValueFilter) && (
              <View
                style={{
                  width: "80%",
                  marginHorizontal: "auto",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                {showMinValueFilter && (
                  <Controller
                    control={control}
                    name="minValue"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <InputContainer style={{ flex: 1 }}>
                        <Label>Valor mínimo</Label>
                        <TextField
                          value={value}
                          onChangeText={(value) =>
                            onChange(currencyMask(value))
                          }
                          onBlur={onBlur}
                        />
                      </InputContainer>
                    )}
                  />
                )}
                {showMaxValueFilter && (
                  <Controller
                    control={control}
                    name="maxValue"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <InputContainer style={{ flex: 1 }}>
                        <Label>Valor máximo</Label>
                        <TextField
                          value={value}
                          onChangeText={(value) =>
                            onChange(currencyMask(value))
                          }
                          onBlur={onBlur}
                        />
                      </InputContainer>
                    )}
                  />
                )}
              </View>
            )}

          <ButtonBar onPress={handleSubmit(onSubmitFilter)} style={{marginTop: -12}}>
            <Title>Aplicar Filtros</Title>
          </ButtonBar>
        </FormContainer>
      </DefaultContainer>
    </>
  );
}
