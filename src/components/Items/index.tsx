import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/mask";
import {
  Container,
  Content,
  ContentInfo,
  Title,
  Description,
  Value,
  DateText,
  Status,
  Actions,
  ActionButton,
} from "./styles";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ItemsProps {
  type?: "PRIMARY" | "SECONDARY" | "TERTIARY";
  category: string;
  date: string;
  description?: string;
  repeat?: boolean;
  status?: boolean;
  valueTransaction: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function Items({
  type = "PRIMARY",
  category,
  date,
  description,
  repeat,
  status,
  valueTransaction,
  onEdit,
  onDelete,
}: ItemsProps) {
  const getExpenseStatus = () => {
    if (status === true) return "PAID";
    
    try {
      let expenseDate;
      
      // Verifica se a data está no formato DD/MM/YYYY
      if (date.includes('/')) {
        const [day, month, year] = date.split('/');
        expenseDate = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        expenseDate = parseISO(date);
      }
      
      // Verifica se a data é válida
      if (isNaN(expenseDate.getTime())) {
        return "PENDING";
      }
      
      const today = startOfDay(new Date());
      
      if (isBefore(expenseDate, today)) {
        return "OVERDUE";
      }
      return "PENDING";
    } catch (error) {
      console.warn("Data inválida:", date);
      return "PENDING";
    }
  };

  const expenseStatus = getExpenseStatus();
  const formattedValue = formatCurrency(valueTransaction, {
    showSymbol: true,
    showNegative: type === "SECONDARY",
    colorize: true,
  });

  const getFormattedDate = () => {
    try {
      // Verifica se a data está no formato DD/MM/YYYY
      if (date.includes('/')) {
        const [day, month, year] = date.split('/');
        const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        
        // Verifica se a data é válida
        if (isNaN(parsedDate.getTime())) {
          return "Data inválida";
        }
        
        return format(parsedDate, "dd 'de' MMMM',' yyyy", {
          locale: ptBR,
        });
      }
      
      // Tenta parsear como ISO se não estiver no formato DD/MM/YYYY
      const parsedDate = parseISO(date);
      
      // Verifica se a data é válida
      if (isNaN(parsedDate.getTime())) {
        return "Data inválida";
      }
      
      return format(parsedDate, "dd 'de' MMMM',' yyyy", {
        locale: ptBR,
      });
    } catch (error) {
      console.warn("Erro ao formatar data:", date);
      return "Data inválida";
    }
  };

  const formattedDate = getFormattedDate();

  return (
    <Container>
      <Content status={type === "SECONDARY" ? expenseStatus : undefined}>
        <ContentInfo>
          <Title type={type} status={type === "SECONDARY" ? expenseStatus : undefined}>{category}</Title>
          {description && <Description>{description}</Description>}
          <DateText>{formattedDate}</DateText>
          {type === "SECONDARY" && (
            <Status status={expenseStatus}>
              {expenseStatus === "PAID" && "Pago"}
              {expenseStatus === "PENDING" && "Pendente"}
              {expenseStatus === "OVERDUE" && "Vencido"}
              {repeat && " • Recorrente"}
            </Status>
          )}
        </ContentInfo>

        <Actions>
          <Value color={formattedValue.color}>{formattedValue.formatted}</Value>
          {onEdit && (
            <ActionButton onPress={onEdit}>
              <MaterialIcons name="edit" size={24} color="#a7a9ac" />
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton onPress={onDelete}>
              <MaterialIcons name="delete-outline" size={24} color="#b91c1c" />
            </ActionButton>
          )}
        </Actions>
      </Content>
    </Container>
  );
}
