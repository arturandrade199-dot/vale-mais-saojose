export function formatDiscount(company) {
  const value = Number(company.discount_value);

  if (company.discount_type === "percentage") {
    const min = company.min_purchase_value
      ? ` em compras acima de R$ ${Number(company.min_purchase_value).toFixed(2).replace(".", ",")}`
      : "";
    return `${value}% de desconto${min}`;
  }

  if (company.discount_type === "fixed_per_liter") {
    return `R$ ${value.toFixed(2).replace(".", ",")} de desconto por litro`;
  }

  return `R$ ${value.toFixed(2).replace(".", ",")} de desconto`;
}
