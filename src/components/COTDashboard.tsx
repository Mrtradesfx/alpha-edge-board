
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { generateCOTData, createCombinedData, createPieData } from "@/utils/cotData";
import COTControls from "@/components/COTControls";
import COTCharts from "@/components/COTCharts";
import COTSummaryCards from "@/components/COTSummaryCards";

interface COTDashboardProps {
  preview?: boolean;
}

const COTDashboard = ({ preview = false }: COTDashboardProps) => {
  const [selectedAsset, setSelectedAsset] = useState("EUR");
  const [selectedAsset2, setSelectedAsset2] = useState("");
  const [chartType, setChartType] = useState("line");
  const [comparisonMode, setComparisonMode] = useState(false);

  const cotData = generateCOTData(selectedAsset);
  const cotData2 = generateCOTData(selectedAsset2, 5000);
  const combinedData = createCombinedData(cotData, cotData2);
  const pieData = createPieData(cotData);

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">EUR/USD Net Positions</span>
          <span className="text-green-400">+2,000 contracts</span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cotData.slice(-3)}>
              <Line 
                type="monotone" 
                dataKey="commercial" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="nonCommercial" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="text-white">Commitment of Traders (COT) Reports</CardTitle>
            
            <COTControls
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              selectedAsset2={selectedAsset2}
              setSelectedAsset2={setSelectedAsset2}
              comparisonMode={comparisonMode}
              setComparisonMode={setComparisonMode}
              chartType={chartType}
              setChartType={setChartType}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <COTCharts
                chartType={chartType}
                data={comparisonMode ? combinedData : cotData}
                comparisonMode={comparisonMode}
                selectedAsset={selectedAsset}
                selectedAsset2={selectedAsset2}
                pieData={pieData}
              />
            </ResponsiveContainer>
          </div>
          
          <COTSummaryCards />
        </CardContent>
      </Card>
    </div>
  );
};

export default COTDashboard;
