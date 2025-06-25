
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
import NewsGlobe from "@/components/NewsGlobe";
import AINewsAnalyzer from "@/components/AINewsAnalyzer";
import AITradeCoach from "@/components/AITradeCoach";
import SmartAlerts from "@/components/SmartAlerts";
import TradingViewBanner from "@/components/TradingViewBanner";
import TradingViewChart from "@/components/TradingViewChart";
import ChatRoom from "@/components/ChatRoom";
import { TrendingUp, DollarSign, Newspaper, LineChart } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    Asset Heat Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-2 sm:p-3 lg:p-6">
                  <CurrencyHeatMap preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    COT Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-2 sm:p-3 lg:p-6">
                  <COTDashboard preview={true} />
                </CardContent>
              </Card>

              {/* NewsGlobe */}
              <NewsGlobe />

              {/* TradingView Chart with improved proportions */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">
                    <LineChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    Price Chart
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-2 sm:p-3 lg:p-6">
                  <div className="h-80 lg:h-96">
                    <TradingViewChart 
                      symbol="FX:EURUSD"
                      colorTheme="light"
                      height="100%"
                      autosize={true}
                      hideSideToolbar={true}
                      allowSymbolChange={false}
                      hideDateRanges={false}
                      showPopupButton={false}
                      hideMarketStatus={true}
                      hideSymbolSearch={true}
                      saveImage={false}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 lg:col-span-2">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">
                    <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    Latest News
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-2 sm:p-3 lg:p-6">
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
      case "chatroom":
        return <ChatRoom />;
      case "smart-alerts":
        return <SmartAlerts />;
      case "ai-analysis":
        return <AINewsAnalyzer />;
      case "ai-coach":
        return <AITradeCoach />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex w-full">
      <ModernSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <ModernHeader sidebarCollapsed={sidebarCollapsed} />
        <TradingViewBanner />
        
        <main className="flex-1 p-2 sm:p-3 lg:p-4 xl:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
