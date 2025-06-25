
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyStats {
  totalPnl: number;
  totalTrades: number;
  profitableDays: number;
  flaggedDays: number;
}

interface MonthlyStatsCardsProps {
  stats: MonthlyStats;
}

const MonthlyStatsCards = ({ stats }: MonthlyStatsCardsProps) => {
  const isMobile = useIsMobile();
  const winRate = stats.totalTrades > 0 ? (stats.profitableDays / stats.totalTrades * 100).toFixed(1) : '0';

  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4"
    )}>
      <Card className={cn("p-4", isMobile ? "p-3" : "p-6")}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn("text-gray-600 dark:text-gray-400", isMobile ? "text-xs" : "text-sm")}>
              Net P&L
            </span>
            <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center", 
              isMobile ? "w-4 h-4" : "w-6 h-6"
            )}>
              <span className={cn(isMobile ? "text-xs" : "text-xs")}>i</span>
            </div>
          </div>
          <div className={cn("font-bold", 
            isMobile ? "text-lg" : "text-2xl",
            stats.totalPnl >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
          </div>
        </div>
      </Card>

      <Card className={cn("p-4", isMobile ? "p-3" : "p-6")}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn("text-gray-600 dark:text-gray-400", isMobile ? "text-xs" : "text-sm")}>
              Profit Factor
            </span>
            <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center", 
              isMobile ? "w-4 h-4" : "w-6 h-6"
            )}>
              <span className={cn(isMobile ? "text-xs" : "text-xs")}>i</span>
            </div>
          </div>
          <div className={cn("font-bold text-gray-900 dark:text-white", 
            isMobile ? "text-lg" : "text-2xl"
          )}>
            {stats.totalTrades > 0 ? (stats.totalPnl / stats.totalTrades).toFixed(2) : '0.00'}
          </div>
        </div>
      </Card>

      <Card className={cn("p-4", isMobile ? "p-3" : "p-6")}>
        <div className="space-y-2">
          <span className={cn("text-gray-600 dark:text-gray-400", isMobile ? "text-xs" : "text-sm")}>
            Win Rate
          </span>
          <div className={cn("font-bold text-green-600", 
            isMobile ? "text-lg" : "text-2xl"
          )}>
            {winRate}%
          </div>
        </div>
      </Card>

      <Card className={cn("p-4", isMobile ? "p-3" : "p-6")}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn("text-gray-600 dark:text-gray-400", isMobile ? "text-xs" : "text-sm")}>
              Current Streak
            </span>
            <div className={cn("bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center", 
              isMobile ? "w-4 h-4" : "w-6 h-6"
            )}>
              <span className={cn(isMobile ? "text-xs" : "text-xs")}>i</span>
            </div>
          </div>
          <div className={cn("font-bold text-gray-900 dark:text-white", 
            isMobile ? "text-lg" : "text-2xl"
          )}>
            {stats.profitableDays}
          </div>
          <div className={cn("text-gray-500", isMobile ? "text-xs" : "text-xs")}>DAYS</div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyStatsCards;
