import { apiClient } from './client';
import type {
  ApiResponse,
  ExchangeInfo,
  ExchangeStatus,
  FundingRateData,
} from '@/types/api';

export class ExchangesAPI {
  // Get all exchange information
  static async getExchanges(): Promise<ExchangeInfo[]> {
    return apiClient.get<ExchangeInfo[]>('/exchanges/');
  }

  // Get exchange status and health
  static async getExchangeStatus(): Promise<ExchangeStatus[]> {
    return apiClient.get<ExchangeStatus[]>('/exchanges/status');
  }

  // Get funding rates from all exchanges
  static async getFundingRates(): Promise<FundingRateData[]> {
    return apiClient.get<FundingRateData[]>('/exchanges/funding-rates');
  }

  // Get funding rates for specific exchange
  static async getExchangeFundingRates(exchange: string): Promise<FundingRateData[]> {
    return apiClient.get<FundingRateData[]>('/exchanges/funding-rates', { exchange });
  }
}

export const exchangesAPI = ExchangesAPI;