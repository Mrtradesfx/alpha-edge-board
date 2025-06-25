
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
      // Major Currencies
      'EUR/USD': { price: 1.0850 + Math.sin(baseTime / 100000) * 0.005, change24h: (Math.random() - 0.5) * 2 },
      'GBP/USD': { price: 1.2650 + Math.sin(baseTime / 120000) * 0.008, change24h: (Math.random() - 0.5) * 2.5 },
      'USD/JPY': { price: 150.25 + Math.sin(baseTime / 110000) * 0.5, change24h: (Math.random() - 0.5) * 1.8 },
      'AUD/USD': { price: 0.6580 + Math.sin(baseTime / 130000) * 0.006, change24h: (Math.random() - 0.5) * 2.2 },
      'USD/CAD': { price: 1.3650 + Math.sin(baseTime / 140000) * 0.007, change24h: (Math.random() - 0.5) * 1.9 },
      'USD/CHF': { price: 0.8950 + Math.sin(baseTime / 115000) * 0.004, change24h: (Math.random() - 0.5) * 1.5 },
      'NZD/USD': { price: 0.6180 + Math.sin(baseTime / 125000) * 0.005, change24h: (Math.random() - 0.5) * 2.8 },
      
      // Commodities
      'GOLD': { price: 2065.50 + Math.sin(baseTime / 200000) * 15, change24h: (Math.random() - 0.5) * 3 },
      'SILVER': { price: 24.85 + Math.sin(baseTime / 180000) * 1.2, change24h: (Math.random() - 0.5) * 4 },
      'OIL': { price: 78.45 + Math.sin(baseTime / 160000) * 3, change24h: (Math.random() - 0.5) * 5 },
      'COPPER': { price: 3.85 + Math.sin(baseTime / 170000) * 0.15, change24h: (Math.random() - 0.5) * 3.5 },
      
      // Indices
      'SPX500': { price: 4580.25 + Math.sin(baseTime / 220000) * 50, change24h: (Math.random() - 0.5) * 2 },
      'NAS100': { price: 15850.75 + Math.sin(baseTime / 210000) * 150, change24h: (Math.random() - 0.5) * 2.5 },
      'US30': { price: 35420.50 + Math.sin(baseTime / 230000) * 200, change24h: (Math.random() - 0.5) * 1.8 },
      'UK100': { price: 7650.25 + Math.sin(baseTime / 190000) * 80, change24h: (Math.random() - 0.5) * 2.2 },
      'GER40': { price: 16250.75 + Math.sin(baseTime / 240000) * 120, change24h: (Math.random() - 0.5) * 2.1 },
      'JPN225': { price: 33150.50 + Math.sin(baseTime / 250000) * 300, change24h: (Math.random() - 0.5) * 1.9 },
      
      // Crypto
      'BTC': { price: 42850.00 + Math.sin(baseTime / 300000) * 2000, change24h: (Math.random() - 0.5) * 8 },
      'ETH': { price: 2580.50 + Math.sin(baseTime / 280000) * 150, change24h: (Math.random() - 0.5) * 10 },
      'BNB': { price: 315.75 + Math.sin(baseTime / 290000) * 20, change24h: (Math.random() - 0.5) * 12 },
      'SOL': { price: 98.25 + Math.sin(baseTime / 270000) * 8, change24h: (Math.random() - 0.5) * 15 },
    };
  };

  useEffect(() => {
    const updatePrices = () => {
      setPriceData(generateMockPrices());
      setLastUpdated(new Date());
    };

    updatePrices();
    const interval = setInterval(updatePrices, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { priceData, lastUpdated };
};
