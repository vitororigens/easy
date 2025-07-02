import React, { useState, useRef } from "react";
import { View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/mask";
import {
  Container,
  Content,
  MainContent,
  Row,
  Title,
  Description,
  Value,
  DateText,
  Status,
  Actions,
  ActionButton,
  ShareBadge,
  ShareIcon,
  ShareText,
  PopoverContainer,
  PopoverItem,
  PopoverItemText,
  PopoverDivider,
} from "./styles";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import Popover from "react-native-popover-view";

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
  onToggleStatus?: () => void;
  isShared?: boolean;
  isSharedByMe?: boolean;
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
  onToggleStatus,
  isShared = false,
  isSharedByMe = false,
}: ItemsProps) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const popoverRef = useRef(null);

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

  const handleEdit = () => {
    setIsPopoverVisible(false);
    onEdit && onEdit();
  };

  const handleDelete = () => {
    setIsPopoverVisible(false);
    onDelete && onDelete();
  };

  const handleToggleStatus = () => {
    setIsPopoverVisible(false);
    onToggleStatus && onToggleStatus();
  };

  return (
    <Container type={type}>
      <Content>
        <MainContent>
          <Row>
            <Title type={type} status={type === "SECONDARY" ? expenseStatus : undefined}>{category}</Title>
            {isShared && (
              <ShareBadge>
                <ShareIcon name={isSharedByMe ? "share" : "share-variant"} />
              </ShareBadge>
            )}
          </Row>
          <Description>{description}</Description>
          <DateText>{formattedDate}</DateText>
          {isShared && (
            <ShareText>
              {isSharedByMe ? "Compartilhado por você" : "Compartilhado com você"}
            </ShareText>
          )}
          {type === "SECONDARY" && (
            <Status status={expenseStatus}>
              {expenseStatus === "PAID" && "Pago"}
              {expenseStatus === "PENDING" && "Pendente"}
              {expenseStatus === "OVERDUE" && "Vencido"}
              {repeat && " • Recorrente"}
            </Status>
          )}
        </MainContent>
        <Actions>
          <Value color={formattedValue.color}>{formattedValue.formatted}</Value>
          <View>
            <Popover
              ref={popoverRef}
              isVisible={isPopoverVisible}
              onRequestClose={() => setIsPopoverVisible(false)}
              popoverStyle={{ borderRadius: 8 }}
              from={
                <ActionButton onPress={() => setIsPopoverVisible(true)}>
                  <MaterialIcons name="more-vert" size={24} color="#7201b5" />
                </ActionButton>
              }
            >
              <PopoverContainer>
                {onToggleStatus && (
                  <PopoverItem onPress={handleToggleStatus}>
                    <MaterialIcons 
                      name={status ? "check-circle-outline" : "radio-button-unchecked"} 
                      size={20} 
                      color={status ? "#16a34a" : "#a7a9ac"} 
                    />
                    <PopoverItemText>
                      {status ? "Marcar como não pago" : "Marcar como pago"}
                    </PopoverItemText>
                  </PopoverItem>
                )}
                
                {onEdit && (
                  <>
                    {onToggleStatus && <PopoverDivider />}
                    <PopoverItem onPress={handleEdit}>
                      <MaterialIcons name="edit" size={20} color="#a7a9ac" />
                      <PopoverItemText>Editar</PopoverItemText>
                    </PopoverItem>
                  </>
                )}
                
                {onDelete && (
                  <>
                    {(onEdit || onToggleStatus) && <PopoverDivider />}
                    <PopoverItem onPress={handleDelete}>
                      <MaterialIcons name="delete-outline" size={20} color="#b91c1c" />
                      <PopoverItemText>Excluir</PopoverItemText>
                    </PopoverItem>
                  </>
                )}
              </PopoverContainer>
            </Popover>
          </View>
        </Actions>
      </Content>
    </Container>
  );
}
