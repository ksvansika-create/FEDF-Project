export const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€' };
export const CURRENCY_RATES = { INR: 1, USD: 0.012, EUR: 0.011 };

export function formatCurrency(amount, currency = 'INR', language = 'EN') {
  const rate = CURRENCY_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const converted = Math.round(amount * rate);
  
  return `${symbol}${converted.toLocaleString(language === 'EN' ? 'en-US' : 'de-DE')}`;
}
