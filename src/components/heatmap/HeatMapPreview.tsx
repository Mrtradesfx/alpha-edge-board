
import { Wifi, WifiOff, Globe } from "lucide-react";
import { AssetStrength } from "@/types/asset";
import { getPerformanceColor, formatPerformance } from "@/utils/assetPriceMapping";

interface HeatMapPreviewProps {
  assetData: AssetStrength[];
  isConnected: boolean;
  isRealData: boolean;
}

const HeatMapPreview = ({ assetData, isConnected, isRealData }: HeatMapPreviewProps) => {
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
          {isRealData ? (
            <Globe className="w-3 h-3 text-blue-400" />
          ) : isConnected ? (
            <Wifi className="w-3 h-3 text-green-400" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeatMapPreview;
