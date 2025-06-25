
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import COTDashboard from "@/components/COTDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import AssetSentimentSelector from "@/components/AssetSentimentSelector";
import NewsAggregator from "@/components/NewsAggregator";
import CurrencyHeatMap from "@/components/CurrencyHeatMap";
import ModernSidebar from "@/components/ModernSidebar";
import ModernHeader from "@/components/ModernHeader";
import ModernStatsCard from "@/components/ModernStatsCard";
import { TrendingUp, Calendar, Activity, Newspaper, DollarSign, Target, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ModernStatsCard
                title="Total Assets Tracked"
                value="2,382"
                change="+8.2%"
                changeType="positive"
                icon={DollarSign}
                iconColor="bg-blue-500"
              />
              <ModernStatsCard
                title="Active Positions"
                value="64"
                change="-2.5%"
                changeType="negative"
                icon={TrendingUp}
                iconColor="bg-green-500"
              />
              <ModernStatsCard
                title="Market Sentiment"
                value="Bullish"
                change="Strong"
                changeType="positive"
                icon={Activity}
                iconColor="bg-purple-500"
              />
              <ModernStatsCard
                title="Daily Volume"
                value="$21.3M"
                change="+12.4%"
                changeType="positive"
                icon={BarChart3}
                iconColor="bg-orange-500"
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    Asset Heat Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CurrencyHeatMap preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    COT Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <COTDashboard preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EconomicCalendar preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentAnalysis preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Newspaper className="w-5 h-5 text-orange-500" />
                    Latest News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsAggregator preview={true} />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "heatmap":
        return <CurrencyHeatMap />;
      case "cot":
        return <COTDashboard />;
      case "calendar":
        return <EconomicCalendar />;
      case "sentiment":
        return <SentimentAnalysis />;
      case "asset-sentiment":
        return <AssetSentimentSelector />;
      case "news":
        return <NewsAggregator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ModernSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <ModernHeader sidebarCollapsed={sidebarCollapsed} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
