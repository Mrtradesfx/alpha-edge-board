
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNewsData } from "@/hooks/useNewsData";
import NewsArticleCard from "@/components/news/NewsArticleCard";
import NewsPreview from "@/components/news/NewsPreview";

interface NewsAggregatorProps {
  preview?: boolean;
}

const NewsAggregator = ({ preview = false }: NewsAggregatorProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { newsArticles, lastUpdated, refreshNews } = useNewsData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNews();
    setIsRefreshing(false);
  };

  const filteredArticles = selectedCategory === "all" 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  if (preview) {
    return <NewsPreview articles={filteredArticles} lastUpdated={lastUpdated} />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CardTitle className="text-white">Market News & Analysis</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <NewsArticleCard key={article.id} article={article} />
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
