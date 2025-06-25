
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

interface NewsPreviewProps {
  articles: NewsArticle[];
  lastUpdated: Date;
}

const NewsPreview = ({ articles, lastUpdated }: NewsPreviewProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {articles.slice(0, 3).map((article) => (
        <div key={article.id} className="p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
          <div className="flex items-start gap-3">
            {getSentimentIcon(article.sentiment)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{article.headline}</h4>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.summary}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">{article.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-xs text-gray-400 text-center">
        {articles.length - 3} more articles available
      </div>
      <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default NewsPreview;
