
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeekStats {
  week: number;
  pnl: number;
  tradingDays: number;
}

interface WeeklyStatsSidebarProps {
  weeklyStats: WeekStats[];
}

const WeeklyStatsSidebar = ({ weeklyStats }: WeeklyStatsSidebarProps) => {
  return (
    <div className="w-64 space-y-4">
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
  );
};

export default WeeklyStatsSidebar;
