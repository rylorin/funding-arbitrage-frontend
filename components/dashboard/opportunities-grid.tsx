"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAPR, getColorForValue } from "@/lib/utils/formatters"
import { cn } from "@/lib/utils/cn"
import type { OpportunityData } from "@/types/api"

interface OpportunitiesGridProps {
  opportunities: OpportunityData[]
}

interface OpportunityCardProps {
  opportunity: OpportunityData
}

const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const { token, exchanges, bestStrategy } = opportunity
  
  const longExchange = exchanges[bestStrategy.longExchange]
  const shortExchange = exchanges[bestStrategy.shortExchange]
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'LOW':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getRateColor = (rate: number) => {
    if (rate > 0) return 'text-green-400'
    if (rate < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getAPRColor = (apr: number) => {
    if (apr > 100) return 'text-[#00d9ff]'
    if (apr > 50) return 'text-green-400'
    if (apr > 20) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-all cursor-pointer group">
      {/* Token name */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{token}</h3>
        <div className={cn(
          "px-2 py-1 rounded text-xs font-medium border",
          getConfidenceColor(bestStrategy.confidence)
        )}>
          {bestStrategy.confidence}
        </div>
      </div>
      
      {/* Exchange rates */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 capitalize">
            {bestStrategy.longExchange}
          </span>
          <span className={cn("text-sm font-semibold", getRateColor(longExchange.rate))}>
            {formatAPR(longExchange.rate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 capitalize">
            {bestStrategy.shortExchange}
          </span>
          <span className={cn("text-sm font-semibold", getRateColor(shortExchange.rate))}>
            {formatAPR(shortExchange.rate)}
          </span>
        </div>
      </div>
      
      {/* Strategy description */}
      <p className="text-xs text-gray-500 mb-4">
        Long {bestStrategy.longExchange} • Short {bestStrategy.shortExchange}
      </p>
      
      {/* APR */}
      <div className="flex items-center justify-end">
        <div className={cn("text-2xl font-bold", getAPRColor(bestStrategy.apr))}>
          {formatAPR(bestStrategy.apr)}
        </div>
      </div>
    </div>
  )
}

export const OpportunitiesGrid = ({ opportunities }: OpportunitiesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.token} opportunity={opportunity} />
      ))}
    </div>
  )
}