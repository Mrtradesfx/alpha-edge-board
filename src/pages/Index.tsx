import { useState } from "react";
import ModernSidebar from "@/components/ModernSidebar";
import ModernHeader from "@/components/ModernHeader";
import ModernStatsCard from "@/components/ModernStatsCard";
import COTDashboard from "@/components/COTDashboard";
import NewsAggregator from "@/components/NewsAggregator";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingViewChart from "@/components/TradingViewChart";
import TradingViewBanner from "@/components/TradingViewBanner";
import SecureSmartAlerts from "@/components/SecureSmartAlerts";
import ChatRoom from "@/components/ChatRoom";
import AINewsAnalyzer from "@/components/AINewsAnalyzer";
import AITradeCoach from "@/components/AITradeCoach";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import CurrencyHeatMap from "@/components/CurrencyHeatMap";
import NewsGlobe from "@/components/NewsGlobe";
import { TrendingUp, DollarSign, BarChart3, Bell, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    // Additional logout logic if needed
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Desktop 4-card grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Left - Globe */}
              <div className="lg:order-1">
                <NewsGlobe />
              </div>
              
              {/* Top Right - Chart */}
              <div className="lg:order-2">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Live Market Chart
                  </h3>
                  <TradingViewChart height={400} />
                </div>
              </div>
              
              {/* Bottom Left - News */}
              <div className="lg:order-3">
                <NewsAggregator preview={true} />
              </div>
              
              {/* Bottom Right - Economic Calendar */}
              <div className="lg:order-4">
                <EconomicCalendar />
              </div>
            </div>
          </div>
        );
        
      case "cot":
        return <COTDashboard />;
        
      case "news":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NewsAggregator preview={false} />
              <AINewsAnalyzer />
            </div>
            <NewsGlobe />
          </div>
        );
        
      case "smart-alerts":
        return (
          <div className="space-y-6">
            {!user && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Enhanced Security</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Our new secure alerts system stores your alerts safely in the database with end-to-end encryption. 
                  Sign in to access your personalized, secure alerts.
                </p>
              </div>
            )}
            <SecureSmartAlerts />
          </div>
        );
        
      case "chatroom":
        return <ChatRoom />;
        
      case "ai-coach":
        return <AITradeCoach />;
        
      case "heatmap":
        return <CurrencyHeatMap />;
        
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This section is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation
        isAuthenticated={!!user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <ModernSidebar
          activeTab={activeSection}
          onTabChange={setActiveSection}
        />
        
        {/* Main content area with proper responsive margins */}
        <div className="flex-1 lg:ml-0">
          <ModernHeader sidebarCollapsed={false} />
          
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
