
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Newspaper, 
  DollarSign, 
  Target,
  Home,
  Menu,
  X,
  Settings,
  User,
  Brain,
  Bell,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "heatmap", label: "Heat Map", icon: DollarSign },
  { id: "cot", label: "COT Data", icon: TrendingUp },
  { id: "calendar", label: "Economic Calendar", icon: Calendar },
  { id: "sentiment", label: "Market Sentiment", icon: Activity },
  { id: "asset-sentiment", label: "Asset Analysis", icon: Target },
  { id: "news", label: "News Feed", icon: Newspaper },
  { id: "chatroom", label: "Community Chat", icon: MessageSquare },
  { id: "smart-alerts", label: "Smart Alerts", icon: Bell },
  { id: "ai-analysis", label: "AI Analysis", icon: Brain },
  { id: "ai-coach", label: "AI Trade Coach", icon: Brain },
];

const ModernSidebar = ({ activeTab, onTabChange }: ModernSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button - Fixed position below header */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile overlay - below header but above content */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          style={{ top: '64px' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - below header */}
      <div className={cn(
        "fixed left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30",
        "lg:translate-x-0 lg:static lg:h-screen lg:w-64",
        "lg:top-0",
        isOpen ? "translate-x-0 w-64 top-16 h-[calc(100vh-64px)]" : "-translate-x-full w-0 lg:w-16 top-16 h-[calc(100vh-64px)]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 h-16">
          {(!isOpen && "lg:block") || isOpen ? (
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-gray-900 dark:text-white">Quantide</div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                Live
              </Badge>
            </div>
          ) : null}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsOpen(false); // Close mobile menu after selection
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(isOpen || "lg:hidden") && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer - only show when expanded */}
        {isOpen && (
          <div className="absolute bottom-4 left-3 right-3 space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ModernSidebar;
