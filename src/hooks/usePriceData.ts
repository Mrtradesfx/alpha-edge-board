
import { useState, useEffect } from 'react';

interface PriceData {
  [asset: string]: {
    price: number;
    change24h: number;
  };
}

export const usePriceData = () => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const generateMockPrices = (): PriceData => {
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
      'PLATINUM': { price: 995.25 + Math.sin(baseTime / 190000) * 12, change24h: (Math.random() - 0.5) * 3.2 },
      'PALLADIUM': { price: 1025.75 + Math.sin(baseTime / 175000) * 15, change24h: (Math.random() - 0.5) * 4.5 },
      
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
      'BNB': { price: 315.75 + Math.sin(baseTime / 290000) * 12, change24h: (Math.random() - 0.5) * 7 },
      'SOL': { price: 98.25 + Math.sin(baseTime / 270000) * 5, change24h: (Math.random() - 0.5) * 10 },
      'XRP': { price: 0.6125 + Math.sin(baseTime / 310000) * 0.03, change24h: (Math.random() - 0.5) * 12 },
      'ADA': { price: 0.4850 + Math.sin(baseTime / 320000) * 0.025, change24h: (Math.random() - 0.5) * 9 },
    };
  };

  useEffect(() => {
    const updatePrices = () => {
      setPriceData(generateMockPrices());
      setLastUpdated(new Date());
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000); // Update every 3 seconds for more realistic feeds

    return () => clearInterval(interval);
  }, []);

  return { priceData, lastUpdated };
};
