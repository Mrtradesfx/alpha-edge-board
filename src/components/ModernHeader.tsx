
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
    <header className={cn(
      "sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all",
      sidebarCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-64"
    )}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            Analytics Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
            Real-time market data and insights
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400">Live Data</span>
          </div>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
