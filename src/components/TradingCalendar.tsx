
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<DailySummary | null>(null);

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
    setLoading(false);
  };

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dailySummaries.find(summary => summary.date === dateStr);
  };

  const handleDayClick = (dayData: DailySummary, date: Date) => {
    setSelectedDayData(dayData);
    setSelectedDate(date);
    setShowModal(true);
  };

  const renderCalendarDay = (date: Date) => {
    const dayData = getDayData(date);
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    if (!dayData) {
      return (
        <div className={cn(
          "w-full h-full p-1 text-center cursor-pointer transition-colors",
          isToday && "bg-blue-50 dark:bg-blue-900/20 rounded-md"
        )}>
          <div className="text-sm text-gray-400">{format(date, 'd')}</div>
        </div>
      );
    }

    const pnlColor = dayData.net_pnl > 0 ? 'text-green-600' : 
                     dayData.net_pnl < 0 ? 'text-red-600' : 'text-gray-600';

    return (
      <div 
        className={cn(
          "w-full h-full p-1 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md",
          isToday && "bg-blue-50 dark:bg-blue-900/20"
        )}
        onClick={() => handleDayClick(dayData, date)}
      >
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {format(date, 'd')}
        </div>
        <div className={cn("text-xs font-bold", pnlColor)}>
          {dayData.net_pnl > 0 ? '+' : ''}${dayData.net_pnl.toFixed(0)}
        </div>
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>{dayData.trade_count} trades</span>
          {dayData.ai_flagged && (
            <AlertTriangle className="w-3 h-3 text-amber-500" />
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {monthlyStats.totalPnl >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly P&L</p>
                <p className={cn("text-lg font-bold", 
                  monthlyStats.totalPnl >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {monthlyStats.totalPnl >= 0 ? '+' : ''}${monthlyStats.totalPnl.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Minus className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {monthlyStats.totalTrades}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-lg font-bold text-green-600">
                  {winRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Flagged</p>
                <p className="text-lg font-bold text-amber-600">
                  {monthlyStats.flaggedDays} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Trading Calendar
            <Badge variant="outline">
              {format(currentMonth, 'MMMM yyyy')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading calendar...</div>
            </div>
          ) : (
            <div className="calendar-grid grid grid-cols-7 gap-1">
              {/* Calendar headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-sm font-medium text-gray-500 text-center">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {eachDayOfInterval({
                start: startOfMonth(currentMonth),
                end: endOfMonth(currentMonth)
              }).map(date => (
                <div key={date.toISOString()} className="h-20 border border-gray-200 dark:border-gray-700 rounded-md">
                  {renderCalendarDay(date)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
