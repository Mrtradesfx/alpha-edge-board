
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeSentimentData } from '@/hooks/useRealTimeData';
import { usePriceData } from '@/hooks/usePriceData';

export interface SecureAlert {
  id: string;
  user_id: string;
  symbol: string;
  alert_price: number;
  direction: 'above' | 'below';
  label: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriggeredAlert {
  id: string;
  symbol: string;
  message: string;
  timestamp: string;
  context: {
    sentiment?: any;
    cotData?: any;
    price: number;
  };
}

export const useSecureAlerts = () => {
  const [alerts, setAlerts] = useState<SecureAlert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: sentimentData } = useRealTimeSentimentData();
  const { priceData } = usePriceData();

  // Load alerts from database
  const loadAlerts = async () => {
    if (!user) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading alerts:', error);
        toast({
          title: "Error loading alerts",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAlerts(data || []);
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
      toast({
        title: "Error loading alerts",
        description: "Failed to load your alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [user]);

  // Monitor for triggered alerts
  useEffect(() => {
    if (!isMonitoring || alerts.length === 0 || !user) return;

    const interval = setInterval(() => {
      const simplePriceData: { [symbol: string]: number } = {};
      Object.entries(priceData).forEach(([symbol, data]) => {
        simplePriceData[symbol] = data.price;
      });

      const newTriggeredAlerts: TriggeredAlert[] = [];

      alerts.forEach(alert => {
        if (!alert.is_active) return;
        
        const currentPrice = simplePriceData[alert.symbol];
        if (!currentPrice) return;

        const isTriggered = alert.direction === 'below' 
          ? currentPrice <= alert.alert_price
          : currentPrice >= alert.alert_price;

        if (isTriggered) {
          newTriggeredAlerts.push({
            id: alert.id,
            symbol: alert.symbol,
            message: `🚨 ${alert.symbol} hit your ${alert.label} zone at ${currentPrice.toFixed(4)}`,
            timestamp: new Date().toISOString(),
            context: {
              sentiment: sentimentData,
              price: currentPrice
            }
          });
        }
      });

      if (newTriggeredAlerts.length > 0) {
        setTriggeredAlerts(prev => {
          const existing = prev.map(a => a.id);
          const filtered = newTriggeredAlerts.filter(a => !existing.includes(a.id));
          return [...prev, ...filtered];
        });

        // Deactivate triggered alerts
        newTriggeredAlerts.forEach(triggeredAlert => {
          toggleAlert(triggeredAlert.id);
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [alerts, priceData, sentimentData, isMonitoring, user]);

  const addAlert = async (alertData: Omit<SecureAlert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create alerts",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert([{
          ...alertData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating alert:', error);
        toast({
          title: "Error creating alert",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setAlerts(prev => [data, ...prev]);
      toast({
        title: "Alert created",
        description: `Alert for ${alertData.symbol} at ${alertData.alert_price}`,
      });
      return data;
    } catch (err) {
      console.error('Error creating alert:', err);
      toast({
        title: "Error creating alert",
        description: "Failed to create alert",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: "Error deleting alert",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        toast({
          title: "Alert deleted",
          description: "Alert has been removed",
        });
      }
    } catch (err) {
      console.error('Error deleting alert:', err);
      toast({
        title: "Error deleting alert",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: !alert.is_active })
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error toggling alert:', error);
        toast({
          title: "Error updating alert",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAlerts(prev => 
          prev.map(a => 
            a.id === alertId ? { ...a, is_active: !a.is_active } : a
          )
        );
      }
    } catch (err) {
      console.error('Error toggling alert:', err);
      toast({
        title: "Error updating alert",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const dismissTriggeredAlert = (alertId: string) => {
    setTriggeredAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const clearAllTriggeredAlerts = () => {
    setTriggeredAlerts([]);
  };

  return {
    alerts,
    triggeredAlerts,
    isLoading,
    isMonitoring,
    setIsMonitoring,
    addAlert,
    removeAlert,
    toggleAlert,
    dismissTriggeredAlert,
    clearAllTriggeredAlerts
  };
};
