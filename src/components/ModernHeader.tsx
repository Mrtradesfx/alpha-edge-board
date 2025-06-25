
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Settings, User, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface ModernHeaderProps {
  sidebarCollapsed: boolean;
}

const ModernHeader = ({ sidebarCollapsed }: ModernHeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-center px-3 sm:px-6 py-3 min-h-[64px] relative">
        {/* Centered content */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
            Real-time market data and insights
          </p>
        </div>

        {/* Right section - Actions (positioned absolutely) */}
        <div className="absolute right-3 sm:right-6 flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Live indicator - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-sm mr-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400 text-xs">Live</span>
          </div>
          
          {/* Action buttons */}
          <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
            <Search className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
