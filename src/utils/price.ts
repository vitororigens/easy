export function formatPrice(cents: number) {
  if (isNaN(+cents)) {
    return "Valor inválido";
  }

  const price = parseFloat((cents * 0.01).toString());

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedPrice = formatter.format(price);

  return formattedPrice;
}