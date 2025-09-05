export const EXCHANGES = {
  VEST: { id: 'vest', name: 'Vest', displayName: 'Vest' },
  EXTENDED: { id: 'extended', name: 'Extended', displayName: 'Extended' },
  HYPERLIQUID: { id: 'hyperliquid', name: 'Hyperliquid', displayName: 'Hyperliquid' },
  ORDERLY: { id: 'orderly', name: 'Orderly', displayName: 'Orderly' },
} as const;

export const TIMEFRAMES = {
  '1H': { id: '1h', label: '1h', duration: 3600000 },
  '8H': { id: '8h', label: '8h', duration: 28800000 },
  '1D': { id: '1d', label: '1d', duration: 86400000 },
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  OPPORTUNITIES: '/api/exchanges/opportunities',
  POSITIONS: '/api/positions',
  EXCHANGES: '/api/exchanges',
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  SUBSCRIBE_POSITIONS: 'subscribe-positions',
  SUBSCRIBE_OPPORTUNITIES: 'subscribe-opportunities',
  FUNDING_RATES_UPDATE: 'funding-rates-update',
  POSITION_PNL_UPDATE: 'position-pnl-update',
  OPPORTUNITY_ALERT: 'opportunity-alert',
  POSITION_CLOSED: 'position-closed',
} as const;

export const COLORS = {
  profit: '#00D9FF',
  loss: '#FF6B6B',
  neutral: '#8B949E',
  background: '#0D1117',
  cardBackground: '#161B22',
} as const;