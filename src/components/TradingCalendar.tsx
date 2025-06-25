
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, eachWeekOfInterval, getWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import DailyTradeModal from './DailyTradeModal';

interface DailySummary {
  date: string;
  net_pnl: number;
  trade_count: number;
  ai_flagged: boolean;
}

const TradingCalendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<DailySummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      fetchMonthlySummaries();
    }
  }, [user, currentMonth]);

  const fetchMonthlySummaries = async () => {
    if (!user) return;

    setLoading(true);
    const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('daily_summary')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (error) {
        console.error('Error fetching daily summaries:', error);
      } else {
        setDailySummaries(data || []);
      }
    } catch (error) {
      console.error('Error fetching monthly summaries:', error);
    }
    setLoading(false);
  };

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dailySummaries.find(summary => summary.date === dateStr);
  };

  const handleDayClick = (date: Date) => {
    const dayData = getDayData(date);
    if (dayData) {
      setSelectedDayData(dayData);
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const getWeeklyStats = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });
    
    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weekData = weekDays.reduce((acc, day) => {
        const dayData = getDayData(day);
        if (dayData && isSameMonth(day, currentMonth)) {
          acc.pnl += dayData.net_pnl;
          acc.trades += dayData.trade_count;
          acc.tradingDays += 1;
        }
        return acc;
      }, { pnl: 0, trades: 0, tradingDays: 0 });

      return {
        week: index + 1,
        pnl: weekData.pnl,
        trades: weekData.trades,
        tradingDays: weekData.tradingDays
      };
    });
  };

  const renderCalendarDay = (date: Date) => {
    const dayData = getDayData(date);
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isCurrentMonth = isSameMonth(date, currentMonth);
    
    return (
      <div 
        className={cn(
          "h-24 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 relative",
          !isCurrentMonth && "opacity-40 bg-gray-50 dark:bg-gray-800/50",
          isToday && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
        )}
        onClick={() => handleDayClick(date)}
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

  const monthlyStats = dailySummaries.reduce((acc, day) => {
    acc.totalPnl += day.net_pnl;
    acc.totalTrades += day.trade_count;
    acc.profitableDays += day.net_pnl > 0 ? 1 : 0;
    acc.flaggedDays += day.ai_flagged ? 1 : 0;
    return acc;
  }, { totalPnl: 0, totalTrades: 0, profitableDays: 0, flaggedDays: 0 });

  const winRate = dailySummaries.length > 0 ? (monthlyStats.profitableDays / dailySummaries.length * 100).toFixed(1) : '0';
  const weeklyStats = getWeeklyStats();

  // Get all days for the calendar grid (including prev/next month days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay()); // Go to Sunday of first week
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay())); // Go to Saturday of last week

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Good morning!</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            Date
          </Button>
        </div>
      </div>

      {/* Monthly Stats Cards */}
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
              monthlyStats.totalPnl >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {monthlyStats.totalPnl >= 0 ? '+' : ''}${monthlyStats.totalPnl.toFixed(2)}
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
              {monthlyStats.totalTrades > 0 ? (monthlyStats.totalPnl / monthlyStats.totalTrades).toFixed(2) : '0.00'}
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
              {monthlyStats.profitableDays}
            </div>
            <div className="text-xs text-gray-500">DAYS</div>
          </div>
        </Card>
      </div>

      {/* Calendar Section */}
      <div className="flex gap-6">
        {/* Main Calendar */}
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Monthly stats:</span>
                  <span className="font-semibold text-green-600">${Math.abs(monthlyStats.totalPnl).toFixed(1)}K</span>
                  <span>{dailySummaries.length} days</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading calendar...</div>
                </div>
              ) : (
                <div className="calendar-grid">
                  {/* Calendar headers */}
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-sm font-medium text-gray-500 text-center border-b border-gray-200 dark:border-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700">
                    {calendarDays.map(date => (
                      <div key={date.toISOString()}>
                        {renderCalendarDay(date)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Stats Sidebar */}
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
      </div>

      {/* Modal */}
      {showModal && selectedDayData && selectedDate && (
        <DailyTradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          date={selectedDate}
          dailySummary={selectedDayData}
        />
      )}
    </div>
  );
};

export default TradingCalendar;
