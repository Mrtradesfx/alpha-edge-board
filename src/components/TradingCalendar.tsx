
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, eachWeekOfInterval, eachDayOfInterval, isSameMonth } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DailyTradeModal from './DailyTradeModal';
import TradingCalendarHeader from './calendar/TradingCalendarHeader';
import MonthlyStatsCards from './calendar/MonthlyStatsCards';
import CalendarGrid from './calendar/CalendarGrid';
import WeeklyStatsSidebar from './calendar/WeeklyStatsSidebar';

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

  const monthlyStats = dailySummaries.reduce((acc, day) => {
    acc.totalPnl += day.net_pnl;
    acc.totalTrades += day.trade_count;
    acc.profitableDays += day.net_pnl > 0 ? 1 : 0;
    acc.flaggedDays += day.ai_flagged ? 1 : 0;
    return acc;
  }, { totalPnl: 0, totalTrades: 0, profitableDays: 0, flaggedDays: 0 });

  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 min-h-screen">
      <TradingCalendarHeader />
      
      <MonthlyStatsCards stats={monthlyStats} />

      <div className="flex gap-6">
        <div className="flex-1">
          <CalendarGrid
            currentMonth={currentMonth}
            dailySummaries={dailySummaries}
            loading={loading}
            onNavigateMonth={navigateMonth}
            onDayClick={handleDayClick}
          />
        </div>

        <WeeklyStatsSidebar weeklyStats={weeklyStats} />
      </div>

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
