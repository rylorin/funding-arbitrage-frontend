"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { TimeframeKey, TIMEFRAMES } from "@/lib/utils/constants";
import { formatPercentage } from "@/lib/utils/formatters";
import type { OpportunityData } from "@/types/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DetailedTableProps {
  opportunities: OpportunityData[];
  selectedExchanges: string[];
  timeframe: TimeframeKey;
}

type SortField = "token" | "apr";
type SortOrder = "asc" | "desc";

export const DetailedTable = ({
  opportunities,
  selectedExchanges,
  timeframe,
}: DetailedTableProps) => {
  const rateAdjust: number = TIMEFRAMES[timeframe].hours; // Adjust to hourly funding rate

  const [sortBy, setSortBy] = useState<SortField>("apr");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Filter opportunities based on selected exchanges
  if (selectedExchanges.length > 0)
    opportunities = opportunities.filter(
      (opportunity) =>
        selectedExchanges.findIndex(
          (item) => item == opportunity.longExchange.name.toLowerCase()
        ) >= 0 &&
        selectedExchanges.findIndex(
          (item) => item == opportunity.shortExchange.name.toLowerCase()
        ) >= 0
    );

  const sortedOpportunities: OpportunityData[] = [...opportunities].sort(
    (a, b) => {
      if (sortBy === "apr") {
        const aValue = a.spread?.apr || 0;
        const bValue = b.spread?.apr || 0;
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      } else {
        const aValue = a.token;
        const bValue = b.token;
        return sortOrder === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
    }
  );

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-semibold text-muted-foreground hover:text-foreground"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === field &&
          (sortOrder === "desc" ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronUp size={14} />
          ))}
      </div>
    </Button>
  );

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "text-profit-400 bg-profit-500/10";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/10";
      case "LOW":
        return "text-loss-400 bg-loss-500/10";
      default:
        return "text-neutral-400 bg-neutral-500/10";
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#30363d]">
        <h2 className="text-lg font-semibold text-white">All Opportunities</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0d1117] border-b border-[#30363d]">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-300">
                <SortButton field="token">Pair</SortButton>
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]">
                Long
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]">
                Rate ({TIMEFRAMES[timeframe].label})
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]">
                Short
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]">
                Rate ({TIMEFRAMES[timeframe].label})
              </th>
              {/* {selectedExchanges.map((exchangeId) => (
                <th
                  key={exchangeId}
                  className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]"
                >
                  {exchangeId} ({TIMEFRAMES[timeframe].label})
                </th>
              ))} */}
              <th className="px-4 py-3 text-left font-medium text-gray-300 min-w-[180px]">
                Strategy
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-300">
                <SortButton field="apr">APR (1y)</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOpportunities.map((opportunity, index) => (
              <tr
                key={opportunity.id || opportunity.token || index}
                className={cn(
                  "border-b border-[#21262d] hover:bg-[#21262d]/50 transition-colors",
                  index % 2 === 0 ? "bg-[#0d1117]/20" : "bg-transparent"
                )}
              >
                {/* Pair */}
                <td className="px-4 py-3 font-medium text-white">
                  {opportunity.pair || `${opportunity.token}`}
                </td>

                {/* Exchange rates */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      opportunity.longExchange.fundingRate > 0
                        ? "text-green-400 bg-green-500/20"
                        : opportunity.longExchange.fundingRate < 0
                        ? "text-red-400 bg-red-500/20"
                        : "text-gray-400 bg-gray-500/20"
                    )}
                  >
                    {opportunity.longExchange.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      opportunity.longExchange.fundingRate > 0
                        ? "text-green-400 bg-green-500/20"
                        : opportunity.longExchange.fundingRate < 0
                        ? "text-red-400 bg-red-500/20"
                        : "text-gray-400 bg-gray-500/20"
                    )}
                  >
                    {formatPercentage(
                      opportunity.longExchange.fundingRate * rateAdjust,
                      2
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      opportunity.shortExchange.fundingRate > 0
                        ? "text-green-400 bg-green-500/20"
                        : opportunity.shortExchange.fundingRate < 0
                        ? "text-red-400 bg-red-500/20"
                        : "text-gray-400 bg-gray-500/20"
                    )}
                  >
                    {opportunity.shortExchange.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      opportunity.shortExchange.fundingRate > 0
                        ? "text-green-400 bg-green-500/20"
                        : opportunity.shortExchange.fundingRate < 0
                        ? "text-red-400 bg-red-500/20"
                        : "text-gray-400 bg-gray-500/20"
                    )}
                  >
                    {formatPercentage(
                      opportunity.shortExchange.fundingRate * rateAdjust,
                      2
                    )}
                  </span>
                </td>

                {/* {selectedExchanges.map((exchangeId) => {
                  // Handle new API structure
                  let rate = null;

                  if (
                    opportunity.longExchange.name.toLowerCase() ===
                    exchangeId.toLowerCase()
                  ) {
                    rate = { rate: opportunity.longExchange.fundingRate };
                  } else if (
                    opportunity.shortExchange.name.toLowerCase() ===
                    exchangeId.toLowerCase()
                  ) {
                    rate = { rate: opportunity.shortExchange.fundingRate };
                  } else {
                    rate = null; // No data for this exchange
                  }
                  // if (opportunity.token == "BIO")
                  //   console.log(exchangeId, opportunity.token, rate);

                  return (
                    <td key={exchangeId} className="px-4 py-3 text-center">
                      {rate && typeof rate.rate === "number" ? (
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-semibold",
                            rate.rate > 0
                              ? "text-green-400 bg-green-500/20"
                              : rate.rate < 0
                              ? "text-red-400 bg-red-500/20"
                              : "text-gray-400 bg-gray-500/20"
                          )}
                        >
                          {formatPercentage(rate.rate * rateAdjust, 2)}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">N/A</span>
                      )}
                    </td>
                  );
                })} */}

                {/* Strategy */}
                <td className="px-4 py-3 text-xs text-gray-400">
                  Long {opportunity.longExchange?.name || "N/A"} • Short{" "}
                  {opportunity.shortExchange?.name || "N/A"}
                </td>

                {/* APR */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        (() => {
                          const aprValue = opportunity.spread?.apr || 0;
                          return aprValue > 100
                            ? "text-[#00d9ff]"
                            : aprValue > 50
                            ? "text-green-400"
                            : aprValue > 20
                            ? "text-yellow-400"
                            : "text-gray-400";
                        })()
                      )}
                    >
                      {opportunity.spread.apr.toFixed()}%
                    </span>
                    <div
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium border",
                        getConfidenceColor(
                          opportunity.metrics?.confidence
                            ? opportunity.metrics.confidence >= 80
                              ? "HIGH"
                              : opportunity.metrics.confidence >= 60
                              ? "MEDIUM"
                              : "LOW"
                            : "MEDIUM"
                        )
                      )}
                    >
                      {opportunity.metrics?.confidence
                        ? opportunity.metrics.confidence >= 80
                          ? "HIGH"
                          : opportunity.metrics.confidence >= 60
                          ? "MEDIUM"
                          : "LOW"
                        : "MEDIUM"}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
