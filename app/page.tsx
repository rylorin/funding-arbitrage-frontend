"use client";

import { DetailedTable } from "@/components/dashboard/detailed-table";
import { ExchangeFilters } from "@/components/dashboard/exchange-filters";
import { OpportunitiesGrid } from "@/components/dashboard/opportunities-grid";
import { Navbar } from "@/components/layout/navbar";
import { ErrorMessage, LoadingCard, LoadingTable } from "@/components/ui/loading";
import { useOpportunities } from "@/hooks/useDashboard";
import { useWebSocket } from "@/lib/api/websocket";
import { TimeframeKey } from "@/lib/utils/constants";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>(["vest", "extended", "hyperliquid", "orderly"]);
  const [wsConnectionStatus, setWsConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
    "disconnected",
  );
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

  // const {
  //   fundingRates,
  //   loading: fundingRatesLoading,
  //   error: fundingRatesError,
  //   refetch: refetchFundingRates,
  // } = useFundingRates();

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
          // refetchFundingRates();
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
  }, [ws, /* refetchFundingRates, */ refetchOpportunities, wsInitialized]);

  // Use real opportunities if available, fallback to converted funding rates
  const displayOpportunities = allOpportunities.length > 0 ? allOpportunities : [];

  // Calculate stats from opportunities data
  const stats = useMemo(() => {
    const totalPairs = displayOpportunities.length;
    const maxAPR =
      displayOpportunities.length > 0 ? Math.max(...displayOpportunities.map((opp) => opp.spread?.apr || 0)) : 0;
    const lastUpdate = new Date();

    return {
      totalPairs,
      maxAPR,
      lastUpdate,
    };
  }, [displayOpportunities]);

  // Filter opportunities based on selected exchanges
  const filteredOpportunities = useMemo(() => {
    return displayOpportunities.filter((opportunity) => {
      // For new API structure with objects
      if (opportunity.longExchange?.name && opportunity.shortExchange?.name) {
        return selectedExchanges.some(
          (exchangeId) =>
            exchangeId.toLowerCase() === opportunity.longExchange.name.toLowerCase() ||
            exchangeId.toLowerCase() === opportunity.shortExchange.name.toLowerCase(),
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
          selectedExchanges.includes(opportunity.longExchange) || selectedExchanges.includes(opportunity.shortExchange)
        );
      }

      // // For converted funding rates
      // if ("exchanges" in opportunity && opportunity.exchanges) {
      //   return selectedExchanges.some(
      //     (exchangeId) => opportunity.exchanges[exchangeId]?.isActive !== false
      //   );
      // }

      return true;
    });
  }, [displayOpportunities, selectedExchanges]);

  // Get top 4 opportunities
  const displayTopOpportunities = useMemo(() => {
    if (topOpportunities.length > 0) return topOpportunities;

    return [...displayOpportunities].sort((a, b) => b.spread.apr - a.spread.apr).slice(0, 4);
  }, [topOpportunities, displayOpportunities]);

  const isLoading = opportunitiesLoading; /* || fundingRatesLoading; */
  const hasError = opportunitiesError; /* || fundingRatesError; */
  const errorMessage = opportunitiesError || /* fundingRatesError || */ "Unknown error";

  const handleRefresh = () => {
    refetchOpportunities();
    // refetchFundingRates();
  };

  if (hasError && displayOpportunities.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117]">
        <Navbar wsConnectionStatus={wsConnectionStatus} onRefresh={handleRefresh} stats={stats} />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <ErrorMessage message={`Failed to load data: ${errorMessage}`} onRetry={handleRefresh} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar wsConnectionStatus={wsConnectionStatus} onRefresh={handleRefresh} />

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
              timeframe={selectedTimeframe.toUpperCase() as TimeframeKey}
            />
          )}
        </section>
      </main>
    </div>
  );
}
