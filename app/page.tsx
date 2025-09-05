"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { OpportunitiesGrid } from "@/components/dashboard/opportunities-grid"
import { DetailedTable } from "@/components/dashboard/detailed-table"
import { ExchangeFilters } from "@/components/dashboard/exchange-filters"
import { mockOpportunities, getAllMockOpportunities } from "@/lib/utils/mockData"
import type { OpportunityData } from "@/types/api"

export default function Dashboard() {
  const [topOpportunities, setTopOpportunities] = useState<OpportunityData[]>([])
  const [allOpportunities, setAllOpportunities] = useState<OpportunityData[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<OpportunityData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([
    'vest', 'extended', 'hyperliquid', 'orderly'
  ])

  useEffect(() => {
    // Initialize data
    const top4 = mockOpportunities.slice(0, 4)
    const allData = getAllMockOpportunities()
    
    setTopOpportunities(top4)
    setAllOpportunities(allData)
    setFilteredOpportunities(allData)
  }, [])

  useEffect(() => {
    // Filter opportunities based on selected exchanges
    const filtered = allOpportunities.filter(opportunity => {
      // Check if opportunity has data for any of the selected exchanges
      return selectedExchanges.some(exchangeId => 
        opportunity.exchanges[exchangeId]?.isActive
      )
    })
    setFilteredOpportunities(filtered)
  }, [allOpportunities, selectedExchanges])

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Top Opportunities Grid */}
        <section>
          <OpportunitiesGrid opportunities={topOpportunities} />
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
          <DetailedTable 
            opportunities={filteredOpportunities}
            selectedExchanges={selectedExchanges}
          />
        </section>
      </main>
    </div>
  )
}