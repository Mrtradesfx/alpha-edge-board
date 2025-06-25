
import { format, isSameMonth } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailySummary {
  date: string;
  net_pnl: number;
  trade_count: number;
  ai_flagged: boolean;
}

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  dayData?: DailySummary;
  onClick: (date: Date) => void;
}

const CalendarDay = ({ date, currentMonth, dayData, onClick }: CalendarDayProps) => {
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isCurrentMonth = isSameMonth(date, currentMonth);
  
  return (
    <div 
      className={cn(
        "h-24 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 relative",
        !isCurrentMonth && "opacity-40 bg-gray-50 dark:bg-gray-800/50",
        isToday && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
      )}
      onClick={() => onClick(date)}
    >
      <div className="w-full h-full flex flex-col">
        <div className={cn(
          "text-sm font-medium mb-1",
          isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400"
        )}>
          {format(date, 'd')}
        </div>
        
        {dayData && (
          <div className="flex-1 flex flex-col justify-between">
            <div className={cn("text-lg font-bold", 
              dayData.net_pnl > 0 ? "text-green-600" : 
              dayData.net_pnl < 0 ? "text-red-600" : "text-gray-600"
            )}>
              {dayData.net_pnl > 0 ? '+' : ''}${Math.abs(dayData.net_pnl).toFixed(0)}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">
                {dayData.trade_count} trade{dayData.trade_count !== 1 ? 's' : ''}
              </div>
              {dayData.ai_flagged && (
                <AlertTriangle className="w-3 h-3 text-amber-500" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
