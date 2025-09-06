import { apiClient } from './client';
import type {
  DashboardData,
  OpportunityData,
  FundingRateData,
  OpportunitiesQuery,
  FundingRatesQuery,
} from '@/types/api';

export class DashboardAPI {
  // Get complete dashboard data
  static async getDashboard(): Promise<DashboardData> {
    return apiClient.get<DashboardData>('/dashboard/');
  }

  // Get funding rates with optional filtering
  static async getFundingRates(query?: FundingRatesQuery): Promise<FundingRateData[]> {
    return apiClient.get<FundingRateData[]>('/dashboard/funding-rates', query);
  }

  // Get opportunities with optional filtering
  static async getOpportunities(query?: OpportunitiesQuery): Promise<OpportunityData[]> {
    return apiClient.get<OpportunityData[]>('/dashboard/opportunities', query);
  }

  // Get top opportunities (equivalent to our top 4 cards)
  static async getTopOpportunities(limit: number = 4): Promise<OpportunityData[]> {
    return apiClient.get<OpportunityData[]>('/dashboard/opportunities', {
      limit,
      // sortBy: 'apr',
      // sortOrder: 'desc'
    });
  }
}

export const dashboardAPI = DashboardAPI;