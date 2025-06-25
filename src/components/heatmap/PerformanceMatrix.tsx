
import { TrendingUp, TrendingDown } from "lucide-react";
import { AssetStrength } from "@/types/asset";
import { getPerformanceColor, formatPerformance, formatPrice } from "@/utils/assetPriceMapping";

interface PerformanceMatrixProps {
  assetData: AssetStrength[];
}

const PerformanceMatrix = ({ assetData }: PerformanceMatrixProps) => {
  return (
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
                  {!asset.price && (
                    <span className="text-gray-500 text-xs">No Data</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceMatrix;
