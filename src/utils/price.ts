export function formatPrice(value: number) {
  if (isNaN(value)) {
    return 'Valor inválido';
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return formatter.format(value);
}
