
import { SentimentData } from '@/hooks/useRealTimeData';

export interface Alert {
  id: string;
  symbol: string;
  alertPrice: number;
  direction: 'above' | 'below';
  label: string;
  createdAt: string;
  isActive: boolean;
}

export interface TriggeredAlert {
  id: string;
  symbol: string;
  message: string;
  timestamp: string;
  context: {
    sentiment?: SentimentData;
    cotData?: any;
    price: number;
  };
}

// Mock COT data - in production this would come from your COT data source
const getMockCOTData = (symbol: string) => {
  const cotData: { [key: string]: any } = {
    'EURUSD': { commercialNet: -15000, specNet: 8000, bias: 'bearish' },
    'GBPUSD': { commercialNet: 12000, specNet: -5000, bias: 'bullish' },
    'USDJPY': { commercialNet: -8000, specNet: 3000, bias: 'bearish' },
    'AUDUSD': { commercialNet: 5000, specNet: -2000, bias: 'bullish' },
    'USDCAD': { commercialNet: -3000, specNet: 1500, bias: 'bearish' },
  };
  
  return cotData[symbol] || { commercialNet: 0, specNet: 0, bias: 'neutral' };
};

export const buildSmartMessage = ({
  symbol,
  price,
  sentiment,
  cotData,
  label
}: {
  symbol: string;
  price: number;
  sentiment?: SentimentData;
  cotData?: any;
  label: string;
}) => {
  const sentimentText = sentiment 
    ? `${sentiment.overall_score}% ${sentiment.trend}`
    : 'sentiment data unavailable';
    
  const cotText = cotData 
    ? `COT shows commercials ${cotData.bias}`
    : 'COT data unavailable';

  const cautionLevel = getCautionLevel(sentiment, cotData);

  return `🚨 ${symbol} hit your ${label} zone at ${price.toFixed(4)}

📊 Market Context:
• Sentiment: ${sentimentText}
• ${cotText}

${cautionLevel} ${getCautionAdvice(cautionLevel)}`;
};

const getCautionLevel = (sentiment?: SentimentData, cotData?: any): string => {
  if (!sentiment || !cotData) return '⚠️ CAUTION:';
  
  // High sentiment with opposing COT bias = high caution
  if ((sentiment.overall_score > 70 && cotData.bias === 'bearish') ||
      (sentiment.overall_score < 30 && cotData.bias === 'bullish')) {
    return '🚨 HIGH CAUTION:';
  }
  
  // Aligned signals = lower caution
  if ((sentiment.trend === 'bullish' && cotData.bias === 'bullish') ||
      (sentiment.trend === 'bearish' && cotData.bias === 'bearish')) {
    return '✅ ALIGNED SIGNALS:';
  }
  
  return '⚠️ MODERATE CAUTION:';
};

const getCautionAdvice = (cautionLevel: string): string => {
  switch (cautionLevel) {
    case '🚨 HIGH CAUTION:':
      return 'Retail sentiment conflicts with smart money. Consider waiting for confirmation.';
    case '✅ ALIGNED SIGNALS:':
      return 'Sentiment and COT data align. Good setup if it matches your plan.';
    default:
      return 'Mixed signals. Stick to your trading plan and risk management.';
  }
};

export const checkTriggeredAlerts = (
  alerts: Alert[],
  currentPrices: { [symbol: string]: number },
  sentimentData?: SentimentData
): TriggeredAlert[] => {
  const triggeredAlerts: TriggeredAlert[] = [];

  alerts.forEach(alert => {
    if (!alert.isActive) return;
    
    const currentPrice = currentPrices[alert.symbol];
    if (!currentPrice) return;

    const isTriggered = alert.direction === 'below' 
      ? currentPrice <= alert.alertPrice
      : currentPrice >= alert.alertPrice;

    if (isTriggered) {
      const cotData = getMockCOTData(alert.symbol);
      
      triggeredAlerts.push({
        id: alert.id,
        symbol: alert.symbol,
        message: buildSmartMessage({
          symbol: alert.symbol,
          price: currentPrice,
          sentiment: sentimentData,
          cotData,
          label: alert.label
        }),
        timestamp: new Date().toISOString(),
        context: {
          sentiment: sentimentData,
          cotData,
          price: currentPrice
        }
      });
    }
  });

  return triggeredAlerts;
};

// Local storage helpers (replace with Supabase in production)
export const saveAlert = (alert: Omit<Alert, 'id' | 'createdAt'>): Alert => {
  const newAlert: Alert = {
    ...alert,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  const alerts = getStoredAlerts();
  alerts.push(newAlert);
  localStorage.setItem('smartAlerts', JSON.stringify(alerts));
  
  return newAlert;
};

export const getStoredAlerts = (): Alert[] => {
  const stored = localStorage.getItem('smartAlerts');
  return stored ? JSON.parse(stored) : [];
};

export const removeAlert = (alertId: string): void => {
  const alerts = getStoredAlerts().filter(a => a.id !== alertId);
  localStorage.setItem('smartAlerts', JSON.stringify(alerts));
};

export const toggleAlert = (alertId: string): void => {
  const alerts = getStoredAlerts();
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.isActive = !alert.isActive;
    localStorage.setItem('smartAlerts', JSON.stringify(alerts));
  }
};
