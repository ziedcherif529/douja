import { useMemo } from 'react';

export const useInvoiceCalculations = (items = []) => {
  const calculations = useMemo(() => {
    const total = items.reduce((sum, item) => sum + (item.line_total || 0), 0);

    return {
      subtotal: Number(total.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [items]);

  return calculations;
};