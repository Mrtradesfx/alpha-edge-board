
// Map asset values to price data keys
export const getPriceDataKey = (assetValue: string): string | null => {
  const mapping: Record<string, string | null> = {
    // Major currencies that we have data for
    'EUR': 'EUR/USD',
    'GBP': 'GBP/USD', 
    'JPY': 'USD/JPY',
    'AUD': 'AUD/USD',
    'CAD': 'USD/CAD',
    'CHF': 'USD/CHF',
    'NZD': 'NZD/USD',
    'EURGBP': 'EUR/GBP',
    'EURJPY': 'EUR/JPY',
    'GBPJPY': 'GBP/JPY',
    
    // Crypto
    'BTC': 'BTC',
    'ETH': 'ETH',
    
    // Indices (mapped to ETF symbols we use)
    'US30': 'US30',
    'NASDAQ': 'NAS100',
    'SP500': 'SPX500',
    
    // For assets we don't have API data, return null
    'GOLD': null,
    'SILVER': null,
    'OIL': null,
    'COPPER': null,
    'WHEAT': null,
    'CORN': null,
    'SOYBEAN': null,
    'NATGAS': null,
    'BRENT': null,
    'LTC': null,
    'XRP': null,
    'DAX': null,
    'FTSE': null,
    'NIKKEI': null,
    'ASX': null,
    'RUSSELL': null,
    'USDTRY': null,
    'USDZAR': null,
    'USDMXN': null,
    'USDSEK': null,
    'USDNOK': null,
    'USDPLN': null,
    'USDSGD': null,
    'USDHKD': null,
    'EURCHF': null,
    'GBPCHF': null,
    'CHFJPY': null
  };
  
  return mapping[assetValue] || null;
};

// Generate timeframe data for each asset
export const generateTimeframeData = (): {
  M1: number;
  M5: number;
  M15: number;
  M30: number;
  H1: number;
  H4: number;
  D1: number;
  W1: number;
  MN: number;
} => {
  return {
    M1: (Math.random() - 0.5) * 4,   // -2% to +2%
    M5: (Math.random() - 0.5) * 6,   // -3% to +3%
    M15: (Math.random() - 0.5) * 8,  // -4% to +4%
    M30: (Math.random() - 0.5) * 10, // -5% to +5%
    H1: (Math.random() - 0.5) * 12,  // -6% to +6%
    H4: (Math.random() - 0.5) * 16,  // -8% to +8%
    D1: (Math.random() - 0.5) * 20,  // -10% to +10%
    W1: (Math.random() - 0.5) * 30,  // -15% to +15%
    MN: (Math.random() - 0.5) * 50   // -25% to +25%
  };
};

export const getPerformanceColor = (value: number) => {
  if (value >= 5) return "bg-green-600 text-white";
  if (value >= 2) return "bg-green-500 text-white";
  if (value >= 0.5) return "bg-green-400 text-white";
  if (value >= -0.5) return "bg-yellow-400 text-black";
  if (value >= -2) return "bg-orange-500 text-white";
  if (value >= -5) return "bg-red-500 text-white";
  return "bg-red-600 text-white";
};

export const formatPerformance = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
};

export const formatPrice = (price: number | undefined, asset: string) => {
  if (!price) return "N/A";
  
  if (asset.includes('/')) {
    return price.toFixed(4);
  } else if (asset === 'BTC' || asset === 'ETH') {
    return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else if (asset === 'GOLD' || asset === 'SILVER') {
    return price.toFixed(2);
  } else {
    return price.toFixed(2);
  }
};
