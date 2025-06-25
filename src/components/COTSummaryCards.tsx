
import { Card, CardContent } from "@/components/ui/card";
import { COTDataPoint } from "@/hooks/useRealCOTData";

interface COTSummaryCardsProps {
  data: COTDataPoint[];
  selectedAsset: string;
}

const COTSummaryCards = ({ data, selectedAsset }: COTSummaryCardsProps) => {
  // Get the latest data point
  const latestData = data && data.length > 0 ? data[data.length - 1] : null;
  
  // Get previous week data for comparison
  const previousData = data && data.length > 1 ? data[data.length - 2] : null;
  
  // Calculate changes
  const commercialChange = latestData && previousData 
    ? latestData.commercial - previousData.commercial 
    : 0;
  
  const nonCommercialChange = latestData && previousData 
    ? latestData.nonCommercial - previousData.nonCommercial 
    : 0;

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getChangePrefix = (change: number) => {
    if (change > 0) return "+";
    return "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Commercial Net</div>
          <div className="text-2xl font-bold text-green-400">
            {latestData ? formatNumber(latestData.commercial) : "--"}
          </div>
          <div className="text-xs text-gray-500">contracts</div>
          {previousData && (
            <div className={`text-xs mt-1 ${getChangeColor(commercialChange)}`}>
              {getChangePrefix(commercialChange)}{formatNumber(commercialChange)} from last week
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Non-Commercial Net</div>
          <div className="text-2xl font-bold text-orange-400">
            {latestData ? formatNumber(latestData.nonCommercial) : "--"}
          </div>
          <div className="text-xs text-gray-500">contracts</div>
          {previousData && (
            <div className={`text-xs mt-1 ${getChangeColor(nonCommercialChange)}`}>
              {getChangePrefix(nonCommercialChange)}{formatNumber(nonCommercialChange)} from last week
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-700/50 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">Open Interest</div>
          <div className="text-2xl font-bold text-blue-400">
            {latestData && latestData.total ? formatNumber(latestData.total) : "--"}
          </div>
          <div className="text-xs text-gray-500">contracts</div>
          <div className="text-xs text-gray-400 mt-1">
            Latest: {latestData?.date || "No data"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default COTSummaryCards;
