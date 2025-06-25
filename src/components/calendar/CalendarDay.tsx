
import { format, isSameMonth } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isCurrentMonth = isSameMonth(date, currentMonth);
  
  return (
    <div 
      className={cn(
        "border border-gray-200 dark:border-gray-700 p-1 sm:p-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 relative",
        isMobile ? "h-16 sm:h-20" : "h-20 sm:h-24",
        !isCurrentMonth && "opacity-40 bg-gray-50 dark:bg-gray-800/50",
        isToday && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
      )}
      onClick={() => onClick(date)}
    >
      <div className="w-full h-full flex flex-col">
        <div className={cn(
          "font-medium mb-1",
          isMobile ? "text-xs" : "text-sm",
          isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400"
        )}>
          {format(date, 'd')}
        </div>
        
        {dayData && (
          <div className="flex-1 flex flex-col justify-between">
            <div className={cn(
              "font-bold", 
              isMobile ? "text-sm" : "text-lg",
              dayData.net_pnl > 0 ? "text-green-600" : 
              dayData.net_pnl < 0 ? "text-red-600" : "text-gray-600"
            )}>
              {dayData.net_pnl > 0 ? '+' : ''}${Math.abs(dayData.net_pnl).toFixed(0)}
            </div>
            <div className="space-y-1">
              <div className={cn("text-gray-500", isMobile ? "text-xs" : "text-xs")}>
                {dayData.trade_count} trade{dayData.trade_count !== 1 ? 's' : ''}
              </div>
              {dayData.ai_flagged && (
                <AlertTriangle className={cn(isMobile ? "w-2 h-2" : "w-3 h-3", "text-amber-500")} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
