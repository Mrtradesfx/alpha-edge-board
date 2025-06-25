
import { useState, useEffect } from "react";
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
  onToggle?: (isOpen: boolean) => void;
  isOpen?: boolean;
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

const ModernSidebar = ({ activeTab, onTabChange, onToggle, isOpen: propIsOpen }: ModernSidebarProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use prop isOpen if provided, otherwise use internal state
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  const handleToggle = (newState: boolean) => {
    if (propIsOpen !== undefined) {
      // If controlled by parent, notify parent
      onToggle?.(newState);
    } else {
      // If internal state, update internal state
      setInternalIsOpen(newState);
      onToggle?.(newState);
    }
  };

  return (
    <>
      {/* Mobile overlay - only show when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => handleToggle(false)}
        />
      )}

      {/* Sidebar - completely hidden when closed on mobile */}
      <div className={cn(
        "fixed left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50",
        "lg:translate-x-0 lg:static lg:h-screen lg:w-64",
        "lg:top-0",
        isOpen ? "translate-x-0 w-64 top-0 h-screen" : "-translate-x-full w-64 top-16 h-[calc(100vh-64px)] lg:w-16"
      )}>
        {/* Header - show on mobile when open */}
        {isOpen && (
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 h-16 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle(false)}
              className="p-1.5"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                handleToggle(false); // Close mobile menu after selection
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
