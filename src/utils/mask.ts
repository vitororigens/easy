import { mask, unMask } from "remask";

// Máscaras para números de telefone com ou sem 9 dígitos
export const phoneMask = ["(99) 9999-9999", "(99) 99999-9999"];

// Aplicar máscara de telefone
export function applyPhoneMask(value: string): string {
  return mask(value, phoneMask);
}

// Remover máscara de telefone
export function phoneUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de moeda (BRL)
export function currencyMask(value: string): string {
  // Remove tudo que não for número
  let numericValue = value.replace(/\D/g, "");
  
  // Se não tiver valor, retorna vazio
  if (numericValue === "") return "";
  
  // Converte para número e divide por 100 para ter os centavos
  const number = Number(numericValue) / 100;
  
  // Formata o número para o padrão brasileiro
  return number.toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Remover máscara de moeda e retornar número
export function currencyUnMask(value: string): number {
  if (!value) return 0;
  
  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, "");
  
  // Converte para número e divide por 100
  return Number(numericValue) / 100;
}

// Formatar valor para exibição em BRL
export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "R$ 0,00";
  
  // Se for string, converte para número
  const numericValue = typeof value === "string" ? currencyUnMask(value) : value;
  
  if (isNaN(numericValue)) return "R$ 0,00";
  
  // Formata o número para o padrão brasileiro com símbolo da moeda
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Aplicar máscara de CEP
export function cepMask(value: string): string {
  return mask(value, ["99999-999"]);
}

// Remover máscara de CEP
export function cepUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de CPF
export function cpfMask(value: string): string {
  return mask(value, ["999.999.999-99"]);
}

// Remover máscara de CPF
export function cpfUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de celular
export function celularMask(value: string): string {
  return mask(value, ["(99) 9999-9999", "(99) 99999-9999"]);
}

// Remover máscara de celular
export function celularUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de hora
export function horaMask(value: string): string {
  return mask(value, ["99:99"]);
}

// Remover máscara de hora
export function horaUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de data
export function dataMask(value: string): string {
  return mask(value, ["99/99/9999"]);
}

// Remover máscara de data
export function dataUnMask(value: string): string {
  return unMask(value);
}

// Aplicar máscara de CNPJ
export function cnpjMask(value: string): string {
  return mask(value, ["99.999.999/9999-99"]);
}

// Remover máscara de CNPJ
export function cnpjUnMask(value: string): string {
  return unMask(value);
}
