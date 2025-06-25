
import { useState, useEffect } from 'react';
import { fetchRealPrices, generateMockPrices } from '@/services/priceService';

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

  const updatePrices = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching real price data...');
      
      const realPrices = await fetchRealPrices();
      
      if (Object.keys(realPrices).length > 0) {
        setPriceData(realPrices);
        setIsRealData(true);
        setLastUpdated(new Date());
        console.log('Successfully loaded real price data for', Object.keys(realPrices).length, 'assets');
      } else {
        throw new Error('No real price data received');
      }
    } catch (error) {
      console.log('Real price feed failed, using mock data:', error);
      const mockPrices = generateMockPrices();
      setPriceData(mockPrices);
      setIsRealData(false);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePrices();
    
    // Update every 60 seconds for real data (to avoid rate limits)
    const interval = setInterval(updatePrices, 60000);

    return () => clearInterval(interval);
  }, []);

  return { 
    priceData, 
    lastUpdated, 
    isRealData, 
    isLoading,
    refetch: updatePrices 
  };
};
