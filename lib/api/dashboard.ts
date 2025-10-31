import type {
  ArbitrageOpportunityData,
  DashboardData,
  FundingRateData,
  FundingRatesQuery,
  OpportunitiesQuery,
} from "@/types/api";
import { apiClient } from "./client";

export class DashboardAPI {
  // Get complete dashboard data
  static async getDashboard(): Promise<DashboardData> {
    return apiClient.get<DashboardData>("/dashboard/");
  }

  // Get funding rates with optional filtering
  static async getFundingRates(query?: FundingRatesQuery): Promise<FundingRateData[]> {
    return apiClient.get<FundingRateData[]>("/dashboard/funding-rates", query);
  }

  // Get opportunities with optional filtering
  static async getOpportunities(query?: OpportunitiesQuery): Promise<ArbitrageOpportunityData[]> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        opportunities: ArbitrageOpportunityData[];
        summary: any;
      };
    }>("/dashboard/opportunities", query);
    return response.data.opportunities;
  }
}

export const dashboardAPI = DashboardAPI;
