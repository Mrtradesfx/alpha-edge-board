
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface SentimentAnalysisProps {
  preview?: boolean;
}

const SentimentAnalysis = ({ preview = false }: SentimentAnalysisProps) => {
  // Mock sentiment data
  const overallSentiment = {
    score: 68,
    trend: "bullish",
    change: +5.2
  };

  const sentimentSources = [
    { name: "News Articles", value: 72, color: "#10b981" },
    { name: "Social Media", value: 65, color: "#3b82f6" },
    { name: "Analyst Reports", value: 71, color: "#8b5cf6" },
    { name: "Market Commentary", value: 66, color: "#f59e0b" }
  ];

  const historicalSentiment = [
    { date: "Mon", sentiment: 62 },
    { date: "Tue", sentiment: 58 },
    { date: "Wed", sentiment: 65 },
    { date: "Thu", sentiment: 71 },
    { date: "Fri", sentiment: 68 },
  ];

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Bullish";
    if (score >= 50) return "Neutral";
    return "Bearish";
  };

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${getSentimentColor(overallSentiment.score)}`}>
              {overallSentiment.score}%
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              {getSentimentLabel(overallSentiment.score)}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+{overallSentiment.change}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {sentimentSources.slice(0, 2).map((source) => (
            <div key={source.name} className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{source.name}</span>
              <span className={`text-sm font-mono ${getSentimentColor(source.value)}`}>
                {source.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Sentiment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Overall Market Sentiment</h3>
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getSentimentColor(overallSentiment.score)}`}>
                  {overallSentiment.score}%
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    overallSentiment.score >= 70 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : overallSentiment.score >= 50
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {getSentimentLabel(overallSentiment.score)}
                </Badge>
                <div className="flex items-center justify-center gap-2">
                  {overallSentiment.change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <span className={overallSentiment.change > 0 ? "text-green-400" : "text-red-400"}>
                    {overallSentiment.change > 0 ? "+" : ""}{overallSentiment.change}% from yesterday
                  </span>
                </div>
              </div>
            </div>

            {/* Sentiment by Source */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Sentiment by Source</h3>
              <div className="space-y-3">
                {sentimentSources.map((source) => (
                  <div key={source.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{source.name}</span>
                      <span className={`font-mono ${getSentimentColor(source.value)}`}>
                        {source.value}%
                      </span>
                    </div>
                    <Progress 
                      value={source.value} 
                      className="h-2"
                      style={{ 
                        backgroundColor: '#374151',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Sentiment Chart */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Trend (5 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalSentiment}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #6b7280',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="sentiment" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
