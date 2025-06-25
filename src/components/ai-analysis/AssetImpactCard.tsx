
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Clock, Target } from "lucide-react";
import { AssetImpact } from "@/hooks/useAINewsAnalysis";

interface AssetImpactCardProps {
  impact: AssetImpact;
}

const AssetImpactCard = ({ impact }: AssetImpactCardProps) => {
  const getImpactIcon = (impactType: string) => {
    switch (impactType) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impactType: string) => {
    switch (impactType) {
      case "positive":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case "short":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "long":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Asset Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-white text-lg">
                {impact.asset}
              </div>
              <div className="text-sm text-gray-400">
                {impact.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getImpactIcon(impact.impact)}
              <Badge variant="outline" className={getImpactColor(impact.impact)}>
                {impact.impact}
              </Badge>
            </div>
          </div>

          {/* Impact Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400">Confidence</div>
              <div className={`font-mono text-lg ${getConfidenceColor(impact.confidence)}`}>
                {impact.confidence}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">Timeframe</div>
              <Badge variant="outline" className={getTimeframeColor(impact.timeframe)} size="sm">
                <Clock className="w-3 h-3 mr-1" />
                {impact.timeframe}-term
              </Badge>
            </div>
          </div>

          {/* Price Target */}
          {impact.priceTarget && (
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Price Target</span>
              </div>
              <div className="text-blue-400 font-mono text-lg">
                {impact.priceTarget}
              </div>
            </div>
          )}

          {/* Reasoning */}
          <div className="text-sm text-gray-300 leading-relaxed">
            {impact.reasoning}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetImpactCard;
