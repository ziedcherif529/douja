export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00 TND';
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};