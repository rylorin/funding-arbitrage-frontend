"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EXCHANGES, TIMEFRAMES } from "@/lib/utils/constants"
import { cn } from "@/lib/utils/cn"
import { X } from "lucide-react"

interface ExchangeFiltersProps {
  selectedTimeframe: string
  onTimeframeChange: (timeframe: string) => void
  selectedExchanges: string[]
  onExchangesChange: (exchanges: string[]) => void
}

export const ExchangeFilters = ({
  selectedTimeframe,
  onTimeframeChange,
  selectedExchanges,
  onExchangesChange,
}: ExchangeFiltersProps) => {
  const toggleExchange = (exchangeId: string) => {
    if (selectedExchanges.includes(exchangeId)) {
      onExchangesChange(selectedExchanges.filter(id => id !== exchangeId))
    } else {
      onExchangesChange([...selectedExchanges, exchangeId])
    }
  }

  const removeExchange = (exchangeId: string) => {
    onExchangesChange(selectedExchanges.filter(id => id !== exchangeId))
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Timeframe Selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">Timeframe:</span>
          <div className="flex gap-1">
            {Object.entries(TIMEFRAMES).map(([key, timeframe]) => (
              <button
                key={key}
                onClick={() => onTimeframeChange(timeframe.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded transition-all",
                  selectedTimeframe === timeframe.id
                    ? "bg-[#00d9ff] text-black"
                    : "bg-[#21262d] text-gray-300 hover:bg-[#30363d] border border-[#30363d]"
                )}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange Selection */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-300">Exchanges:</span>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(EXCHANGES).map(([key, exchange]) => {
              const isSelected = selectedExchanges.includes(exchange.id)
              return (
                <button
                  key={key}
                  onClick={() => toggleExchange(exchange.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded transition-all",
                    isSelected
                      ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30"
                      : "bg-[#21262d] text-gray-400 hover:bg-[#30363d] border border-[#30363d]"
                  )}
                >
                  {exchange.displayName}
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeExchange(exchange.id)
                      }}
                      className="ml-1 hover:text-red-400"
                    >
                      <X size={10} />
                    </button>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}