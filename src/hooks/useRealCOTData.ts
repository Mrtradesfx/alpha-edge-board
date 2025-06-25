
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type COTReport = Database['public']['Tables']['cot_reports']['Row'];

export interface COTDataPoint {
  date: string;
  commercial: number;
  nonCommercial: number;
  commercial2?: number;
  nonCommercial2?: number;
}

export const useRealCOTData = (assetSymbol: string) => {
  const [data, setData] = useState<COTDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCOTData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching COT data for ${assetSymbol}`);

      const { data: cotReports, error: fetchError } = await supabase
        .from('cot_reports')
        .select('*')
        .eq('asset_symbol', assetSymbol)
        .order('report_date', { ascending: false })
        .limit(52); // Last 52 weeks

      if (fetchError) {
        console.error('Error fetching COT data:', fetchError);
        throw fetchError;
      }

      if (!cotReports || cotReports.length === 0) {
        console.log(`No COT data found for ${assetSymbol}, triggering data fetch`);
        
        // Trigger data fetch from CFTC
        const { error: functionError } = await supabase.functions.invoke('fetch-cot-data');
        
        if (functionError) {
          console.error('Error calling fetch-cot-data function:', functionError);
        }
        
        // Set empty data for now
        setData([]);
        setLastUpdated(new Date());
        return;
      }

      // Transform data for charts
      const transformedData: COTDataPoint[] = cotReports
        .reverse() // Show chronological order
        .map((report: COTReport) => ({
          date: new Date(report.report_date).toLocaleDateString(),
          commercial: report.commercial_net,
          nonCommercial: report.non_commercial_net,
        }));

      console.log(`Loaded ${transformedData.length} COT data points for ${assetSymbol}`);
      setData(transformedData);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('Error in useRealCOTData:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch COT data');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('Manually refreshing COT data...');
    
    try {
      // Trigger fresh data fetch from CFTC
      await supabase.functions.invoke('fetch-cot-data');
      
      // Wait a moment then refetch our data
      setTimeout(() => {
        fetchCOTData();
      }, 2000);
      
    } catch (err) {
      console.error('Error refreshing COT data:', err);
    }
  };

  useEffect(() => {
    if (assetSymbol) {
      fetchCOTData();
    }
  }, [assetSymbol]);

  return { 
    data, 
    isLoading, 
    error, 
    lastUpdated, 
    refetch: fetchCOTData,
    refreshData 
  };
};

export const useRealCOTComparison = (assetSymbol1: string, assetSymbol2: string) => {
  const [combinedData, setCombinedData] = useState<COTDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!assetSymbol1 || !assetSymbol2) {
        setCombinedData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [{ data: data1 }, { data: data2 }] = await Promise.all([
          supabase
            .from('cot_reports')
            .select('*')
            .eq('asset_symbol', assetSymbol1)
            .order('report_date', { ascending: false })
            .limit(52),
          supabase
            .from('cot_reports')
            .select('*')
            .eq('asset_symbol', assetSymbol2)
            .order('report_date', { ascending: false })
            .limit(52)
        ]);

        if (!data1 || !data2) {
          setCombinedData([]);
          return;
        }

        // Create a map for easier lookup
        const data2Map = new Map(
          data2.map(report => [report.report_date, report])
        );

        // Combine data where dates match
        const combined: COTDataPoint[] = data1
          .map(report1 => {
            const report2 = data2Map.get(report1.report_date);
            if (!report2) return null;

            return {
              date: new Date(report1.report_date).toLocaleDateString(),
              commercial: report1.commercial_net,
              nonCommercial: report1.non_commercial_net,
              commercial2: report2.commercial_net,
              nonCommercial2: report2.non_commercial_net,
            };
          })
          .filter(item => item !== null)
          .reverse(); // Chronological order

        setCombinedData(combined);

      } catch (err) {
        console.error('Error fetching comparison data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch comparison data');
        setCombinedData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [assetSymbol1, assetSymbol2]);

  return { data: combinedData, isLoading, error };
};
