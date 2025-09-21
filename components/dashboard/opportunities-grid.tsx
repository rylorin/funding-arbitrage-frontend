"use client";

import { cn } from "@/lib/utils/cn";
import { formatAPR } from "@/lib/utils/formatters";
import type { OpportunityData } from "@/types/api";

interface OpportunitiesGridProps {
  opportunities: OpportunityData[];
}

interface OpportunityCardProps {
  opportunity: OpportunityData;
}

const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const { token, longExchange, shortExchange, longRate, shortRate } =
    opportunity;

  // Handle both new API structure and old mock data structures
  const displayLongExchange = longExchange?.name || "N/A";

  const displayShortExchange = shortExchange?.name || "N/A";

  const displayLongRate =
    longExchange?.fundingRate ||
    (longRate ??
      (opportunity as any).exchanges?.[displayLongExchange]?.rate ??
      0);

  const displayShortRate =
    shortExchange?.fundingRate ||
    (shortRate ??
      (opportunity as any).exchanges?.[displayShortExchange]?.rate ??
      0);

  const displayAPR = parseFloat(
    opportunity.spread?.apr?.replace("%", "") || "0"
  );

  const displayConfidence = opportunity.metrics?.confidence
    ? opportunity.metrics.confidence >= 80
      ? "HIGH"
      : opportunity.metrics.confidence >= 60
      ? "MEDIUM"
      : "LOW" // New API structure (number to string)
    : "MEDIUM";

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "LOW":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getRateColor = (rate: number) => {
    if (rate > 0) return "text-green-400";
    if (rate < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getAPRColor = (apr: number) => {
    if (apr > 100) return "text-[#00d9ff]";
    if (apr > 50) return "text-green-400";
    if (apr > 20) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-all cursor-pointer group">
      {/* Token name */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{token}</h3>
        <div
          className={cn(
            "px-2 py-1 rounded text-xs font-medium border",
            getConfidenceColor(displayConfidence)
          )}
        >
          {displayConfidence}
        </div>
      </div>

      {/* Exchange rates */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 capitalize">
            {displayLongExchange}
          </span>
          <span
            className={cn(
              "text-sm font-semibold",
              getRateColor(displayLongRate)
            )}
          >
            {formatAPR(displayLongRate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 capitalize">
            {displayShortExchange}
          </span>
          <span
            className={cn(
              "text-sm font-semibold",
              getRateColor(displayShortRate)
            )}
          >
            {formatAPR(displayShortRate)}
          </span>
        </div>
      </div>

      {/* Strategy description */}
      <p className="text-xs text-gray-500 mb-4">
        Long {displayLongExchange} • Short {displayShortExchange}
      </p>

      {/* APR */}
      <div className="flex items-center justify-end">
        <div className={cn("text-2xl font-bold", getAPRColor(displayAPR))}>
          {formatAPR(displayAPR)}
        </div>
      </div>
    </div>
  );
};

export const OpportunitiesGrid = ({
  opportunities,
}: OpportunitiesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {opportunities.map((opportunity, index) => (
        <OpportunityCard
          key={opportunity.id || opportunity.token || index}
          opportunity={opportunity}
        />
      ))}
    </div>
  );
};
