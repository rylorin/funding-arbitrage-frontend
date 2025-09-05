export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FundingRate {
  exchange: string;
  rate: number;
  timestamp: Date;
  isActive: boolean;
}

export interface OpportunityData {
  token: string;
  pair: string;
  exchanges: Record<string, FundingRate>;
  bestStrategy: {
    longExchange: string;
    shortExchange: string;
    apr: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  userPosition?: UserPosition;
}

export interface UserPosition {
  id: string;
  token: string;
  pair: string;
  longExchange: string;
  shortExchange: string;
  size: number;
  entryPrice: number;
  entryTimestamp: Date;
  currentPnl: number;
  currentAPR: number;
  autoCloseEnabled: boolean;
  autoCloseSettings: {
    aprThreshold: number;
    pnlThreshold: number;
  };
  status: 'OPEN' | 'CLOSING' | 'CLOSED';
}

export interface ExchangeInfo {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  supportedPairs: string[];
}

export interface WebSocketEvents {
  'funding-rates-update': OpportunityData[];
  'position-pnl-update': UserPosition[];
  'opportunity-alert': {
    token: string;
    apr: number;
    strategy: string;
  };
  'position-closed': {
    positionId: string;
    reason: string;
    finalPnl: number;
  };
}