
// Real-time price service using Alpha Vantage (free tier)
const API_KEY = 'demo'; // Replace with actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

export interface RealPriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

// Backup service using Yahoo Finance alternative (no API key required)
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export const fetchRealPrices = async (): Promise<Record<string, { price: number; change24h: number }>> => {
  try {
    // Using Yahoo Finance API (free, no key required)
    const symbols = [
      'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCAD=X', 'USDCHF=X', 'NZDUSD=X',
      'EURGBP=X', 'EURJPY=X', 'GBPJPY=X',
      'GC=F', 'SI=F', 'CL=F', 'HG=F', // Gold, Silver, Oil, Copper
      '^GSPC', '^IXIC', '^DJI', '^FTSE', '^GDAXI', '^N225', '^AXJO', // Indices
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD' // Crypto
    ];

    const pricePromises = symbols.map(async (symbol) => {
      try {
        const response = await fetch(`${YAHOO_BASE_URL}/${symbol}?interval=1d&range=2d`);
        const data = await response.json();
        
        if (data.chart?.result?.[0]) {
          const result = data.chart.result[0];
          const quote = result.indicators.quote[0];
          const currentPrice = quote.close[quote.close.length - 1];
          const previousPrice = quote.close[quote.close.length - 2];
          
          if (currentPrice && previousPrice) {
            const change = ((currentPrice - previousPrice) / previousPrice) * 100;
            return {
              symbol,
              price: currentPrice,
              change24h: change
            };
          }
        }
        return null;
      } catch (error) {
        console.log(`Error fetching ${symbol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(pricePromises);
    const priceData: Record<string, { price: number; change24h: number }> = {};

    results.forEach((result) => {
      if (result) {
        // Map Yahoo symbols to our internal keys
        const keyMapping: Record<string, string> = {
          'EURUSD=X': 'EUR/USD',
          'GBPUSD=X': 'GBP/USD',
          'USDJPY=X': 'USD/JPY',
          'AUDUSD=X': 'AUD/USD',
          'USDCAD=X': 'USD/CAD',
          'USDCHF=X': 'USD/CHF',
          'NZDUSD=X': 'NZD/USD',
          'EURGBP=X': 'EUR/GBP',
          'EURJPY=X': 'EUR/JPY',
          'GBPJPY=X': 'GBP/JPY',
          'GC=F': 'GOLD',
          'SI=F': 'SILVER',
          'CL=F': 'OIL',
          'HG=F': 'COPPER',
          '^GSPC': 'SPX500',
          '^IXIC': 'NAS100',
          '^DJI': 'US30',
          '^FTSE': 'UK100',
          '^GDAXI': 'GER40',
          '^N225': 'JPN225',
          '^AXJO': 'AUS200',
          'BTC-USD': 'BTC',
          'ETH-USD': 'ETH',
          'BNB-USD': 'BNB',
          'SOL-USD': 'SOL',
          'XRP-USD': 'XRP',
          'ADA-USD': 'ADA'
        };

        const mappedKey = keyMapping[result.symbol];
        if (mappedKey) {
          priceData[mappedKey] = {
            price: result.price,
            change24h: result.change24h
          };
        }
      }
    });

    return priceData;
  } catch (error) {
    console.error('Error fetching real price data:', error);
    throw error;
  }
};

// Fallback to mock data if real API fails
export const generateMockPrices = (): Record<string, { price: number; change24h: number }> => {
  const baseTime = Date.now();
  
  return {
    // Major Currencies - realistic ranges
    'EUR/USD': { price: 1.0850 + Math.sin(baseTime / 100000) * 0.003, change24h: (Math.random() - 0.5) * 1.2 },
    'GBP/USD': { price: 1.2650 + Math.sin(baseTime / 120000) * 0.005, change24h: (Math.random() - 0.5) * 1.5 },
    'USD/JPY': { price: 150.25 + Math.sin(baseTime / 110000) * 0.3, change24h: (Math.random() - 0.5) * 1.0 },
    'AUD/USD': { price: 0.6580 + Math.sin(baseTime / 130000) * 0.004, change24h: (Math.random() - 0.5) * 1.8 },
    'USD/CAD': { price: 1.3650 + Math.sin(baseTime / 140000) * 0.005, change24h: (Math.random() - 0.5) * 1.3 },
    'USD/CHF': { price: 0.8950 + Math.sin(baseTime / 115000) * 0.003, change24h: (Math.random() - 0.5) * 1.1 },
    'NZD/USD': { price: 0.6180 + Math.sin(baseTime / 125000) * 0.004, change24h: (Math.random() - 0.5) * 2.0 },
    'EUR/GBP': { price: 0.8580 + Math.sin(baseTime / 135000) * 0.003, change24h: (Math.random() - 0.5) * 1.2 },
    'GBP/JPY': { price: 190.15 + Math.sin(baseTime / 145000) * 0.8, change24h: (Math.random() - 0.5) * 1.8 },
    'EUR/JPY': { price: 163.25 + Math.sin(baseTime / 155000) * 0.6, change24h: (Math.random() - 0.5) * 1.5 },
    
    // Commodities - realistic prices
    'GOLD': { price: 2065.50 + Math.sin(baseTime / 200000) * 8, change24h: (Math.random() - 0.5) * 2.5 },
    'SILVER': { price: 24.85 + Math.sin(baseTime / 180000) * 0.8, change24h: (Math.random() - 0.5) * 3.5 },
    'OIL': { price: 78.45 + Math.sin(baseTime / 160000) * 2, change24h: (Math.random() - 0.5) * 4.0 },
    'COPPER': { price: 3.85 + Math.sin(baseTime / 170000) * 0.1, change24h: (Math.random() - 0.5) * 2.8 },
    
    // Indices - realistic values
    'SPX500': { price: 4580.25 + Math.sin(baseTime / 220000) * 25, change24h: (Math.random() - 0.5) * 1.5 },
    'NAS100': { price: 15850.75 + Math.sin(baseTime / 210000) * 80, change24h: (Math.random() - 0.5) * 2.0 },
    'US30': { price: 35420.50 + Math.sin(baseTime / 230000) * 120, change24h: (Math.random() - 0.5) * 1.2 },
    'UK100': { price: 7650.25 + Math.sin(baseTime / 190000) * 45, change24h: (Math.random() - 0.5) * 1.8 },
    'GER40': { price: 16250.75 + Math.sin(baseTime / 240000) * 70, change24h: (Math.random() - 0.5) * 1.6 },
    'JPN225': { price: 33150.50 + Math.sin(baseTime / 250000) * 180, change24h: (Math.random() - 0.5) * 1.4 },
    'AUS200': { price: 7420.25 + Math.sin(baseTime / 260000) * 55, change24h: (Math.random() - 0.5) * 1.7 },
    
    // Crypto - realistic ranges
    'BTC': { price: 42850.00 + Math.sin(baseTime / 300000) * 1200, change24h: (Math.random() - 0.5) * 6 },
    'ETH': { price: 2580.50 + Math.sin(baseTime / 280000) * 80, change24h: (Math.random() - 0.5) * 8 },
  };
};
