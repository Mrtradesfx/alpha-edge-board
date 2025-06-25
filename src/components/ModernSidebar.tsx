
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
  User
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
];

const ModernSidebar = ({ activeTab, onTabChange }: ModernSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-gray-900 dark:text-white">Quantide</div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                Live
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
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
