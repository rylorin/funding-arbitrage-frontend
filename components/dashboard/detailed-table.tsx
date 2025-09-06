"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatAPR, getColorForValue, getFundingRateClass } from "@/lib/utils/formatters"
import { cn } from "@/lib/utils/cn"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { OpportunityData } from "@/types/api"

interface DetailedTableProps {
  opportunities: OpportunityData[]
  selectedExchanges: string[]
}

type SortField = 'token' | 'apr'
type SortOrder = 'asc' | 'desc'

export const DetailedTable = ({ opportunities, selectedExchanges }: DetailedTableProps) => {
  const [sortBy, setSortBy] = useState<SortField>('apr')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (sortBy === 'apr') {
      const aValue = a.bestStrategy.apr
      const bValue = b.bestStrategy.apr
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    } else {
      const aValue = a.token
      const bValue = b.token
      return sortOrder === 'desc' 
        ? bValue.localeCompare(aValue) 
        : aValue.localeCompare(bValue)
    }
  })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-semibold text-muted-foreground hover:text-foreground"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === field && (
          sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
        )}
      </div>
    </Button>
  )

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH':
        return 'text-profit-400 bg-profit-500/10'
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/10'
      case 'LOW':
        return 'text-loss-400 bg-loss-500/10'
      default:
        return 'text-neutral-400 bg-neutral-500/10'
    }
  }

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
              {selectedExchanges.map(exchangeId => (
                <th
                  key={exchangeId}
                  className="px-4 py-3 text-center font-medium text-gray-300 capitalize min-w-[100px]"
                >
                  {exchangeId}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-gray-300 min-w-[180px]">
                Strategy
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-300">
                <SortButton field="apr">APR</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOpportunities.map((opportunity, index) => (
              <tr
                key={opportunity.token}
                className={cn(
                  "border-b border-[#21262d] hover:bg-[#21262d]/50 transition-colors",
                  index % 2 === 0 ? "bg-[#0d1117]/20" : "bg-transparent"
                )}
              >
                {/* Pair */}
                <td className="px-4 py-3 font-medium text-white">
                  {opportunity.pair}
                </td>
                
                {/* Exchange rates */}
                {selectedExchanges.map((exchangeId) => {
                  // Handle both old and new data structures
                  const rate = (opportunity as any).exchanges?.[exchangeId] || 
                              (exchangeId === opportunity.longExchange ? { rate: opportunity.longRate } :
                               exchangeId === opportunity.shortExchange ? { rate: opportunity.shortRate } : null)
                  
                  return (
                    <td key={exchangeId} className="px-4 py-3 text-center">
                      {rate && typeof rate.rate === 'number' ? (
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-semibold",
                          rate.rate > 0 
                            ? "text-green-400 bg-green-500/20" 
                            : rate.rate < 0 
                            ? "text-red-400 bg-red-500/20"
                            : "text-gray-400 bg-gray-500/20"
                        )}>
                          {formatAPR(rate.rate)}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">N/A</span>
                      )}
                    </td>
                  )
                })}
                
                {/* Strategy */}
                <td className="px-4 py-3 text-xs text-gray-400">
                  Long {opportunity.longExchange || (opportunity as any).bestStrategy?.longExchange || 'N/A'} • Short {opportunity.shortExchange || (opportunity as any).bestStrategy?.shortExchange || 'N/A'}
                </td>
                
                {/* APR */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-bold",
                      opportunity.apr > 100 
                        ? "text-[#00d9ff]" 
                        : opportunity.apr > 50 
                        ? "text-green-400" 
                        : opportunity.apr > 20 
                        ? "text-yellow-400" 
                        : "text-gray-400"
                    )}>
                      {formatAPR(opportunity.apr)}
                    </span>
                    <div className={cn(
                      "px-1.5 py-0.5 rounded text-xs font-medium border",
                      getConfidenceColor(opportunity.confidence)
                    )}>
                      {opportunity.confidence}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}