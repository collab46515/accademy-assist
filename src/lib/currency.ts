// Currency formatting utility
export const formatCurrency = (amount: number | string, currency: string = 'INR'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return currency === 'INR' ? '₹0.00' : '₹0.00';
  }

  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CNY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'NGN': '₦',
    'ZAR': 'R',
    'KES': 'KSh',
    'GHS': '₵'
  };

  const symbol = currencySymbols[currency] || '₹';
  
  return `${symbol}${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const getCurrencySymbol = (currency: string = 'INR'): string => {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€', 
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CNY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'NGN': '₦',
    'ZAR': 'R',
    'KES': 'KSh',
    'GHS': '₵'
  };
  
  return currencySymbols[currency] || '₹';
};

// Get currency from user preferences or default to INR
export const getUserCurrency = (): string => {
  // You can later integrate this with user settings/preferences
  return 'INR'; // Default to INR (Indian Rupees)
};