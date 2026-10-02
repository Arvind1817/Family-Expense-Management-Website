import { CurrencySymbol } from '../types';

export const formatCurrency = (amount: number, symbol: CurrencySymbol = '$'): string => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (amount < 0) {
    return `-${symbol}${formatted}`;
  }
  return `${symbol}${formatted}`;
};

export const formatSignedCurrency = (amount: number, isIncome: boolean = false, symbol: CurrencySymbol = '$'): string => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isIncome || amount > 0) {
    return `+${symbol}${formatted}`;
  }
  return `-${symbol}${formatted}`;
};
