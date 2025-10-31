export const EXCHANGES = {
  VEST: { id: "vest", name: "Vest", displayName: "Vest" },
  EXTENDED: { id: "extended", name: "Extended", displayName: "Extended" },
  HYPERLIQUID: {
    id: "hyperliquid",
    name: "Hyperliquid",
    displayName: "Hyperliquid",
  },
  ORDERLY: { id: "orderly", name: "Orderly", displayName: "Orderly" },
} as const;

export const TIMEFRAMES = {
  "1H": { id: "1H", label: "1h", hours: 1, duration: 3600_000 },
  "4H": { id: "4H", label: "4h", hours: 4, duration: 14400_000 },
  "8H": { id: "8H", label: "8h", hours: 8, duration: 28800_000 },
  "1D": { id: "1D", label: "1d", hours: 24, duration: 86_400_000 },
  "1W": { id: "1W", label: "1w", hours: 24 * 7, duration: 86_400_000 * 7 },
  "1Y": { id: "1Y", label: "1y", hours: 24 * 365, duration: 86_400_000 * 365 },
} as const;
export type TimeframeKey = keyof typeof TIMEFRAMES;

export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  OPPORTUNITIES: "/api/exchanges/opportunities",
  POSITIONS: "/api/positions",
  EXCHANGES: "/api/exchanges",
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SUBSCRIBE_POSITIONS: "subscribe-positions",
  SUBSCRIBE_OPPORTUNITIES: "subscribe-opportunities",
  FUNDING_RATES_UPDATE: "funding-rates-update",
  POSITION_PNL_UPDATE: "position-pnl-update",
  OPPORTUNITY_ALERT: "opportunity-alert",
  POSITION_CLOSED: "position-closed",
} as const;

export const COLORS = {
  profit: "#00D9FF",
  loss: "#FF6B6B",
  neutral: "#8B949E",
  background: "#0D1117",
  cardBackground: "#161B22",
} as const;
