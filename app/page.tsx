"use client";

import { DetailedTable } from "@/components/dashboard/detailed-table";
import { ExchangeFilters } from "@/components/dashboard/exchange-filters";
import { OpportunitiesGrid } from "@/components/dashboard/opportunities-grid";
import { Navbar } from "@/components/layout/navbar";
import {
  ErrorMessage,
  LoadingCard,
  LoadingTable,
} from "@/components/ui/loading";
import { useFundingRates, useOpportunities } from "@/hooks/useDashboard";
import { useWebSocket } from "@/lib/api/websocket";
import type { OpportunityData } from "@/types/api";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([
    "vest",
    "extended",
    "hyperliquid",
    "orderly",
  ]);
  const [wsConnectionStatus, setWsConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [wsInitialized, setWsInitialized] = useState(false);

  // WebSocket connection
  const ws = useWebSocket();

  // Fetch data from API
  const {
    opportunities: allOpportunities,
    topOpportunities,
    loading: opportunitiesLoading,
    error: opportunitiesError,
    refetch: refetchOpportunities,
  } = useOpportunities();

  const {
    fundingRates,
    loading: fundingRatesLoading,
    error: fundingRatesError,
    refetch: refetchFundingRates,
  } = useFundingRates();

  // Initialize WebSocket connection and set up real-time updates
  useEffect(() => {
    // Skip WebSocket - focus on REST API for now
    console.log("WebSocket disabled - using REST API only");
    setWsConnectionStatus("disconnected");
    setWsInitialized(true);
    return;

    let isMounted = true;

    const initWebSocket = async () => {
      try {
        if (!isMounted) return;

        setWsConnectionStatus("connecting");
        await ws.connect();

        if (!isMounted) return;

        setWsConnectionStatus("connected");
        setWsInitialized(true);

        // Subscribe to funding rates updates
        ws.onFundingRatesUpdate((data) => {
          console.log("Received funding rates update:", data);
          refetchFundingRates();
        });

        // Subscribe to opportunities updates
        ws.onOpportunitiesUpdate((data) => {
          console.log("Received opportunities update:", data);
          refetchOpportunities();
        });

        // Subscribe to exchange status updates
        ws.onExchangeStatus((data) => {
          console.log("Received exchange status update:", data);
        });

        // Subscribe to specific data feeds
        ws.subscribeTo(["funding-rates", "opportunities", "exchange-status"]);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        if (isMounted) {
          setWsConnectionStatus("disconnected");
          setWsInitialized(true); // Still mark as initialized to prevent retries
        }
      }
    };

    // Attempt WebSocket connection once
    initWebSocket();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      ws.disconnect();
      setWsConnectionStatus("disconnected");
      setWsInitialized(false);
    };
  }, [ws, refetchFundingRates, refetchOpportunities, wsInitialized]);

  // Convert funding rates to opportunity format for backward compatibility
  const opportunitiesFromRates = useMemo(() => {
    if (!fundingRates.length) return [];

    // Group funding rates by token/pair
    const groupedRates = fundingRates.reduce((acc, rate) => {
      const key = rate.token;
      if (!acc[key]) {
        acc[key] = {
          token: rate.token,
          pair: rate.pair,
          rates: {},
        };
      }
      acc[key].rates[rate.exchange] = rate;
      return acc;
    }, {} as Record<string, any>);

    // Convert to OpportunityData format
    return Object.values(groupedRates).map((group: any) => {
      const rates = group.rates;
      const exchanges = Object.keys(rates);

      // Find best arbitrage opportunity
      let bestAPR = 0;
      let longExchange = exchanges[0];
      let shortExchange = exchanges[1];

      for (let i = 0; i < exchanges.length; i++) {
        for (let j = i + 1; j < exchanges.length; j++) {
          const rate1 = rates[exchanges[i]].rate;
          const rate2 = rates[exchanges[j]].rate;
          const apr = Math.abs(rate1 - rate2) * 365 * 3; // Approximation

          if (apr > bestAPR) {
            bestAPR = apr;
            longExchange = rate1 > rate2 ? exchanges[j] : exchanges[i];
            shortExchange = rate1 > rate2 ? exchanges[i] : exchanges[j];
          }
        }
      }

      return {
        id: group.token,
        token: group.token,
        pair: group.pair,
        longExchange: {
          name: longExchange,
          color: "",
          fundingRate: rates[longExchange]?.rate || 0,
          fundingRateFormatted: "",
          price: 0,
          priceFormatted: "",
        },
        shortExchange: {
          name: shortExchange,
          color: "",
          fundingRate: rates[shortExchange]?.rate || 0,
          fundingRateFormatted: "",
          price: 0,
          priceFormatted: "",
        },
        longRate: rates[longExchange]?.rate || 0,
        shortRate: rates[shortExchange]?.rate || 0,
        apr: bestAPR,
        riskLevel: bestAPR > 100 ? "HIGH" : bestAPR > 50 ? "MEDIUM" : "LOW",
        confidence: bestAPR > 100 ? "HIGH" : bestAPR > 50 ? "MEDIUM" : "LOW",
        minSize: 0,
        maxSize: 1000000,
        timestamp: new Date().toISOString(),
        exchanges: rates, // Keep raw exchange data for detailed table
        rank: 0,
      } as OpportunityData & { exchanges: any };
    });
  }, [fundingRates]);

  // Use real opportunities if available, fallback to converted funding rates
  const displayOpportunities =
    allOpportunities.length > 0 ? allOpportunities : [];

  // Filter opportunities based on selected exchanges
  const filteredOpportunities = useMemo(() => {
    return displayOpportunities.filter((opportunity) => {
      // For new API structure with objects
      if (opportunity.longExchange?.name && opportunity.shortExchange?.name) {
        return selectedExchanges.some(
          (exchangeId) =>
            exchangeId.toLowerCase() ===
              opportunity.longExchange.name.toLowerCase() ||
            exchangeId.toLowerCase() ===
              opportunity.shortExchange.name.toLowerCase()
        );
      }

      // For real opportunities with string exchanges
      if (
        "longExchange" in opportunity &&
        "shortExchange" in opportunity &&
        typeof opportunity.longExchange === "string" &&
        typeof opportunity.shortExchange === "string"
      ) {
        return (
          selectedExchanges.includes(opportunity.longExchange) ||
          selectedExchanges.includes(opportunity.shortExchange)
        );
      }

      // For converted funding rates
      if ("exchanges" in opportunity && opportunity.exchanges) {
        return selectedExchanges.some(
          (exchangeId) => opportunity.exchanges[exchangeId]?.isActive !== false
        );
      }

      return true;
    });
  }, [displayOpportunities, selectedExchanges]);

  // Get top 4 opportunities
  const displayTopOpportunities = useMemo(() => {
    if (topOpportunities.length > 0) return topOpportunities;

    return [...displayOpportunities].sort((a, b) => b.apr - a.apr).slice(0, 4);
  }, [topOpportunities, displayOpportunities]);

  const isLoading = opportunitiesLoading || fundingRatesLoading;
  const hasError = opportunitiesError || fundingRatesError;
  const errorMessage =
    opportunitiesError || fundingRatesError || "Unknown error";

  const handleRetry = () => {
    refetchOpportunities();
    refetchFundingRates();
  };

  if (hasError && displayOpportunities.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117]">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <ErrorMessage
            message={`Failed to load data: ${errorMessage}`}
            onRetry={handleRetry}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar wsConnectionStatus={wsConnectionStatus} />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Top Opportunities Grid */}
        <section>
          {isLoading && displayTopOpportunities.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <OpportunitiesGrid opportunities={displayTopOpportunities} />
          )}
        </section>

        {/* Filters */}
        <section>
          <ExchangeFilters
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            selectedExchanges={selectedExchanges}
            onExchangesChange={setSelectedExchanges}
          />
        </section>

        {/* Detailed Table */}
        <section>
          {isLoading && displayOpportunities.length === 0 ? (
            <LoadingTable />
          ) : (
            <DetailedTable
              opportunities={filteredOpportunities}
              selectedExchanges={selectedExchanges}
              timeframe={selectedTimeframe}
            />
          )}
        </section>
      </main>
    </div>
  );
}
