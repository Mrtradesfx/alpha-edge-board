
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { generateCOTData, createPieData } from "@/utils/cotData";
import { getAssetLabel } from "@/data/assets";
import COTControls from "@/components/COTControls";
import COTCharts from "@/components/COTCharts";
import COTSummaryCards from "@/components/COTSummaryCards";
import { useRealCOTData, useRealCOTComparison } from "@/hooks/useRealCOTData";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface COTDashboardProps {
  preview?: boolean;
}

const COTDashboard = ({ preview = false }: COTDashboardProps) => {
  const [selectedAsset, setSelectedAsset] = useState("EUR");
  const [selectedAsset2, setSelectedAsset2] = useState("");
  const [chartType, setChartType] = useState("line");
  const [comparisonMode, setComparisonMode] = useState(false);

  // Use real COT data hooks
  const { 
    data: realCOTData, 
    isLoading: isLoadingPrimary, 
    error: primaryError, 
    lastUpdated,
    refreshData 
  } = useRealCOTData(selectedAsset);

  const { 
    data: comparisonData, 
    isLoading: isLoadingComparison, 
    error: comparisonError 
  } = useRealCOTComparison(selectedAsset, selectedAsset2);

  // Fallback to mock data if real data is not available
  const cotData = realCOTData.length > 0 ? realCOTData : generateCOTData(selectedAsset);
  const combinedData = comparisonMode && comparisonData.length > 0 ? comparisonData : createCombinedData(cotData, generateCOTData(selectedAsset2, 5000));
  const pieData = createPieData(cotData);

  const isLoading = isLoadingPrimary || (comparisonMode && isLoadingComparison);
  const hasError = primaryError || (comparisonMode && comparisonError);
  const usingRealData = realCOTData.length > 0;

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Commitment of Traders (COT) Reports</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4" />
                  <span className={usingRealData ? "text-green-400" : "text-yellow-400"}>
                    {usingRealData ? "Live CFTC Data" : "Mock Data"}
                  </span>
                  {usingRealData ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {hasError && (
              <Alert className="bg-red-900/20 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  <div className="font-semibold mb-1">Data Loading Issue</div>
                  <div className="text-sm">{primaryError || comparisonError}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {usingRealData ? 'Using cached data.' : 'Using mock data for demonstration.'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!usingRealData && !hasError && (
              <Alert className="bg-yellow-900/20 border-yellow-500/30">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-yellow-400">
                  <div className="font-semibold mb-1">Mock Data Mode</div>
                  <div className="text-sm">
                    COT data is currently simulated for demonstration purposes. 
                    Click refresh to attempt loading real CFTC data.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {lastUpdated && (
              <div className="text-xs text-gray-400">
                Data last updated: {lastUpdated.toLocaleString()}
              </div>
            )}
            
            {/* Prominent Asset Display */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Currently Analyzing</div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                  <div className="text-green-400 font-semibold text-lg">
                    {getAssetLabel(selectedAsset)}
                  </div>
                  <div className="text-xs text-green-300">Primary Asset</div>
                </div>
                {comparisonMode && selectedAsset2 && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                    <div className="text-blue-400 font-semibold text-lg">
                      {getAssetLabel(selectedAsset2)}
                    </div>
                    <div className="text-xs text-blue-300">Comparison Asset</div>
                  </div>
                )}
              </div>
            </div>
            
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
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">Loading COT data...</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {usingRealData ? 'Fetching from CFTC database...' : 'Preparing demonstration data...'}
                  </p>
                </div>
              </div>
            ) : (
              <COTCharts
                chartType={chartType}
                data={comparisonMode ? combinedData : cotData}
                comparisonMode={comparisonMode}
                selectedAsset={selectedAsset}
                selectedAsset2={selectedAsset2}
                pieData={pieData}
              />
            )}
          </div>
          
          <COTSummaryCards />
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for creating combined data (fallback)
function createCombinedData(data1: any[], data2: any[]) {
  return data1.map((item, index) => ({
    ...item,
    commercial2: data2[index]?.commercial || 0,
    nonCommercial2: data2[index]?.nonCommercial || 0,
  }));
}

export default COTDashboard;
