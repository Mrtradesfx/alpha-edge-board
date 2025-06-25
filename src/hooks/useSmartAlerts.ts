
import { useState, useEffect } from 'react';
import { 
  Alert, 
  TriggeredAlert, 
  checkTriggeredAlerts,
  getStoredAlerts,
  saveAlert as saveAlertToStorage,
  removeAlert as removeAlertFromStorage,
  toggleAlert as toggleAlertInStorage
} from '@/services/alertsService';
import { useRealTimeSentimentData } from '@/hooks/useRealTimeData';
import { usePriceData } from '@/hooks/usePriceData';

export const useSmartAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const { data: sentimentData } = useRealTimeSentimentData();
  const { priceData } = usePriceData();

  // Load alerts from storage
  useEffect(() => {
    setAlerts(getStoredAlerts());
  }, []);

  // Monitor for triggered alerts
  useEffect(() => {
    if (!isMonitoring || alerts.length === 0) return;

    const interval = setInterval(() => {
      // Transform priceData to the expected format (symbol -> price number)
      const simplePriceData: { [symbol: string]: number } = {};
      Object.entries(priceData).forEach(([symbol, data]) => {
        simplePriceData[symbol] = data.price;
      });

      const newTriggeredAlerts = checkTriggeredAlerts(
        alerts,
        simplePriceData,
        sentimentData
      );

      if (newTriggeredAlerts.length > 0) {
        setTriggeredAlerts(prev => {
          // Avoid duplicate alerts
          const existing = prev.map(a => a.id);
          const filtered = newTriggeredAlerts.filter(a => !existing.includes(a.id));
          return [...prev, ...filtered];
        });

        // Deactivate triggered alerts to prevent spam
        newTriggeredAlerts.forEach(triggeredAlert => {
          toggleAlertInStorage(triggeredAlert.id);
        });
        
        // Refresh alerts state
        setAlerts(getStoredAlerts());
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [alerts, priceData, sentimentData, isMonitoring]);

  const addAlert = (alertData: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert = saveAlertToStorage(alertData);
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  };

  const removeAlert = (alertId: string) => {
    removeAlertFromStorage(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleAlert = (alertId: string) => {
    toggleAlertInStorage(alertId);
    setAlerts(getStoredAlerts());
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
    isMonitoring,
    setIsMonitoring,
    addAlert,
    removeAlert,
    toggleAlert,
    dismissTriggeredAlert,
    clearAllTriggeredAlerts
  };
};
