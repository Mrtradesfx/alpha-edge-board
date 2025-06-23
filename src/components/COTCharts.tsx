
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { COTDataPoint } from "@/utils/cotData";
import { getAssetLabel } from "@/data/assets";

interface COTChartsProps {
  chartType: string;
  data: COTDataPoint[];
  comparisonMode: boolean;
  selectedAsset: string;
  selectedAsset2: string;
  pieData: any[];
}

const COTCharts = ({ chartType, data, comparisonMode, selectedAsset, selectedAsset2, pieData }: COTChartsProps) => {
  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height="100%">
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
        </ResponsiveContainer>
      );
    
    case "pie":
      return (
        <ResponsiveContainer width="100%" height="100%">
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
        </ResponsiveContainer>
      );
    
    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
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
        </ResponsiveContainer>
      );
  }
};

export default COTCharts;
