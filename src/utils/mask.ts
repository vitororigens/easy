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
  const numericValue = unMask(value || "");
  return mask(numericValue, ['9,9', '99,99','999,99','9.999,99', '99.999,99', '999.999,99', '999.999.999,99', '999.999.999.999,99']);
}

// Remover máscara de moeda
export function currencyUnMask(value: string): string {
  const unmaskedValue = value.replace(/\D/g, ""); 
  return (parseFloat(unmaskedValue) / 100).toFixed(2); 
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
