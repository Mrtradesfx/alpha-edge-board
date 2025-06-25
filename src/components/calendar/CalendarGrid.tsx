
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import CalendarDay from './CalendarDay';

interface DailySummary {
  date: string;
  net_pnl: number;
  trade_count: number;
  ai_flagged: boolean;
}

interface CalendarGridProps {
  currentMonth: Date;
  dailySummaries: DailySummary[];
  loading: boolean;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDayClick: (date: Date) => void;
}

const CalendarGrid = ({ 
  currentMonth, 
  dailySummaries, 
  loading, 
  onNavigateMonth, 
  onDayClick 
}: CalendarGridProps) => {
  const isMobile = useIsMobile();
  
  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dailySummaries.find(summary => summary.date === dateStr);
  };

  const monthlyStats = dailySummaries.reduce((acc, day) => {
    acc.totalPnl += day.net_pnl;
    return acc;
  }, { totalPnl: 0 });

  // Get all days for the calendar grid (including prev/next month days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay()); // Go to Sunday of first week
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay())); // Go to Saturday of last week

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className={cn("font-semibold", isMobile ? "text-lg" : "text-xl")}>
              {format(currentMonth, isMobile ? 'MMM yyyy' : 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {!isMobile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Monthly stats:</span>
              <span className="font-semibold text-green-600">${Math.abs(monthlyStats.totalPnl).toFixed(1)}K</span>
              <span>{dailySummaries.length} days</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <div className="calendar-grid">
            {/* Calendar headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={cn(
                  "text-center font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700",
                  isMobile ? "p-2 text-xs" : "p-3 text-sm"
                )}>
                  {isMobile ? day.substring(0, 1) : day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700">
              {calendarDays.map(date => (
                <div key={date.toISOString()}>
                  <CalendarDay
                    date={date}
                    currentMonth={currentMonth}
                    dayData={getDayData(date)}
                    onClick={onDayClick}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;
