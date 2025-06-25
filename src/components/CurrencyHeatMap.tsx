
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
}

interface CurrencyHeatMapProps {
  preview?: boolean;
}

const CurrencyHeatMap = ({ preview = false }: CurrencyHeatMapProps) => {
  const { data: liveData, isLoading, isConnected, error, refetch } = useRealTimeAssetData();
  const { priceData } = usePriceData();
  
  // Combine asset data with price data
  const assetData: AssetStrength[] = liveData?.length > 0 ? liveData : assets.map(asset => {
    const priceInfo = priceData[asset.value];
    return {
      asset: asset.value,
      name: asset.label,
      strength: Math.floor(Math.random() * 100),
      change: (Math.random() - 0.5) * 6,
      category: asset.category,
      price: priceInfo?.price,
      priceChange: priceInfo?.change24h
    };
  });

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 70) return "bg-green-400";
    if (strength >= 60) return "bg-yellow-400";
    if (strength >= 50) return "bg-orange-400";
    return "bg-red-500";
  };

  const getStrengthOpacity = (strength: number) => {
    return Math.max(0.3, strength / 100);
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

  // Group assets by category
  const groupedAssets = assetData.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, AssetStrength[]>);

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {assetData.slice(0, 4).map((asset) => (
            <div
              key={asset.asset}
              className={`${getStrengthColor(asset.strength)} rounded p-2 text-white text-center`}
              style={{ opacity: getStrengthOpacity(asset.strength) }}
            >
              <div className="font-bold text-sm">{asset.asset}</div>
              <div className="text-xs">{asset.strength}</div>
              {asset.price && (
                <div className="text-xs mt-1">${formatPrice(asset.price, asset.asset)}</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Asset Strength & Prices</span>
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
            <CardTitle className="text-white">Heat Map with Live Prices</CardTitle>
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
          Real-time relative strength and current prices of all tradeable assets
          {error && <span className="text-red-400 block">Error: {error}</span>}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Asset Categories */}
          {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-xs text-gray-400">{categoryAssets.length} assets</span>
              </div>

              {/* Category Heat Map Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {categoryAssets.map((asset) => (
                  <div
                    key={asset.asset}
                    className={`${getStrengthColor(asset.strength)} rounded-lg p-3 text-white relative overflow-hidden transition-all duration-300 hover:scale-105`}
                    style={{ opacity: getStrengthOpacity(asset.strength) }}
                  >
                    <div className="relative z-10">
                      <div className="font-bold text-sm mb-1">{asset.asset}</div>
                      <div className="text-xs opacity-90 mb-2 truncate">{asset.name}</div>
                      
                      {/* Price Information */}
                      {asset.price && (
                        <div className="bg-black/20 rounded px-2 py-1 mb-2">
                          <div className="text-xs font-semibold">${formatPrice(asset.price, asset.asset)}</div>
                          {asset.priceChange !== undefined && (
                            <div className={`text-xs flex items-center gap-1 ${asset.priceChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                              {asset.priceChange >= 0 ? (
                                <TrendingUp className="w-2 h-2" />
                              ) : (
                                <TrendingDown className="w-2 h-2" />
                              )}
                              {asset.priceChange >= 0 ? "+" : ""}{asset.priceChange.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="font-semibold text-lg">Strength: {asset.strength}</div>
                      <div className="flex items-center gap-1 text-xs">
                        {asset.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className={asset.change >= 0 ? "text-green-200" : "text-red-200"}>
                          {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {/* Background pattern for visual interest */}
                    <div className="absolute top-0 right-0 w-6 h-6 bg-white opacity-10 rounded-full transform translate-x-1 -translate-y-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
            <div className="text-sm font-semibold text-gray-300">Strength Scale</div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Weak (0-49)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span>Fair (50-59)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Good (60-69)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Strong (70-79)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Very Strong (80+)</span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-3">Top Performers</div>
            <div className="grid grid-cols-3 gap-4">
              {assetData
                .sort((a, b) => b.change - a.change)
                .slice(0, 3)
                .map((asset, index) => (
                  <div key={asset.asset} className="text-center">
                    <div className="text-lg font-bold text-white">{asset.asset}</div>
                    <div className="text-xs text-gray-400 truncate">{asset.name}</div>
                    <div className="text-green-400 font-semibold">+{asset.change.toFixed(1)}%</div>
                    {index === 0 && <div className="text-xs text-yellow-400 mt-1">🏆 Best</div>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyHeatMap;
