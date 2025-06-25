
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { assets } from "@/data/assets";
import { useRealTimeAssetData } from "@/hooks/useRealTimeData";
import { usePriceData } from "@/hooks/usePriceData";

interface AssetStrength {
  asset: string;
  name: string;
  strength: number;
  change: number;
  category: string;
  price?: number;
  priceChange?: number;
  timeframes?: {
    M1: number;
    M5: number;
    M15: number;
    M30: number;
    H1: number;
    H4: number;
    D1: number;
    W1: number;
    MN: number;
  };
}

interface CurrencyHeatMapProps {
  preview?: boolean;
}

const CurrencyHeatMap = ({ preview = false }: CurrencyHeatMapProps) => {
  const { data: liveData, isLoading, isConnected, error, refetch } = useRealTimeAssetData();
  const { priceData } = usePriceData();
  
  // Generate timeframe data for each asset
  const generateTimeframeData = (): {
    M1: number;
    M5: number;
    M15: number;
    M30: number;
    H1: number;
    H4: number;
    D1: number;
    W1: number;
    MN: number;
  } => {
    return {
      M1: (Math.random() - 0.5) * 4,   // -2% to +2%
      M5: (Math.random() - 0.5) * 6,   // -3% to +3%
      M15: (Math.random() - 0.5) * 8,  // -4% to +4%
      M30: (Math.random() - 0.5) * 10, // -5% to +5%
      H1: (Math.random() - 0.5) * 12,  // -6% to +6%
      H4: (Math.random() - 0.5) * 16,  // -8% to +8%
      D1: (Math.random() - 0.5) * 20,  // -10% to +10%
      W1: (Math.random() - 0.5) * 30,  // -15% to +15%
      MN: (Math.random() - 0.5) * 50   // -25% to +25%
    };
  };

  // Combine asset data with price data and timeframe data
  const assetData: AssetStrength[] = liveData?.length > 0 ? liveData : assets.map(asset => {
    const priceInfo = priceData[asset.value];
    return {
      asset: asset.value,
      name: asset.label,
      strength: Math.floor(Math.random() * 100),
      change: (Math.random() - 0.5) * 6,
      category: asset.category,
      price: priceInfo?.price,
      priceChange: priceInfo?.change24h,
      timeframes: generateTimeframeData()
    };
  });

  const getPerformanceColor = (value: number) => {
    if (value >= 5) return "bg-green-600 text-white";
    if (value >= 2) return "bg-green-500 text-white";
    if (value >= 0.5) return "bg-green-400 text-white";
    if (value >= -0.5) return "bg-yellow-400 text-black";
    if (value >= -2) return "bg-orange-500 text-white";
    if (value >= -5) return "bg-red-500 text-white";
    return "bg-red-600 text-white";
  };

  const formatPerformance = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  };

  const formatPrice = (price: number | undefined, asset: string) => {
    if (!price) return "N/A";
    
    if (asset.includes('/')) {
      return price.toFixed(4);
    } else if (asset === 'BTC' || asset === 'ETH') {
      return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else if (asset === 'GOLD' || asset === 'SILVER') {
      return price.toFixed(2);
    } else {
      return price.toFixed(2);
    }
  };

  const strongPerformers = assetData.filter(a => (a.timeframes?.D1 || 0) > 2).length;
  const neutralPerformers = assetData.filter(a => Math.abs(a.timeframes?.D1 || 0) <= 2).length;
  const weakPerformers = assetData.filter(a => (a.timeframes?.D1 || 0) < -2).length;

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-1 px-2 text-gray-300">PAIR</th>
                <th className="text-center py-1 px-1 text-gray-300">M1</th>
                <th className="text-center py-1 px-1 text-gray-300">H1</th>
                <th className="text-center py-1 px-1 text-gray-300">D1</th>
              </tr>
            </thead>
            <tbody>
              {assetData.slice(0, 4).map((asset) => (
                <tr key={asset.asset} className="border-b border-gray-700">
                  <td className="py-1 px-2 text-white font-mono">{asset.asset}</td>
                  <td className={`py-1 px-1 text-center text-xs ${getPerformanceColor(asset.timeframes?.M1 || 0)}`}>
                    {formatPerformance(asset.timeframes?.M1 || 0)}
                  </td>
                  <td className={`py-1 px-1 text-center text-xs ${getPerformanceColor(asset.timeframes?.H1 || 0)}`}>
                    {formatPerformance(asset.timeframes?.H1 || 0)}
                  </td>
                  <td className={`py-1 px-1 text-center text-xs ${getPerformanceColor(asset.timeframes?.D1 || 0)}`}>
                    {formatPerformance(asset.timeframes?.D1 || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Performance Matrix</span>
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Asset Performance Matrix</CardTitle>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Performance across multiple timeframes for all tradeable assets
          {error && <span className="text-red-400 block">Error: {error}</span>}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Performance Matrix Table */}
          <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">PAIR</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">M1</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">M5</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">M15</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">M30</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">H1</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">H4</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">D1</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">W1</th>
                  <th className="text-center py-3 px-2 text-gray-300 font-semibold min-w-[60px]">MN</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {assetData.map((asset, index) => (
                  <tr 
                    key={asset.asset} 
                    className={`border-b border-gray-700 hover:bg-gray-800/30 ${
                      index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-mono font-semibold">{asset.asset}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[120px]">{asset.name}</span>
                      </div>
                    </td>
                    {['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'].map(timeframe => (
                      <td 
                        key={timeframe}
                        className={`py-3 px-2 text-center font-mono text-xs ${
                          getPerformanceColor(asset.timeframes?.[timeframe as keyof typeof asset.timeframes] || 0)
                        } rounded-sm mx-1`}
                      >
                        {formatPerformance(asset.timeframes?.[timeframe as keyof typeof asset.timeframes] || 0)}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center">
                        {asset.price && (
                          <>
                            <span className="text-white font-mono text-sm">
                              ${formatPrice(asset.price, asset.asset)}
                            </span>
                            {asset.priceChange !== undefined && (
                              <div className={`text-xs flex items-center gap-1 ${
                                asset.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {asset.priceChange >= 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                {asset.priceChange >= 0 ? "+" : ""}{asset.priceChange.toFixed(2)}%
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
            <div className="text-sm font-semibold text-gray-300">Performance Color Scale</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-gray-400">&lt; -5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-400">-5% to -2%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-gray-400">-2% to -0.5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-gray-400">-0.5% to +0.5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-gray-400">+0.5% to +2%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-gray-400">&gt; +5%</span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-700/30 rounded-lg p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {strongPerformers}
              </div>
              <div className="text-xs text-gray-400">Strong Performers (D1 &gt; +2%)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">
                {neutralPerformers}
              </div>
              <div className="text-xs text-gray-400">Neutral (D1 ±2%)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                {weakPerformers}
              </div>
              <div className="text-xs text-gray-400">Weak Performers (D1 &lt; -2%)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyHeatMap;
