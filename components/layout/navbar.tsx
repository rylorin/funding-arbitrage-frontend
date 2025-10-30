"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils/formatters";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  wsConnectionStatus?: "connected" | "disconnected" | "connecting";
  onRefresh?: () => void;
  stats?: {
    totalPairs: number;
    maxAPR: number;
    lastUpdate: Date;
  };
}

export function Navbar({ wsConnectionStatus = "disconnected", onRefresh, stats }: NavbarProps) {
  const [isWalletConnected, _setIsWalletConnected] = useState(false);
  const [walletAddress, _setWalletAddress] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Fix hydration mismatch by setting time on client side only
  useEffect(() => {
    setCurrentTime(new Date());

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const defaultStats = {
    totalPairs: 278,
    maxAPR: 367.0,
    lastUpdate: currentTime ? formatTime(currentTime) : "--:--",
  };

  const displayStats = stats || defaultStats;

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
              <span className="text-gray-300">{displayStats.totalPairs} pairs</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">max APR</span>
              <span className="text-[#00d9ff] font-semibold">{displayStats.maxAPR.toFixed(1)}%</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">
                updated{" "}
                {typeof displayStats.lastUpdate === "string"
                  ? displayStats.lastUpdate
                  : formatTime(displayStats.lastUpdate)}
              </span>
            </div>
          </div>

          {/* Right: Live indicator/Refresh + Wallet */}
          <div className="flex items-center space-x-4">
            {wsConnectionStatus === "connected" ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#00d9ff] animate-pulse"></div>
                <span className="text-xs font-medium text-[#00d9ff]">Live</span>
              </div>
            ) : wsConnectionStatus === "connecting" ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="text-xs font-medium text-yellow-400">Connecting</span>
              </div>
            ) : (
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-500 px-3 py-1.5 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Refresh
              </Button>
            )}

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
  );
}
