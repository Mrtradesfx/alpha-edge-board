
import { Wifi, WifiOff, Globe } from "lucide-react";
import { AssetStrength } from "@/types/asset";
import { getPerformanceColor, formatPerformance } from "@/utils/assetPriceMapping";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeatMapPreviewProps {
  assetData: AssetStrength[];
  isConnected: boolean;
  isRealData: boolean;
}

const HeatMapPreview = ({ assetData, isConnected, isRealData }: HeatMapPreviewProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-2 sm:px-3 text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm">
                PAIR
              </th>
              {!isMobile && (
                <th className="text-center py-2 px-1 sm:px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">
                  M1
                </th>
              )}
              <th className="text-center py-2 px-1 sm:px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">
                H1
              </th>
              <th className="text-center py-2 px-1 sm:px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">
                D1
              </th>
              {!isMobile && (
                <th className="text-center py-2 px-1 sm:px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">
                  W1
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {assetData.slice(0, isMobile ? 6 : 4).map((asset) => (
              <tr key={asset.asset} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-2 px-2 sm:px-3 text-gray-900 dark:text-white font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                  {asset.asset}
                </td>
                {!isMobile && (
                  <td className={`py-1 px-1 text-center text-xs font-medium rounded ${getPerformanceColor(asset.timeframes?.M1 || 0)}`}>
                    {formatPerformance(asset.timeframes?.M1 || 0)}
                  </td>
                )}
                <td className={`py-1 px-1 text-center text-xs font-medium rounded ${getPerformanceColor(asset.timeframes?.H1 || 0)}`}>
                  {formatPerformance(asset.timeframes?.H1 || 0)}
                </td>
                <td className={`py-1 px-1 text-center text-xs font-medium rounded ${getPerformanceColor(asset.timeframes?.D1 || 0)}`}>
                  {formatPerformance(asset.timeframes?.D1 || 0)}
                </td>
                {!isMobile && (
                  <td className={`py-1 px-1 text-center text-xs font-medium rounded ${getPerformanceColor(asset.timeframes?.W1 || 0)}`}>
                    {formatPerformance(asset.timeframes?.W1 || 0)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Performance Matrix</span>
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
