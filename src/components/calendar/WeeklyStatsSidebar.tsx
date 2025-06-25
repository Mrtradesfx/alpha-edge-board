
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeekStats {
  week: number;
  pnl: number;
  tradingDays: number;
}

interface WeeklyStatsSidebarProps {
  weeklyStats: WeekStats[];
}

const WeeklyStatsSidebar = ({ weeklyStats }: WeeklyStatsSidebarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "space-y-4",
      isMobile ? "w-full" : "w-64"
    )}>
      {isMobile && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Stats
        </h3>
      )}
      <div className={cn(
        "space-y-4",
        isMobile ? "grid grid-cols-2 gap-4" : ""
      )}>
        {weeklyStats.map((week) => (
          <Card key={week.week} className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Week {week.week}
              </div>
              <div className={cn("text-xl font-bold", 
                week.pnl >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {week.pnl >= 0 ? '+' : ''}${week.pnl.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {week.tradingDays} day{week.tradingDays !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyStatsSidebar;
