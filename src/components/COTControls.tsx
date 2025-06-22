
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { getGroupedAssets } from "@/data/assets";

interface COTControlsProps {
  selectedAsset: string;
  setSelectedAsset: (value: string) => void;
  selectedAsset2: string;
  setSelectedAsset2: (value: string) => void;
  comparisonMode: boolean;
  setComparisonMode: (value: boolean) => void;
  chartType: string;
  setChartType: (value: string) => void;
}

const COTControls = ({
  selectedAsset,
  setSelectedAsset,
  selectedAsset2,
  setSelectedAsset2,
  comparisonMode,
  setComparisonMode,
  chartType,
  setChartType
}: COTControlsProps) => {
  const groupedAssets = getGroupedAssets();

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
        <SelectTrigger className="w-64 bg-gray-700 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600 max-h-80">
          {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {category}
              </div>
              {categoryAssets.map((asset) => (
                <SelectItem 
                  key={asset.value} 
                  value={asset.value} 
                  className="text-white hover:bg-gray-600 pl-4"
                >
                  {asset.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={comparisonMode ? "default" : "outline"}
        onClick={() => setComparisonMode(!comparisonMode)}
        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Compare
      </Button>

      {comparisonMode && (
        <Select value={selectedAsset2} onValueChange={setSelectedAsset2}>
          <SelectTrigger className="w-64 bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select second asset" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 max-h-80">
            {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {categoryAssets.map((asset) => (
                  <SelectItem 
                    key={asset.value} 
                    value={asset.value} 
                    className="text-white hover:bg-gray-600 pl-4"
                  >
                    {asset.label}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex gap-2">
        <Button
          variant={chartType === "line" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("line")}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <LineChartIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={chartType === "bar" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("bar")}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
        <Button
          variant={chartType === "pie" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("pie")}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <PieChartIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default COTControls;
