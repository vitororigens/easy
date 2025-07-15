import React from "react";
//
import { ContainerMonth, Label } from "./styles";
//
import { DefaultContainer } from "../../components/DefaultContainer";
//
import RNPickerSelect from "react-native-picker-select";
import { useMonth } from "../../context/MonthProvider";
//

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

const currentDate = new Date();

const currentMonth = currentDate.getMonth() + 1;

export function Filter() {
  // State
  const { selectedMonth, setSelectedMonth } = useMonth();

  // Funcs
  const selectedCurrentDate = months.find(
    (month) => month.id === currentDate.getMonth() + 1
  )?.name;

  return (
    <>
      <DefaultContainer
        title="Filtrar"
        backButton
      >
        <ContainerMonth
          style={{
            height: 60,
            justifyContent: "center",
          }}
        >
          <Label>Mês</Label>
          <RNPickerSelect
            value={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
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
              }
            }}
          />
        </ContainerMonth>
      </DefaultContainer>
    </>
  );
}
