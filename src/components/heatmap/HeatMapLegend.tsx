
import { AssetStrength } from "@/types/asset";

interface HeatMapLegendProps {
  assetData: AssetStrength[];
}

const HeatMapLegend = ({ assetData }: HeatMapLegendProps) => {
  const strongPerformers = assetData.filter(a => (a.timeframes?.D1 || 0) > 2).length;
  const neutralPerformers = assetData.filter(a => Math.abs(a.timeframes?.D1 || 0) <= 2).length;
  const weakPerformers = assetData.filter(a => (a.timeframes?.D1 || 0) < -2).length;

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
      {/* Performance Color Scale */}
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
  );
};

export default HeatMapLegend;
