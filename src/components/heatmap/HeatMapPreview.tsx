
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
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">PAIR</th>
              <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">M1</th>
              <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">H1</th>
              <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">D1</th>
            </tr>
          </thead>
          <tbody>
            {assetData.slice(0, 4).map((asset) => (
              <tr key={asset.asset} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-2 px-3 text-gray-900 dark:text-white font-medium">{asset.asset}</td>
                <td className={`py-2 px-2 text-center text-sm font-medium ${getPerformanceColor(asset.timeframes?.M1 || 0)}`}>
                  {formatPerformance(asset.timeframes?.M1 || 0)}
                </td>
                <td className={`py-2 px-2 text-center text-sm font-medium ${getPerformanceColor(asset.timeframes?.H1 || 0)}`}>
                  {formatPerformance(asset.timeframes?.H1 || 0)}
                </td>
                <td className={`py-2 px-2 text-center text-sm font-medium ${getPerformanceColor(asset.timeframes?.D1 || 0)}`}>
                  {formatPerformance(asset.timeframes?.D1 || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Performance Matrix</span>
        <div className="flex items-center gap-2">
          {isRealData ? (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Globe className="w-3 h-3" />
              <span className="text-xs">Real Data</span>
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Wifi className="w-3 h-3" />
              <span className="text-xs">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <WifiOff className="w-3 h-3" />
              <span className="text-xs">Offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeatMapPreview;
