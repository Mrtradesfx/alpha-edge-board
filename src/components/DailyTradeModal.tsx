
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, Clock, Target, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface Trade {
  id: string;
  symbol: string;
  entry_time: string;
  exit_time?: string;
  pnl: number;
  lot_size: number;
  strategy_tag?: string;
  session?: string;
  risk_percent?: number;
  notes?: string;
}

interface DailySummary {
  date: string;
  net_pnl: number;
  trade_count: number;
  ai_flagged: boolean;
}

interface DailyTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  dailySummary: DailySummary;
}

const DailyTradeModal = ({ isOpen, onClose, date, dailySummary }: DailyTradeModalProps) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchDayTrades();
    }
  }, [isOpen, user, date]);

  const fetchDayTrades = async () => {
    if (!user) return;

    setLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', dateStr)
      .order('entry_time', { ascending: true });

    if (error) {
      console.error('Error fetching trades:', error);
    } else {
      setTrades(data || []);
    }
    setLoading(false);
  };

  const fetchAIFeedback = async () => {
    if (!user || trades.length === 0) return;

    setLoadingFeedback(true);
    const dateStr = format(date, 'yyyy-MM-dd');

    try {
      const response = await supabase.functions.invoke('ai-trade-feedback', {
        body: {
          date: dateStr,
          user_id: user.id,
          trades: trades.map(t => ({
            symbol: t.symbol,
            pnl: t.pnl,
            risk_percent: t.risk_percent,
            session: t.session,
            strategy_tag: t.strategy_tag,
            entry_time: t.entry_time,
            lot_size: t.lot_size
          })),
          daily_summary: dailySummary
        }
      });

      if (response.data) {
        setAiFeedback(response.data.feedback);
      }
    } catch (error) {
      console.error('Error fetching AI feedback:', error);
      setAiFeedback('Unable to fetch AI feedback at this time.');
    }
    setLoadingFeedback(false);
  };

  const formatTime = (timeStr: string) => {
    return format(new Date(`2000-01-01T${timeStr}`), 'HH:mm');
  };

  const formatPnL = (pnl: number) => {
    return `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const tradeStats = trades.reduce((acc, trade) => {
    acc.totalPnl += trade.pnl;
    acc.winningTrades += trade.pnl > 0 ? 1 : 0;
    acc.totalRisk += trade.risk_percent || 0;
    return acc;
  }, { totalPnl: 0, winningTrades: 0, totalRisk: 0 });

  const winRate = trades.length > 0 ? (tradeStats.winningTrades / trades.length * 100).toFixed(1) : '0';
  const avgRisk = trades.length > 0 ? (tradeStats.totalRisk / trades.length).toFixed(1) : '0';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Trading Details - {format(date, 'MMM dd, yyyy')}</span>
              {dailySummary.ai_flagged && (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span className={getPnLColor(dailySummary.net_pnl)}>
                  {formatPnL(dailySummary.net_pnl)}
                </span>
              </div>
              <Badge variant="outline">
                {dailySummary.trade_count} trades
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Day Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                    <p className="text-lg font-bold text-blue-600">{winRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Risk %</p>
                    <p className="text-lg font-bold text-amber-600">{avgRisk}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {[...new Set(trades.map(t => t.session).filter(Boolean))].join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trades Table */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading trades...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Risk %</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Session</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>{formatTime(trade.entry_time)}</TableCell>
                        <TableCell>{trade.exit_time ? formatTime(trade.exit_time) : 'Open'}</TableCell>
                        <TableCell>{trade.lot_size}</TableCell>
                        <TableCell className={getPnLColor(trade.pnl)}>
                          {formatPnL(trade.pnl)}
                        </TableCell>
                        <TableCell>{trade.risk_percent ? `${trade.risk_percent}%` : 'N/A'}</TableCell>
                        <TableCell>
                          {trade.strategy_tag && (
                            <Badge variant="outline" className="text-xs">
                              {trade.strategy_tag}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{trade.session || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* AI Coach Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI Coach Feedback</span>
                </div>
                <Button 
                  onClick={fetchAIFeedback} 
                  disabled={loadingFeedback || trades.length === 0}
                  size="sm"
                >
                  {loadingFeedback ? 'Analyzing...' : 'Get Feedback'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiFeedback ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm">
                    {aiFeedback}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Click "Get Feedback" to receive AI coaching insights for this trading day.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trade Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your notes about this trading day..."
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyTradeModal;
