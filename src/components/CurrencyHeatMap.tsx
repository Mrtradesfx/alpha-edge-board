
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      asset: asset.label,
      name: asset.label,
      strength: Math.floor(Math.random() * 100),
      change: (Math.random() - 0.5) * 6,
      category: asset.category,
      price: priceInfo?.price,
      priceChange: priceInfo?.change24h,
      timeframes: generateTimeframeData()
    };
  });

  // Filter assets by category
  const forexAssets = assetData.filter(asset => 
    asset.category === "Major Currencies" || asset.category === "Cross Currencies" || asset.category === "Exotic Currencies"
  );
  
  const commodityAssets = assetData.filter(asset => asset.category === "Commodities");
  
  const indexAssets = assetData.filter(asset => asset.category === "Indices");
  
  const cryptoAssets = assetData.filter(asset => asset.category === "Cryptocurrencies");

  if (preview) {
    return <HeatMapPreview assetData={assetData} isConnected={isConnected} isRealData={isRealData} />;
  }

  const renderMatrixContent = (filteredAssets: AssetStrength[], categoryName: string) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-400">
          {categoryName} performance across multiple timeframes
          {isRealData && <span className="text-blue-400 block">✓ Using real market data from Yahoo Finance</span>}
          {error && <span className="text-red-400 block">Error: {error}</span>}
        </p>
        <div className="flex gap-2 justify-end">
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
      <PerformanceMatrix assetData={filteredAssets} />
      <HeatMapLegend assetData={filteredAssets} />
    </div>
  );

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white text-lg sm:text-xl">Asset Performance Matrix</CardTitle>
          </div>
          <Badge variant={isRealData ? "default" : isConnected ? "secondary" : "destructive"} className="text-xs w-fit">
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
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <Tabs defaultValue="forex" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700/50 mb-6 h-auto">
            <TabsTrigger 
              value="forex" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs sm:text-sm py-2 px-1 sm:px-3"
            >
              Forex
            </TabsTrigger>
            <TabsTrigger 
              value="commodities" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs sm:text-sm py-2 px-1 sm:px-3"
            >
              Commodities
            </TabsTrigger>
            <TabsTrigger 
              value="indices" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs sm:text-sm py-2 px-1 sm:px-3"
            >
              Indices
            </TabsTrigger>
            <TabsTrigger 
              value="crypto" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs sm:text-sm py-2 px-1 sm:px-3"
            >
              Crypto
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forex" className="mt-0">
            {renderMatrixContent(forexAssets, "Forex")}
          </TabsContent>
          
          <TabsContent value="commodities" className="mt-0">
            {renderMatrixContent(commodityAssets, "Commodities")}
          </TabsContent>
          
          <TabsContent value="indices" className="mt-0">
            {renderMatrixContent(indexAssets, "Indices")}
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-0">
            {renderMatrixContent(cryptoAssets, "Crypto")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrencyHeatMap;
