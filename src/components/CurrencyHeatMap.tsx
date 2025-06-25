
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw, Wifi, WifiOff, Globe } from "lucide-react";
import { assets } from "@/data/assets";
import { useRealTimeAssetData } from "@/hooks/useRealTimeData";
import { usePriceData } from "@/hooks/usePriceData";
import { AssetStrength, CurrencyHeatMapProps } from "@/types/asset";
import { getPriceDataKey, generateTimeframeData } from "@/utils/assetPriceMapping";
import PerformanceMatrix from "@/components/heatmap/PerformanceMatrix";
import HeatMapLegend from "@/components/heatmap/HeatMapLegend";
import HeatMapPreview from "@/components/heatmap/HeatMapPreview";

const CurrencyHeatMap = ({ preview = false }: CurrencyHeatMapProps) => {
  const { data: liveData, isLoading, isConnected, error, refetch } = useRealTimeAssetData();
  const { priceData, isRealData, isLoading: pricesLoading, refetch: refetchPrices } = usePriceData();

  // Combine asset data with price data and timeframe data
  const assetData: AssetStrength[] = liveData?.length > 0 ? liveData : assets.map(asset => {
    const priceKey = getPriceDataKey(asset.value);
    const priceInfo = priceKey ? priceData[priceKey] : null;
    
    return {
      asset: asset.label, // Use the label (e.g., "EUR/USD") for display
      name: asset.label,
      strength: Math.floor(Math.random() * 100),
      change: (Math.random() - 0.5) * 6,
      category: asset.category,
      price: priceInfo?.price,
      priceChange: priceInfo?.change24h,
      timeframes: generateTimeframeData()
    };
  });

  if (preview) {
    return <HeatMapPreview assetData={assetData} isConnected={isConnected} isRealData={isRealData} />;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Asset Performance Matrix</CardTitle>
            <Badge variant={isRealData ? "default" : isConnected ? "secondary" : "destructive"} className="text-xs">
              {isRealData ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Real Data
                </>
              ) : isConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Mock Data
                </>
              )}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetchPrices}
              disabled={pricesLoading}
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 ${pricesLoading ? 'animate-spin' : ''}`} />
            </Button>
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
        </div>
        <p className="text-sm text-gray-400">
          Performance across multiple timeframes for all tradeable assets
          {isRealData && <span className="text-blue-400 block">✓ Using real market data from Yahoo Finance</span>}
          {error && <span className="text-red-400 block">Error: {error}</span>}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PerformanceMatrix assetData={assetData} />
          <HeatMapLegend assetData={assetData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyHeatMap;
