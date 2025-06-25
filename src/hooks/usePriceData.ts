
import { useState, useEffect } from 'react';
import { fetchRealPrices } from '@/services/priceService';

interface PriceData {
  [asset: string]: {
    price: number;
    change24h: number;
  };
}

export const usePriceData = () => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealData, setIsRealData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updatePrices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching real price data from Alpha Vantage...');
      
      const realPrices = await fetchRealPrices();
      
      if (Object.keys(realPrices).length > 0) {
        setPriceData(realPrices);
        setIsRealData(true);
        setLastUpdated(new Date());
        console.log('Successfully loaded Alpha Vantage price data for', Object.keys(realPrices).length, 'assets');
      } else {
        throw new Error('No price data received from Alpha Vantage');
      }
    } catch (error) {
      console.error('Alpha Vantage price feed failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch price data');
      setIsRealData(false);
      // Don't fallback to mock data - show error instead
      setPriceData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePrices();
    
    // Update every 2 minutes (Alpha Vantage free tier limit)
    const interval = setInterval(updatePrices, 120000);

    return () => clearInterval(interval);
  }, []);

  return { 
    priceData, 
    lastUpdated, 
    isRealData, 
    isLoading,
    error,
    refetch: updatePrices 
  };
};
