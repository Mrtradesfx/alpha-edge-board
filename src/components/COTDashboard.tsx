
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

interface COTDashboardProps {
  preview?: boolean;
}

const COTDashboard = ({ preview = false }: COTDashboardProps) => {
  const [selectedAsset, setSelectedAsset] = useState("EUR");

  // Mock COT data - in real app, this would come from Quandl API
  const cotData = [
    { date: "2024-01-01", commercial: 45000, nonCommercial: -42000, total: 3000 },
    { date: "2024-01-08", commercial: 47000, nonCommercial: -44000, total: 3000 },
    { date: "2024-01-15", commercial: 43000, nonCommercial: -40000, total: 3000 },
    { date: "2024-01-22", commercial: 50000, nonCommercial: -47000, total: 3000 },
    { date: "2024-01-29", commercial: 48000, nonCommercial: -45000, total: 3000 },
    { date: "2024-02-05", commercial: 52000, nonCommercial: -49000, total: 3000 },
  ];

  const assets = [
    { value: "EUR", label: "EUR/USD" },
    { value: "GBP", label: "GBP/USD" },
    { value: "JPY", label: "USD/JPY" },
    { value: "GOLD", label: "Gold" },
    { value: "OIL", label: "Crude Oil" },
  ];

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
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Commitment of Traders (COT) Reports</CardTitle>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {assets.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value} className="text-white">
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cotData}>
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
                  name="Commercial Traders"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nonCommercial" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Non-Commercial Traders"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
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
