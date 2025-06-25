
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  children?: React.ReactNode;
}

const ModernStatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor,
  children 
}: ModernStatsCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={cn("p-1.5 sm:p-2 rounded-lg", iconColor)}>
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          {change && (
            <div className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-green-600 dark:text-green-400",
              changeType === "negative" && "text-red-600 dark:text-red-400",
              changeType === "neutral" && "text-gray-600 dark:text-gray-400"
            )}>
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>

        {children && (
          <div className="mt-2 sm:mt-3">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernStatsCard;
