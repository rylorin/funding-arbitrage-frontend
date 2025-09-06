"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils/formatters"

interface NavbarProps {
  wsConnectionStatus?: 'connected' | 'disconnected' | 'connecting'
}

export function Navbar({ wsConnectionStatus = 'disconnected' }: NavbarProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  
  // Fix hydration mismatch by setting time on client side only
  useEffect(() => {
    setCurrentTime(new Date())
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  const stats = {
    totalPairs: 278,
    maxAPR: 367.0,
    lastUpdate: currentTime ? formatTime(currentTime) : '--:--',
  }

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked")
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="w-full border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Stats */}
          <div className="flex items-center space-x-8">
            <div className="font-semibold text-lg">
              <span className="text-[#00d9ff]">Funding</span>
              <span className="text-white ml-1">Arbitrage</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-3 text-sm">
              <span className="text-gray-300">{stats.totalPairs} pairs</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">max APR</span>
              <span className="text-[#00d9ff] font-semibold">{stats.maxAPR}%</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">updated {stats.lastUpdate}</span>
            </div>
          </div>
          
          {/* Right: Live indicator + Wallet */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                wsConnectionStatus === 'connected' ? 'bg-[#00d9ff] animate-pulse' :
                wsConnectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className={`text-xs font-medium ${
                wsConnectionStatus === 'connected' ? 'text-[#00d9ff]' :
                wsConnectionStatus === 'connecting' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {wsConnectionStatus === 'connected' ? 'Live' :
                 wsConnectionStatus === 'connecting' ? 'Connecting' :
                 'Offline'}
              </span>
            </div>
            
            {isWalletConnected && walletAddress ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md">
                <div className="w-2 h-2 bg-[#00d9ff] rounded-full"></div>
                <span className="text-sm text-gray-300">{formatAddress(walletAddress)}</span>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-transparent border border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:border-[#00d9ff]/50 px-4 py-2 text-sm"
                variant="outline"
                size="sm"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}