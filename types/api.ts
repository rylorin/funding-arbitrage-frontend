// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Dashboard Data Types
export interface DashboardData {
  totalOpportunities: number;
  bestAPR: number;
  averageFundingRate: number;
  opportunities: OpportunityData[];
  fundingRates: FundingRateData[];
  lastUpdate: string;
}

export interface FundingRateData {
  id: string;
  token: string;
  pair: string;
  exchange: string;
  rate: number;
  timestamp: string;
  isActive: boolean;
  volume24h?: number;
}

export interface ExchangeData {
  name: string;
  color: string;
  fundingRate: number;
  price: number;
}

export interface OpportunitySpread {
  absolute: number;
  percent: string;
  apr: number;
}

export interface OpportunityMetrics {
  confidence: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  maxSize: number;
  maxSizeFormatted: string;
  priceDeviation: number;
}

export interface OpportunityTiming {
  nextFunding: string;
  longFrequency: string;
  shortFrequency: string;
}

export interface OpportunityData {
  id: string;
  rank: number;
  token: string;
  tokenIcon?: string;
  pair?: string;
  longExchange: ExchangeData;
  shortExchange: ExchangeData;
  spread: OpportunitySpread;
  metrics?: OpportunityMetrics;
  timing?: OpportunityTiming;
}

// Position Data Types
export interface UserPosition {
  id: string;
  token: string;
  pair: string;
  longExchange: string;
  shortExchange: string;
  size: number;
  entryPrice: number;
  entryTimestamp: string;
  currentPnl: number;
  currentAPR: number;
  autoCloseEnabled: boolean;
  autoCloseSettings: {
    aprThreshold: number;
    pnlThreshold: number;
  };
  status: "OPEN" | "CLOSING" | "CLOSED";
  alerts: PositionAlert[];
}

export interface PositionAlert {
  id: string;
  positionId: string;
  type: "FUNDING_CHANGE" | "PNL_THRESHOLD" | "SIZE_LIMIT" | "RISK_WARNING";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// Exchange Data Types
export interface ExchangeInfo {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  status: "ONLINE" | "OFFLINE" | "DEGRADED";
  supportedPairs: string[];
  lastUpdate: string;
  apiLatency?: number;
}

export interface ExchangeStatus {
  exchange: string;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR";
  lastPing: string;
  latency: number;
  errorCount: number;
}

// API Query Parameters
export interface FundingRatesQuery {
  token?: string;
  exchange?: string;
  sortBy?: "token" | "rate" | "timestamp";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface OpportunitiesQuery {
  minAPR?: number;
  riskLevel?: "low" | "medium" | "high";
  token?: string;
  limit?: number;
}

// WebSocket Event Types
export interface WebSocketEvents {
  "funding-rates-update": {
    rates: FundingRateData[];
    timestamp: string;
  };
  "opportunities-update": {
    opportunities: OpportunityData[];
    timestamp: string;
  };
  "position-pnl-update": {
    positions: UserPosition[];
    timestamp: string;
  };
  "position-alert": PositionAlert;
  "position-closed": {
    positionId: string;
    reason: string;
    finalPnl: number;
    timestamp: string;
  };
  "exchange-status": {
    exchanges: ExchangeStatus[];
    timestamp: string;
  };
}

// Authentication Types
export interface AuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    walletAddress: string;
    createdAt: string;
  };
  expiresAt: string;
}
