
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssetData {
  asset: string;
  name: string;
  strength: number;
  change: number;
  category: string;
  timestamp: string;
}

export interface SentimentData {
  overall_score: number;
  trend: string;
  change: number;
  sources: {
    name: string;
    value: number;
    color: string;
  }[];
  timestamp: string;
}

export const useRealTimeAssetData = () => {
  const [data, setData] = useState<AssetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await supabase.functions.invoke('market-data', {
        body: { type: 'assets' }
      });

      if (response.error) {
        console.log('Supabase function error, using fallback data:', response.error.message);
        setIsConnected(false);
        setData([]);
        return;
      }

      setData(response.data || []);
      setIsConnected(true);
    } catch (err) {
      console.log('Error fetching asset data, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsConnected(false);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, isConnected, error, refetch: fetchData };
};

export const useRealTimeSentimentData = () => {
  const [data, setData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await supabase.functions.invoke('market-data', {
        body: { type: 'sentiment' }
      });

      if (response.error) {
        console.log('Supabase function error, using fallback data:', response.error.message);
        setIsConnected(false);
        setData(null);
        return;
      }

      setData(response.data || null);
      setIsConnected(true);
    } catch (err) {
      console.log('Error fetching sentiment data, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsConnected(false);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, isConnected, error, refetch: fetchData };
};
