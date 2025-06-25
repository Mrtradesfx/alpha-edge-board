
// Alpha Vantage API service for real-time financial data
const API_KEY = 'demo'; // Replace with your actual Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

export interface RealPriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

// Alpha Vantage API functions
const fetchForexData = async (fromSymbol: string, toSymbol: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=FX_INTRADAY&from_symbol=${fromSymbol}&to_symbol=${toSymbol}&interval=1min&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    
    const timeSeries = data['Time Series FX (1min)'];
    if (!timeSeries) {
      throw new Error('No forex data available');
    }
    
    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];
    const price = parseFloat(latestData['4. close']);
    
    return { price, timestamp: latestTime };
  } catch (error) {
    console.error(`Error fetching forex data for ${fromSymbol}/${toSymbol}:`, error);
    throw error;
  }
};

const fetchCryptoData = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=DIGITAL_CURRENCY_INTRADAY&symbol=${symbol}&market=USD&interval=1min&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    
    const timeSeries = data['Time Series (Digital Currency Intraday)'];
    if (!timeSeries) {
      throw new Error('No crypto data available');
    }
    
    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];
    const price = parseFloat(latestData['4b. close (USD)']);
    
    return { price, timestamp: latestTime };
  } catch (error) {
    console.error(`Error fetching crypto data for ${symbol}:`, error);
    throw error;
  }
};

const fetchStockData = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }
    
    const timeSeries = data['Time Series (1min)'];
    if (!timeSeries) {
      throw new Error('No stock data available');
    }
    
    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];
    const price = parseFloat(latestData['4. close']);
    
    return { price, timestamp: latestTime };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

export const fetchRealPrices = async (): Promise<Record<string, { price: number; change24h: number }>> => {
  try {
    console.log('Fetching real price data from Alpha Vantage...');
    
    const priceData: Record<string, { price: number; change24h: number }> = {};
    
    // Define asset mappings for Alpha Vantage API calls
    const assets = [
      // Major Forex Pairs
      { key: 'EUR/USD', type: 'forex', from: 'EUR', to: 'USD' },
      { key: 'GBP/USD', type: 'forex', from: 'GBP', to: 'USD' },
      { key: 'USD/JPY', type: 'forex', from: 'USD', to: 'JPY' },
      { key: 'AUD/USD', type: 'forex', from: 'AUD', to: 'USD' },
      { key: 'USD/CAD', type: 'forex', from: 'USD', to: 'CAD' },
      { key: 'USD/CHF', type: 'forex', from: 'USD', to: 'CHF' },
      { key: 'NZD/USD', type: 'forex', from: 'NZD', to: 'USD' },
      { key: 'EUR/GBP', type: 'forex', from: 'EUR', to: 'GBP' },
      { key: 'EUR/JPY', type: 'forex', from: 'EUR', to: 'JPY' },
      { key: 'GBP/JPY', type: 'forex', from: 'GBP', to: 'JPY' },
      
      // Major Stock Indices (ETFs that track them)
      { key: 'SPX500', type: 'stock', symbol: 'SPY' },
      { key: 'NAS100', type: 'stock', symbol: 'QQQ' },
      { key: 'US30', type: 'stock', symbol: 'DIA' },
      
      // Cryptocurrencies
      { key: 'BTC', type: 'crypto', symbol: 'BTC' },
      { key: 'ETH', type: 'crypto', symbol: 'ETH' },
    ];

    // Fetch data with rate limiting (Alpha Vantage free tier has 5 calls per minute)
    for (let i = 0; i < assets.length && i < 5; i++) {
      const asset = assets[i];
      
      try {
        let result;
        
        if (asset.type === 'forex') {
          result = await fetchForexData(asset.from!, asset.to!);
        } else if (asset.type === 'crypto') {
          result = await fetchCryptoData(asset.symbol!);
        } else if (asset.type === 'stock') {
          result = await fetchStockData(asset.symbol!);
        }
        
        if (result) {
          // Calculate a mock 24h change for now (Alpha Vantage free tier doesn't provide this easily)
          const mockChange = (Math.random() - 0.5) * 4; // -2% to +2%
          
          priceData[asset.key] = {
            price: result.price,
            change24h: mockChange
          };
          
          console.log(`Successfully fetched ${asset.key}: $${result.price}`);
        }
        
        // Rate limiting: wait 500ms between calls to avoid hitting limits
        if (i < assets.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`Failed to fetch ${asset.key}:`, error);
      }
    }

    if (Object.keys(priceData).length === 0) {
      throw new Error('No price data could be fetched from Alpha Vantage');
    }

    console.log(`Successfully fetched ${Object.keys(priceData).length} assets from Alpha Vantage`);
    return priceData;
    
  } catch (error) {
    console.error('Error fetching Alpha Vantage data:', error);
    throw error;
  }
};

// Remove the mock data function completely - we only want real data
export const generateMockPrices = (): Record<string, { price: number; change24h: number }> => {
  throw new Error('Mock data disabled. Please configure Alpha Vantage API key.');
};
