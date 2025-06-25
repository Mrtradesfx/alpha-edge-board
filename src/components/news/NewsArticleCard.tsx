
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  timestamp: string;
  sentiment: "bullish" | "bearish" | "neutral";
  source: string;
  category: string;
  impact: "high" | "medium" | "low";
}

interface NewsArticleCardProps {
  article: NewsArticle;
}

const NewsArticleCard = ({ article }: NewsArticleCardProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "bearish":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  return (
    <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getSentimentIcon(article.sentiment)}
              <Badge variant="outline" className={getSentimentColor(article.sentiment)}>
                {article.sentiment}
              </Badge>
              <Badge variant="outline" className={getImpactColor(article.impact)}>
                {article.impact} impact
              </Badge>
            </div>
            
            <h3 className="text-white font-semibold mb-2 leading-tight">
              {article.headline}
            </h3>
            
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.timestamp}
                </div>
                <span>•</span>
                <span>{article.source}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(article.headline)}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsArticleCard;
