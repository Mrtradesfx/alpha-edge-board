
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const winRate = stats.totalTrades > 0 ? (stats.profitableDays / stats.totalTrades * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Net P&L</span>
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
          </div>
          <div className={cn("text-2xl font-bold", 
            stats.totalPnl >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</span>
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalTrades > 0 ? (stats.totalPnl / stats.totalTrades).toFixed(2) : '0.00'}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
          <div className="text-2xl font-bold text-green-600">{winRate}%</div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs">i</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.profitableDays}
          </div>
          <div className="text-xs text-gray-500">DAYS</div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyStatsCards;
