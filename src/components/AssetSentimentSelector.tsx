
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { assets } from "@/data/assets";

interface AssetSentiment {
  asset: string;
  name: string;
  sentiment_score: number;
  trend: string;
  change: number;
  sources: {
    name: string;
    value: number;
    color: string;
  }[];
}

const AssetSentimentSelector = () => {
  const [selectedAsset, setSelectedAsset] = useState("EUR/USD");
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock sentiment data for the selected asset
  const generateAssetSentiment = (assetValue: string): AssetSentiment => {
    const baseScore = 45 + Math.random() * 40; // 45-85 range
    const change = (Math.random() - 0.5) * 8; // -4 to +4 change
    
    return {
      asset: assetValue,
      name: assets.find(a => a.value === assetValue)?.label || assetValue,
      sentiment_score: Math.round(baseScore),
      trend: baseScore > 60 ? "bullish" : baseScore > 40 ? "neutral" : "bearish",
      change: Math.round(change * 10) / 10,
      sources: [
        { name: "Technical Analysis", value: Math.round(baseScore + (Math.random() - 0.5) * 20), color: "#10b981" },
        { name: "Market News", value: Math.round(baseScore + (Math.random() - 0.5) * 15), color: "#3b82f6" },
        { name: "Social Sentiment", value: Math.round(baseScore + (Math.random() - 0.5) * 25), color: "#8b5cf6" },
        { name: "Expert Analysis", value: Math.round(baseScore + (Math.random() - 0.5) * 18), color: "#f59e0b" }
      ].map(source => ({ ...source, value: Math.max(10, Math.min(95, source.value)) }))
    };
  };

  const assetSentiment = generateAssetSentiment(selectedAsset);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Bullish";
    if (score >= 50) return "Neutral";
    return "Bearish";
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <CardTitle className="text-white">Asset Sentiment Analysis</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Select Asset</label>
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {assets.map((asset) => (
                <SelectItem key={asset.value} value={asset.value} className="text-white hover:bg-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{asset.value}</span>
                    <span className="text-gray-400">- {asset.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Asset Display */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="text-sm text-gray-400 mb-2">Currently Analyzing</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-white">{selectedAsset}</div>
            <Badge variant="outline" className="text-gray-300 border-gray-500">
              {assetSentiment.name}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Sentiment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Overall Sentiment</h3>
            <div className="text-center space-y-4">
              <div className={`text-5xl font-bold ${getSentimentColor(assetSentiment.sentiment_score)}`}>
                {assetSentiment.sentiment_score}%
              </div>
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 ${
                  assetSentiment.sentiment_score >= 70 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : assetSentiment.sentiment_score >= 50
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {getSentimentLabel(assetSentiment.sentiment_score)}
              </Badge>
              <div className="flex items-center justify-center gap-2">
                {assetSentiment.change > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={assetSentiment.change > 0 ? "text-green-400" : "text-red-400"}>
                  {assetSentiment.change > 0 ? "+" : ""}{assetSentiment.change}% from yesterday
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment by Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Sentiment by Source</h3>
            <div className="space-y-3">
              {assetSentiment.sources.map((source) => (
                <div key={source.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{source.name}</span>
                    <span className={`font-mono ${getSentimentColor(source.value)}`}>
                      {source.value}%
                    </span>
                  </div>
                  <Progress 
                    value={source.value} 
                    className="h-2"
                    style={{ 
                      backgroundColor: '#374151',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetSentimentSelector;
