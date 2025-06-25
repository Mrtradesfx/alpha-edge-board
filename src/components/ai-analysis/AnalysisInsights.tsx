
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, AlertCircle, Lightbulb } from "lucide-react";
import { AnalysisInsight } from "@/hooks/useAINewsAnalysis";

interface AnalysisInsightsProps {
  insights: AnalysisInsight[];
}

const AnalysisInsights = ({ insights }: AnalysisInsightsProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case "risk":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "opportunity":
        return <Target className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-purple-400" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case "trend":
        return "border-l-blue-400";
      case "risk":
        return "border-l-red-400";
      case "opportunity":
        return "border-l-green-400";
      case "warning":
        return "border-l-yellow-400";
      default:
        return "border-l-purple-400";
    }
  };

  return (
    <div className="space-y-4">
      <CardTitle className="text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-purple-400" />
        Key Market Insights
      </CardTitle>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <Card 
            key={index} 
            className={`bg-gray-700/30 border-gray-600 border-l-4 ${getInsightBorderColor(insight.type)}`}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Insight Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getInsightIcon(insight.type)}
                    <div>
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {insight.type}
                        </Badge>
                        <Badge variant="outline" className={getUrgencyColor(insight.urgency)}>
                          {insight.urgency} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {insight.description}
                </p>

                {/* Affected Assets */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Affected Assets:</div>
                  <div className="flex flex-wrap gap-2">
                    {insight.affectedAssets.map((asset) => (
                      <Badge 
                        key={asset} 
                        variant="outline" 
                        className="bg-gray-800/50 text-gray-300 border-gray-500"
                      >
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalysisInsights;
