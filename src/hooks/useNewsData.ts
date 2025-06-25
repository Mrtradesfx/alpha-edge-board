
import { useState, useEffect } from "react";

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

export const useNewsData = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const getNewsArticles = (): NewsArticle[] => {
    const baseArticles: NewsArticle[] = [
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

    // Simulate some variation in data based on current time
    const now = Date.now();
    const variation = Math.floor(now / 60000) % 3;
    
    if (variation === 1) {
      baseArticles.unshift({
        id: 6,
        headline: "Breaking: Major Currency Intervention Announced",
        summary: "Central bank coordination leads to significant market movements in major currency pairs.",
        timestamp: "1 hour ago",
        sentiment: "neutral",
        source: "Reuters",
        category: "forex",
        impact: "high"
      });
    }

    return baseArticles;
  };

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(getNewsArticles());

  const refreshNews = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNewsArticles(getNewsArticles());
    setLastUpdated(new Date());
  };

  // Simulate periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsArticles(getNewsArticles());
      setLastUpdated(new Date());
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  }, []);

  return { newsArticles, lastUpdated, refreshNews };
};
