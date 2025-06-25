
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Target, Calendar, Refresh } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface WeeklyStats {
  totalTrades: number;
  totalPnl: number;
  avgRisk: number;
  winRate: number;
  overtradingFlag: boolean;
  sessionAlignment: string[];
  dominantStrategy: string;
}

const AICoachSidebar = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWeeklyStats();
    }
  }, [user, currentWeek]);

  const fetchWeeklyStats = async () => {
    if (!user) return;

    setLoading(true);
    const weekStart = format(startOfWeek(currentWeek), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(currentWeek), 'yyyy-MM-dd');

    try {
      // Fetch trades for the week
      const { data: trades, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd);

      if (error) throw error;

      // Calculate weekly statistics
      const stats = calculateWeeklyStats(trades || []);
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
    setLoading(false);
  };

  const calculateWeeklyStats = (trades: any[]): WeeklyStats => {
    const totalTrades = trades.length;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = trades.filter(trade => trade.pnl > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const avgRisk = trades.length > 0 
      ? trades.reduce((sum, trade) => sum + (trade.risk_percent || 0), 0) / trades.length
      : 0;

    // Check for overtrading (more than 10 trades per day on average)
    const tradingDays = new Set(trades.map(trade => trade.date)).size;
    const overtradingFlag = tradingDays > 0 && (totalTrades / tradingDays) > 10;

    // Get session alignment
    const sessions = trades.map(trade => trade.session).filter(Boolean);
    const sessionAlignment = [...new Set(sessions)];

    // Get dominant strategy
    const strategies = trades.map(trade => trade.strategy_tag).filter(Boolean);
    const strategyCount = strategies.reduce((acc: any, strategy) => {
      acc[strategy] = (acc[strategy] || 0) + 1;
      return acc;
    }, {});
    const dominantStrategy = Object.keys(strategyCount).reduce((a, b) => 
      strategyCount[a] > strategyCount[b] ? a : b, '') || 'N/A';

    return {
      totalTrades,
      totalPnl,
      avgRisk,
      winRate,
      overtradingFlag,
      sessionAlignment,
      dominantStrategy
    };
  };

  const fetchWeeklyFeedback = async () => {
    if (!user || !weeklyStats) return;

    setLoadingFeedback(true);
    const weekStr = format(currentWeek, 'yyyy-[W]ww');

    try {
      const response = await supabase.functions.invoke('ai-weekly-feedback', {
        body: {
          week: weekStr,
          user_id: user.id,
          stats: weeklyStats
        }
      });

      if (response.data) {
        setAiFeedback(response.data.feedback);
      }
    } catch (error) {
      console.error('Error fetching weekly feedback:', error);
      setAiFeedback('Unable to fetch weekly insights at this time.');
    }
    setLoadingFeedback(false);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Coach</span>
        </h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={fetchWeeklyStats}
          disabled={loading}
        >
          <Refresh className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
              ←
            </Button>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Week of {format(startOfWeek(currentWeek), 'MMM dd')}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
              →
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Weekly Stats */}
      {weeklyStats && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Trades</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {weeklyStats.totalTrades}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly P&L</span>
                <span className={cn("font-bold", 
                  weeklyStats.totalPnl >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {weeklyStats.totalPnl >= 0 ? '+' : ''}${weeklyStats.totalPnl.toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                <span className="font-bold text-blue-600">
                  {weeklyStats.winRate.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Risk</span>
                <span className="font-bold text-amber-600">
                  {weeklyStats.avgRisk.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Flags and Alerts */}
          <div className="space-y-2">
            {weeklyStats.overtradingFlag && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      Overtrading Alert
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Strategy</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {weeklyStats.dominantStrategy}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {weeklyStats.sessionAlignment.map(session => (
                      <Badge key={session} variant="outline" className="text-xs">
                        {session}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Weekly Insights</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchWeeklyFeedback}
              disabled={loadingFeedback || !weeklyStats}
            >
              {loadingFeedback ? 'Analyzing...' : 'Get Insights'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {aiFeedback ? (
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {aiFeedback}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              Click "Get Insights" for AI coaching tips
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachSidebar;
