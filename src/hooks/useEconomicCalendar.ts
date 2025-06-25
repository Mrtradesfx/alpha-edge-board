
import { useQuery } from '@tanstack/react-query';

interface EconomicEvent {
  CalendarId: string;
  Date: string;
  Country: string;
  Category: string;
  Event: string;
  Reference: string;
  Source: string;
  SourceURL: string;
  Actual: string | null;
  Previous: string;
  Forecast: string;
  TEForecast: string;
  URL: string;
  Importance: number;
  LastUpdate: string;
  Revised: string;
  OCountry: string;
  OCategory: string;
  Currency: string;
  Unit: string;
  Ticker: string;
  Symbol: string;
}

interface ProcessedEvent {
  id: string;
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual: string | null;
  currency: string;
}

const processEvents = (events: EconomicEvent[]): ProcessedEvent[] => {
  return events.map(event => {
    const date = new Date(event.Date);
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });

    // Map importance to impact level
    let impact: 'high' | 'medium' | 'low' = 'low';
    if (event.Importance >= 3) impact = 'high';
    else if (event.Importance >= 2) impact = 'medium';

    // Get currency code from country or use default mapping
    const currencyMap: Record<string, string> = {
      'United States': 'USD',
      'Euro Zone': 'EUR',
      'United Kingdom': 'GBP',
      'Canada': 'CAD',
      'Japan': 'JPY',
      'Australia': 'AUD',
      'Switzerland': 'CHF',
      'New Zealand': 'NZD'
    };

    const currency = event.Currency || currencyMap[event.Country] || 'USD';

    return {
      id: event.CalendarId,
      time,
      country: currency,
      event: event.Event,
      impact,
      forecast: event.Forecast || event.TEForecast || '-',
      previous: event.Previous || '-',
      actual: event.Actual,
      currency
    };
  });
};

export const useEconomicCalendar = (countries: string[] = ['United States']) => {
  return useQuery({
    queryKey: ['economic-calendar', countries],
    queryFn: async () => {
      const countryQueries = countries.map(country => 
        encodeURIComponent(country)
      ).join(',');
      
      const response = await fetch(
        `https://api.tradingeconomics.com/calendar/country/${countryQueries}?c=guest:guest`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EconomicEvent[] = await response.json();
      console.log('Economic calendar data fetched:', data.length, 'events');
      
      // Filter for today's events and process them
      const today = new Date().toDateString();
      const todayEvents = data.filter(event => {
        const eventDate = new Date(event.Date).toDateString();
        return eventDate === today;
      });

      return processEvents(todayEvents);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
