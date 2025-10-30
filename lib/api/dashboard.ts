import type {
  DashboardData,
  FundingRateData,
  FundingRatesQuery,
  OpportunitiesQuery,
  OpportunityData,
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
  static async getOpportunities(query?: OpportunitiesQuery): Promise<OpportunityData[]> {
    console.log("getOpportunities. Fetching opportunities with query:", query);
    const response = await apiClient.get<{
      success: boolean;
      data: {
        opportunities: OpportunityData[];
        summary: any;
      };
    }>("/dashboard/opportunities", query);
    return response.data.opportunities;
  }

  // Get top opportunities (equivalent to our top 4 cards)
  static async getTopOpportunities(limit: number = 4): Promise<OpportunityData[]> {
    const query: OpportunitiesQuery = { limit };
    return this.getOpportunities(query);
  }
}

export const dashboardAPI = DashboardAPI;
