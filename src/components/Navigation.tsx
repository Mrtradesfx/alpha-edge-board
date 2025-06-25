import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut } from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Navigation = ({ isAuthenticated, onAuthClick, onLogout }: NavigationProps) => {
  return (
    <nav className="border-b border-gray-700 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-white">Quantide</div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white"
                onClick={onAuthClick}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onAuthClick}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
