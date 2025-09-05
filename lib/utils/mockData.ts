import { OpportunityData } from '@/types/api';

export const mockOpportunities: OpportunityData[] = [
  {
    token: 'IP',
    pair: 'IP-USD',
    exchanges: {
      hyperliquid: { exchange: 'hyperliquid', rate: -374.03, timestamp: new Date(), isActive: true },
      extended: { exchange: 'extended', rate: -7.01, timestamp: new Date(), isActive: true },
      vest: { exchange: 'vest', rate: -12.5, timestamp: new Date(), isActive: true },
      orderly: { exchange: 'orderly', rate: -8.2, timestamp: new Date(), isActive: true },
    },
    bestStrategy: {
      longExchange: 'hyperliquid',
      shortExchange: 'extended',
      apr: 367.0,
      confidence: 'HIGH',
    },
  },
  {
    token: 'BIO',
    pair: 'BIO-USD',
    exchanges: {
      hyperliquid: { exchange: 'hyperliquid', rate: -89.45, timestamp: new Date(), isActive: true },
      extended: { exchange: 'extended', rate: -5.2, timestamp: new Date(), isActive: true },
      vest: { exchange: 'vest', rate: -7.8, timestamp: new Date(), isActive: true },
      orderly: { exchange: 'orderly', rate: -6.1, timestamp: new Date(), isActive: true },
    },
    bestStrategy: {
      longExchange: 'hyperliquid',
      shortExchange: 'extended',
      apr: 84.25,
      confidence: 'HIGH',
    },
  },
  {
    token: 'SYRUP',
    pair: 'SYRUP-USD',
    exchanges: {
      hyperliquid: { exchange: 'hyperliquid', rate: -42.1, timestamp: new Date(), isActive: true },
      extended: { exchange: 'extended', rate: -8.3, timestamp: new Date(), isActive: true },
      vest: { exchange: 'vest', rate: -15.2, timestamp: new Date(), isActive: true },
      orderly: { exchange: 'orderly', rate: -9.8, timestamp: new Date(), isActive: true },
    },
    bestStrategy: {
      longExchange: 'hyperliquid',
      shortExchange: 'extended',
      apr: 33.8,
      confidence: 'MEDIUM',
    },
  },
  {
    token: 'ZORA',
    pair: 'ZORA-USD',
    exchanges: {
      hyperliquid: { exchange: 'hyperliquid', rate: -28.5, timestamp: new Date(), isActive: true },
      extended: { exchange: 'extended', rate: -12.1, timestamp: new Date(), isActive: true },
      vest: { exchange: 'vest', rate: -18.7, timestamp: new Date(), isActive: true },
      orderly: { exchange: 'orderly', rate: -14.3, timestamp: new Date(), isActive: true },
    },
    bestStrategy: {
      longExchange: 'hyperliquid',
      shortExchange: 'extended',
      apr: 16.4,
      confidence: 'MEDIUM',
    },
  },
];

export const additionalTokens = [
  'AVAX', 'LINK', 'UNI', 'AAVE', 'MKR', 'SNX', 'COMP', 'YFI', 'SUSHI', 'CRV',
  'BAL', 'ZRX', 'KNC', 'LRC', 'ENJ', 'MANA', 'SAND', 'ALICE', 'TLM', 'AXS',
];

export const generateMockOpportunity = (token: string): OpportunityData => {
  const baseRate = Math.random() * 100 - 50; // Random rate between -50% and +50%
  
  return {
    token,
    pair: `${token}-USD`,
    exchanges: {
      hyperliquid: { 
        exchange: 'hyperliquid', 
        rate: baseRate + (Math.random() * 20 - 10), 
        timestamp: new Date(), 
        isActive: true 
      },
      extended: { 
        exchange: 'extended', 
        rate: baseRate + (Math.random() * 10 - 5), 
        timestamp: new Date(), 
        isActive: true 
      },
      vest: { 
        exchange: 'vest', 
        rate: baseRate + (Math.random() * 15 - 7.5), 
        timestamp: new Date(), 
        isActive: true 
      },
      orderly: { 
        exchange: 'orderly', 
        rate: baseRate + (Math.random() * 8 - 4), 
        timestamp: new Date(), 
        isActive: true 
      },
    },
    bestStrategy: {
      longExchange: 'hyperliquid',
      shortExchange: 'extended',
      apr: Math.abs(baseRate) * (Math.random() * 2 + 1),
      confidence: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
    },
  };
};

export const getAllMockOpportunities = (): OpportunityData[] => {
  const additionalOpportunities = additionalTokens.map(generateMockOpportunity);
  return [...mockOpportunities, ...additionalOpportunities];
};