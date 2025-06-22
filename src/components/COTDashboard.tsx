
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

interface COTDashboardProps {
  preview?: boolean;
}

const COTDashboard = ({ preview = false }: COTDashboardProps) => {
  const [selectedAsset, setSelectedAsset] = useState("EUR");
  const [selectedAsset2, setSelectedAsset2] = useState("");
  const [chartType, setChartType] = useState("line");
  const [comparisonMode, setComparisonMode] = useState(false);

  // Mock COT data - in real app, this would come from Quandl API
  const generateCOTData = (asset: string, offset = 0) => [
    { date: "2024-01-01", commercial: 45000 + offset, nonCommercial: -42000 + offset, total: 3000 + offset },
    { date: "2024-01-08", commercial: 47000 + offset, nonCommercial: -44000 + offset, total: 3000 + offset },
    { date: "2024-01-15", commercial: 43000 + offset, nonCommercial: -40000 + offset, total: 3000 + offset },
    { date: "2024-01-22", commercial: 50000 + offset, nonCommercial: -47000 + offset, total: 3000 + offset },
    { date: "2024-01-29", commercial: 48000 + offset, nonCommercial: -45000 + offset, total: 3000 + offset },
    { date: "2024-02-05", commercial: 52000 + offset, nonCommercial: -49000 + offset, total: 3000 + offset },
  ];

  const cotData = generateCOTData(selectedAsset);
  const cotData2 = generateCOTData(selectedAsset2, 5000);

  // Combined data for comparison
  const combinedData = cotData.map((item, index) => ({
    ...item,
    commercial2: cotData2[index]?.commercial || 0,
    nonCommercial2: cotData2[index]?.nonCommercial || 0,
  }));

  // Pie chart data
  const pieData = [
    { name: "Commercial Long", value: Math.abs(cotData[cotData.length - 1]?.commercial || 0), fill: "#10b981" },
    { name: "Non-Commercial Long", value: Math.abs(cotData[cotData.length - 1]?.nonCommercial || 0), fill: "#ef4444" },
    { name: "Retail Traders", value: 15000, fill: "#3b82f6" },
  ];

  const assets = [
    // Major Currency Pairs
    { value: "EUR", label: "EUR/USD", category: "Major Currencies" },
    { value: "GBP", label: "GBP/USD", category: "Major Currencies" },
    { value: "JPY", label: "USD/JPY", category: "Major Currencies" },
    { value: "CHF", label: "USD/CHF", category: "Major Currencies" },
    { value: "CAD", label: "USD/CAD", category: "Major Currencies" },
    { value: "AUD", label: "AUD/USD", category: "Major Currencies" },
    { value: "NZD", label: "NZD/USD", category: "Major Currencies" },
    
    // Cross Currency Pairs
    { value: "EURGBP", label: "EUR/GBP", category: "Cross Currencies" },
    { value: "EURJPY", label: "EUR/JPY", category: "Cross Currencies" },
    { value: "EURCHF", label: "EUR/CHF", category: "Cross Currencies" },
    { value: "GBPJPY", label: "GBP/JPY", category: "Cross Currencies" },
    { value: "GBPCHF", label: "GBP/CHF", category: "Cross Currencies" },
    { value: "CHFJPY", label: "CHF/JPY", category: "Cross Currencies" },
    
    // Exotic Currency Pairs
    { value: "USDTRY", label: "USD/TRY", category: "Exotic Currencies" },
    { value: "USDZAR", label: "USD/ZAR", category: "Exotic Currencies" },
    { value: "USDMXN", label: "USD/MXN", category: "Exotic Currencies" },
    { value: "USDSEK", label: "USD/SEK", category: "Exotic Currencies" },
    { value: "USDNOK", label: "USD/NOK", category: "Exotic Currencies" },
    { value: "USDPLN", label: "USD/PLN", category: "Exotic Currencies" },
    { value: "USDSGD", label: "USD/SGD", category: "Exotic Currencies" },
    { value: "USDHKD", label: "USD/HKD", category: "Exotic Currencies" },
    
    // Cryptocurrencies
    { value: "BTC", label: "Bitcoin", category: "Cryptocurrencies" },
    { value: "ETH", label: "Ethereum", category: "Cryptocurrencies" },
    { value: "LTC", label: "Litecoin", category: "Cryptocurrencies" },
    { value: "XRP", label: "Ripple", category: "Cryptocurrencies" },
    
    // Commodities
    { value: "GOLD", label: "Gold", category: "Commodities" },
    { value: "SILVER", label: "Silver", category: "Commodities" },
    { value: "OIL", label: "Crude Oil (WTI)", category: "Commodities" },
    { value: "BRENT", label: "Brent Oil", category: "Commodities" },
    { value: "NATGAS", label: "Natural Gas", category: "Commodities" },
    { value: "COPPER", label: "Copper", category: "Commodities" },
    { value: "WHEAT", label: "Wheat", category: "Commodities" },
    { value: "CORN", label: "Corn", category: "Commodities" },
    { value: "SOYBEAN", label: "Soybeans", category: "Commodities" },
    
    // Indices
    { value: "US30", label: "US30 (Dow Jones)", category: "Indices" },
    { value: "NASDAQ", label: "NASDAQ 100", category: "Indices" },
    { value: "SP500", label: "S&P 500", category: "Indices" },
    { value: "RUSSELL", label: "Russell 2000", category: "Indices" },
    { value: "DAX", label: "DAX 40", category: "Indices" },
    { value: "FTSE", label: "FTSE 100", category: "Indices" },
    { value: "NIKKEI", label: "Nikkei 225", category: "Indices" },
    { value: "ASX", label: "ASX 200", category: "Indices" },
  ];

  // Group assets by category for better organization
  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, typeof assets>);

  const getAssetLabel = (value: string) => {
    return assets.find(asset => asset.value === value)?.label || value;
  };

  const renderChart = () => {
    const data = comparisonMode ? combinedData : cotData;
    
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#374151', 
                border: '1px solid #6b7280',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar 
              dataKey="commercial" 
              fill="#10b981" 
              name={`Commercial (${getAssetLabel(selectedAsset)})`}
            />
            <Bar 
              dataKey="nonCommercial" 
              fill="#ef4444" 
              name={`Non-Commercial (${getAssetLabel(selectedAsset)})`}
            />
            {comparisonMode && selectedAsset2 && (
              <>
                <Bar 
                  dataKey="commercial2" 
                  fill="#06b6d4" 
                  name={`Commercial (${getAssetLabel(selectedAsset2)})`}
                />
                <Bar 
                  dataKey="nonCommercial2" 
                  fill="#f97316" 
                  name={`Non-Commercial (${getAssetLabel(selectedAsset2)})`}
                />
              </>
            )}
          </BarChart>
        );
      
      case "pie":
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#374151', 
                border: '1px solid #6b7280',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        );
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#374151', 
                border: '1px solid #6b7280',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="commercial" 
              stroke="#10b981" 
              strokeWidth={3}
              name={`Commercial (${getAssetLabel(selectedAsset)})`}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="nonCommercial" 
              stroke="#ef4444" 
              strokeWidth={3}
              name={`Non-Commercial (${getAssetLabel(selectedAsset)})`}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
            {comparisonMode && selectedAsset2 && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="commercial2" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name={`Commercial (${getAssetLabel(selectedAsset2)})`}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="nonCommercial2" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  name={`Non-Commercial (${getAssetLabel(selectedAsset2)})`}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  strokeDasharray="5 5"
                />
              </>
            )}
          </LineChart>
        );
    }
  };

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
            
            {/* Controls Row */}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Commercial Net</div>
                <div className="text-2xl font-bold text-green-400">+52,000</div>
                <div className="text-xs text-gray-500">contracts</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Non-Commercial Net</div>
                <div className="text-2xl font-bold text-red-400">-49,000</div>
                <div className="text-xs text-gray-500">contracts</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400">Net Change</div>
                <div className="text-2xl font-bold text-yellow-400">+3,000</div>
                <div className="text-xs text-gray-500">from last week</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default COTDashboard;
