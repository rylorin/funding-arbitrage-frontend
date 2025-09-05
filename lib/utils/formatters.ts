export const formatPercentage = (value: number, decimals: number = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatAPR = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getColorForValue = (value: number): string => {
  if (value > 0) return 'text-profit-400';
  if (value < 0) return 'text-loss-400';
  return 'text-neutral-400';
};

export const getFundingRateClass = (value: number): string => {
  if (value > 0) return 'funding-rate-positive';
  if (value < 0) return 'funding-rate-negative';
  return 'funding-rate-neutral';
};