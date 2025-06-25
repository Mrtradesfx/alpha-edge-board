
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useAINewsAnalysis } from "@/hooks/useAINewsAnalysis";
import AssetImpactCard from "@/components/ai-analysis/AssetImpactCard";
import AnalysisInsights from "@/components/ai-analysis/AnalysisInsights";

const AINewsAnalyzer = () => {
  const { 
    analysis, 
    isAnalyzing, 
    lastUpdated, 
    confidence, 
    triggerAnalysis,
    error 
  } = useAINewsAnalysis();

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        triggerAnalysis();
      }, 15 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, triggerAnalysis]);

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  AI Market Impact Analysis
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Automated
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Real-time analysis of economic news impact on tracked assets
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Auto-refresh:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? "text-green-400" : "text-gray-400"}
                >
                  {autoRefresh ? "ON" : "OFF"}
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={triggerAnalysis}
                disabled={isAnalyzing}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? "Analyzing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Analysis Error: {error}</span>
              </div>
            </div>
          )}

          {/* Analysis Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Analysis Confidence</div>
              <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
                {confidence}%
              </div>
              <Progress value={confidence} className="mt-2 h-2" />
            </div>
            
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Articles Analyzed</div>
              <div className="text-2xl font-bold text-blue-400">
                {analysis?.articlesAnalyzed || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last 24 hours
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Last Updated</div>
              <div className="text-sm text-white">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Next: {autoRefresh ? "15 min" : "Manual"}
              </div>
            </div>
          </div>

          {/* Asset Impact Analysis */}
          {analysis && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Asset Impact Predictions
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {analysis.assetImpacts.map((impact) => (
                    <AssetImpactCard key={impact.asset} impact={impact} />
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <AnalysisInsights insights={analysis.insights} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AINewsAnalyzer;
