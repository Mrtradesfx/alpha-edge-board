
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

interface NewsAggregatorProps {
  preview?: boolean;
}

const NewsAggregator = ({ preview = false }: NewsAggregatorProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock news data
  const newsArticles = [
    {
      id: 1,
      headline: "Federal Reserve Signals Potential Rate Cut in Q2 2024",
      summary: "Fed officials indicate growing concerns about economic slowdown, suggesting possible monetary policy easing measures.",
      timestamp: "2 hours ago",
      sentiment: "bullish",
      source: "Financial Times",
      category: "monetary_policy",
      impact: "high"
    },
    {
      id: 2,
      headline: "Tech Stocks Rally as AI Investment Surge Continues",
      summary: "Major technology companies report strong earnings driven by artificial intelligence investments and infrastructure spending.",
      timestamp: "3 hours ago", 
      sentiment: "bullish",
      source: "Reuters",
      category: "technology",
      impact: "medium"
    },
    {
      id: 3,
      headline: "Oil Prices Decline on Demand Concerns from China",
      summary: "Crude oil futures fall 2.3% as latest economic data from China suggests weakening energy demand in the world's second-largest economy.",
      timestamp: "4 hours ago",
      sentiment: "bearish",
      source: "Bloomberg",
      category: "commodities",
      impact: "medium"
    },
    {
      id: 4,
      headline: "European Central Bank Maintains Hawkish Stance",
      summary: "ECB officials reaffirm commitment to fighting inflation despite growing recession risks across the eurozone.",
      timestamp: "5 hours ago",
      sentiment: "neutral",
      source: "Wall Street Journal",
      category: "monetary_policy",
      impact: "high"
    },
    {
      id: 5,
      headline: "Gold Reaches New Monthly High Amid Dollar Weakness",
      summary: "Precious metals surge as investors seek safe-haven assets following mixed economic signals and geopolitical tensions.",
      timestamp: "6 hours ago",
      sentiment: "bullish", 
      source: "MarketWatch",
      category: "commodities",
      impact: "low"
    }
  ];

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

  if (preview) {
    return (
      <div className="space-y-3">
        {newsArticles.slice(0, 3).map((article) => (
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
          {newsArticles.length - 3} more articles available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Market News & Analysis</CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Categories</SelectItem>
                <SelectItem value="monetary_policy" className="text-white">Monetary Policy</SelectItem>
                <SelectItem value="technology" className="text-white">Technology</SelectItem>
                <SelectItem value="commodities" className="text-white">Commodities</SelectItem>
                <SelectItem value="forex" className="text-white">Forex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsArticles.map((article) => (
              <Card key={article.id} className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors">
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
                        
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
              Load More Articles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsAggregator;
