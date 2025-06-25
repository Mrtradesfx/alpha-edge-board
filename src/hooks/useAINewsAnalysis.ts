
import { useState, useCallback } from "react";
import { useNewsData } from "@/hooks/useNewsData";

export interface AssetImpact {
  asset: string;
  name: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number;
  timeframe: "short" | "medium" | "long";
  reasoning: string;
  priceTarget?: string;
}

export interface AnalysisInsight {
  type: "trend" | "risk" | "opportunity" | "warning";
  title: string;
  description: string;
  affectedAssets: string[];
  urgency: "high" | "medium" | "low";
}

export interface AIAnalysis {
  assetImpacts: AssetImpact[];
  insights: AnalysisInsight[];
  articlesAnalyzed: number;
  overallSentiment: "bullish" | "bearish" | "neutral";
  marketTrend: string;
}

export const useAINewsAnalysis = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { newsArticles } = useNewsData();

  const analyzeNewsImpact = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate AI analysis processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate AI-powered analysis based on news articles
      const analysisResult = generateAIAnalysis(newsArticles);
      
      setAnalysis(analysisResult);
      setConfidence(Math.floor(Math.random() * 20) + 75); // 75-95% confidence
      setLastUpdated(new Date());
      
      console.log("AI Analysis completed:", analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      console.error("AI Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [newsArticles]);

  const triggerAnalysis = useCallback(() => {
    analyzeNewsImpact();
  }, [analyzeNewsImpact]);

  return {
    analysis,
    isAnalyzing,
    lastUpdated,
    confidence,
    triggerAnalysis,
    error
  };
};

// AI Analysis Engine - This would integrate with OpenAI API in production
const generateAIAnalysis = (articles: any[]): AIAnalysis => {
  const assets = ["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "BTC", "GOLD", "OIL"];
  
  // Analyze sentiment and impact for each asset based on news
  const assetImpacts: AssetImpact[] = assets.map(asset => {
    const relevantArticles = articles.filter(article => 
      article.headline.includes(asset) || 
      article.summary.includes(asset) ||
      (asset === "EUR" && article.category === "monetary_policy") ||
      (asset === "BTC" && article.category === "technology") ||
      (asset === "OIL" && article.category === "commodities")
    );

    const sentimentScore = relevantArticles.reduce((acc, article) => {
      return acc + (article.sentiment === "bullish" ? 1 : article.sentiment === "bearish" ? -1 : 0);
    }, 0);

    const impact = sentimentScore > 0 ? "positive" : sentimentScore < 0 ? "negative" : "neutral";
    const confidence = Math.min(95, Math.max(60, 70 + Math.abs(sentimentScore) * 10));

    return {
      asset,
      name: getAssetName(asset),
      impact,
      confidence,
      timeframe: Math.random() > 0.5 ? "short" : "medium",
      reasoning: generateReasoning(asset, relevantArticles, impact),
      priceTarget: impact !== "neutral" ? generatePriceTarget(asset, impact) : undefined
    };
  });

  // Generate key insights
  const insights: AnalysisInsight[] = [
    {
      type: "trend",
      title: "Federal Reserve Policy Shift Expected",
      description: "Analysis indicates potential dovish pivot in monetary policy based on recent Fed communications and economic data.",
      affectedAssets: ["USD", "EUR", "GBP"],
      urgency: "high"
    },
    {
      type: "opportunity",
      title: "Technology Sector Momentum",
      description: "AI investment surge creating positive sentiment for tech-related assets and growth currencies.",
      affectedAssets: ["BTC", "USD", "JPY"],
      urgency: "medium"
    },
    {
      type: "risk",
      title: "Commodity Demand Concerns",
      description: "Weakening Chinese economic data suggests potential headwinds for commodity prices.",
      affectedAssets: ["OIL", "GOLD", "AUD", "CAD"],
      urgency: "medium"
    }
  ];

  return {
    assetImpacts,
    insights,
    articlesAnalyzed: articles.length,
    overallSentiment: assetImpacts.filter(a => a.impact === "positive").length > assetImpacts.filter(a => a.impact === "negative").length ? "bullish" : "bearish",
    marketTrend: "Mixed signals with cautious optimism"
  };
};

const getAssetName = (asset: string): string => {
  const names: Record<string, string> = {
    EUR: "Euro",
    USD: "US Dollar",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    BTC: "Bitcoin",
    GOLD: "Gold",
    OIL: "Crude Oil"
  };
  return names[asset] || asset;
};

const generateReasoning = (asset: string, articles: any[], impact: string): string => {
  if (articles.length === 0) {
    return `No direct news impact identified for ${asset}. Analysis based on broader market sentiment.`;
  }

  const reasons = [
    `Recent news analysis shows ${impact} sentiment for ${asset}`,
    `${articles.length} relevant articles analyzed with ${impact} bias`,
    `Market sentiment indicators suggest ${impact} momentum for ${asset}`
  ];

  return reasons[Math.floor(Math.random() * reasons.length)];
};

const generatePriceTarget = (asset: string, impact: string): string => {
  const direction = impact === "positive" ? "↑" : "↓";
  const percentage = Math.floor(Math.random() * 3) + 1; // 1-3%
  return `${direction} ${percentage}% (24h)`;
};
