"use client";

import { dashboardAPI } from "@/lib/api/dashboard";
import { mockFundingRates } from "@/lib/data/mockData";
import { getAllMockOpportunities } from "@/lib/utils/mockData";
import type { DashboardData, FundingRateData, OpportunityData } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

interface UseDashboardResult {
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardResult => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getDashboard();
      setDashboard(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
};

interface UseOpportunitiesResult {
  opportunities: OpportunityData[];
  topOpportunities: OpportunityData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOpportunities = (): UseOpportunitiesResult => {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [topOpportunities, setTopOpportunities] = useState<OpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    // Skip API calls if disabled in development
    if (process.env.NEXT_PUBLIC_SKIP_API === "true") {
      console.log("API calls disabled - using mock data only");
      const mockOpp = getAllMockOpportunities();
      setOpportunities(mockOpp);
      setTopOpportunities(mockOpp.slice(0, 4));
      setLoading(false);
      return;
    }

    // console.log("Attempting to fetch real opportunities data from backend...");

    try {
      setLoading(true);
      setError(null);

      // Fetch both all opportunities and top 4
      const [allOpportunities, topOps] = await Promise.all([
        dashboardAPI.getOpportunities({ minAPR: 5, limit: 128 }),
        dashboardAPI.getOpportunities({ limit: 4 }),
      ]);

      setOpportunities(allOpportunities);
      setTopOpportunities(topOps);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch opportunities";
      console.error("Opportunities API Error:", errorMessage);

      // Log detailed error information for debugging
      if (err?.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        console.error("Error response headers:", err.response.headers);
      }

      // In development mode, provide helpful error messages
      if (process.env.NODE_ENV === "development" && err instanceof Error) {
        if (err.message.includes("400")) {
          console.warn("Tip: Backend may require authentication. Check if auth token is needed.");
        } else if (err.message.includes("404")) {
          console.warn("Tip: Make sure the backend server is running on http://localhost:3000");
        }
      }

      // Fallback to mock data on error
      console.log("Falling back to mock data due to API error");
      const mockOpp = getAllMockOpportunities();
      setOpportunities(mockOpp);
      setTopOpportunities(mockOpp.slice(0, 4));
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    topOpportunities,
    loading,
    error,
    refetch: fetchOpportunities,
  };
};

interface UseFundingRatesResult {
  fundingRates: FundingRateData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const _useFundingRates = (): UseFundingRatesResult => {
  const [fundingRates, setFundingRates] = useState<FundingRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFundingRates = useCallback(async () => {
    // Skip API calls if disabled in development
    if (process.env.NEXT_PUBLIC_SKIP_API === "true") {
      console.log("API calls disabled - using mock data only");
      setFundingRates(mockFundingRates);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getFundingRates();
      setFundingRates(data);
    } catch (err: any) {
      console.error("Funding Rates API Error:", err);

      // Log detailed error information for debugging
      if (err?.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        console.error("Error response headers:", err.response.headers);
      }

      // In development mode, provide helpful error messages
      if (process.env.NODE_ENV === "development" && err instanceof Error) {
        if (err.message.includes("400")) {
          console.warn("Tip: Backend may require authentication. Check if auth token is needed.");
        } else if (err.message.includes("404")) {
          console.warn("Tip: Make sure the backend server is running on http://localhost:3000");
        }
      }

      // Fallback to mock data on error
      console.log("Falling back to mock funding rates due to API error");
      setFundingRates(mockFundingRates);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFundingRates();
  }, [fetchFundingRates]);

  return {
    fundingRates,
    loading,
    error,
    refetch: fetchFundingRates,
  };
};
