
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import COTDashboard from "@/components/COTDashboard";
import EconomicCalendar from "@/components/EconomicCalendar";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import NewsAggregator from "@/components/NewsAggregator";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { TrendingUp, Calendar, Activity, Newspaper } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation 
        isAuthenticated={isAuthenticated}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            TraderBoard
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Real-time trading data, simplified.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Real-time Updates
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="cot" className="data-[state=active]:bg-gray-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              COT Data
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Economic
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-gray-700">
              <Activity className="w-4 h-4 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-gray-700">
              <Newspaper className="w-4 h-4 mr-2" />
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    COT Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <COTDashboard preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EconomicCalendar preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentAnalysis preview={true} />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-orange-500" />
                    Latest News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsAggregator preview={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cot">
            <COTDashboard />
          </TabsContent>

          <TabsContent value="calendar">
            <EconomicCalendar />
          </TabsContent>

          <TabsContent value="sentiment">
            <SentimentAnalysis />
          </TabsContent>

          <TabsContent value="news">
            <NewsAggregator />
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
