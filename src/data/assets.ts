
export interface Asset {
  value: string;
  label: string;
  category: string;
}

export const assets: Asset[] = [
  // Major Currency Pairs
  { value: "EUR", label: "EUR/USD", category: "Major Currencies" },
  { value: "GBP", label: "GBP/USD", category: "Major Currencies" },
  { value: "JPY", label: "USD/JPY", category: "Major Currencies" },
  { value: "CHF", label: "USD/CHF", category: "Major Currencies" },
  { value: "CAD", label: "USD/CAD", category: "Major Currencies" },
  { value: "AUD", label: "AUD/USD", category: "Major Currencies" },
  { value: "NZD", label: "NZD/USD", category: "Major Currencies" },
  
  // Cross Currency Pairs
  { value: "EURGBP", label: "EUR/GBP", category: "Cross Currencies" },
  { value: "EURJPY", label: "EUR/JPY", category: "Cross Currencies" },
  { value: "EURCHF", label: "EUR/CHF", category: "Cross Currencies" },
  { value: "GBPJPY", label: "GBP/JPY", category: "Cross Currencies" },
  { value: "GBPCHF", label: "GBP/CHF", category: "Cross Currencies" },
  { value: "CHFJPY", label: "CHF/JPY", category: "Cross Currencies" },
  
  // Exotic Currency Pairs
  { value: "USDTRY", label: "USD/TRY", category: "Exotic Currencies" },
  { value: "USDZAR", label: "USD/ZAR", category: "Exotic Currencies" },
  { value: "USDMXN", label: "USD/MXN", category: "Exotic Currencies" },
  { value: "USDSEK", label: "USD/SEK", category: "Exotic Currencies" },
  { value: "USDNOK", label: "USD/NOK", category: "Exotic Currencies" },
  { value: "USDPLN", label: "USD/PLN", category: "Exotic Currencies" },
  { value: "USDSGD", label: "USD/SGD", category: "Exotic Currencies" },
  { value: "USDHKD", label: "USD/HKD", category: "Exotic Currencies" },
  
  // Cryptocurrencies
  { value: "BTC", label: "Bitcoin", category: "Cryptocurrencies" },
  { value: "ETH", label: "Ethereum", category: "Cryptocurrencies" },
  { value: "LTC", label: "Litecoin", category: "Cryptocurrencies" },
  { value: "XRP", label: "Ripple", category: "Cryptocurrencies" },
  
  // Commodities
  { value: "GOLD", label: "Gold", category: "Commodities" },
  { value: "SILVER", label: "Silver", category: "Commodities" },
  { value: "OIL", label: "Crude Oil (WTI)", category: "Commodities" },
  { value: "BRENT", label: "Brent Oil", category: "Commodities" },
  { value: "NATGAS", label: "Natural Gas", category: "Commodities" },
  { value: "COPPER", label: "Copper", category: "Commodities" },
  { value: "WHEAT", label: "Wheat", category: "Commodities" },
  { value: "CORN", label: "Corn", category: "Commodities" },
  { value: "SOYBEAN", label: "Soybeans", category: "Commodities" },
  
  // Indices
  { value: "US30", label: "US30 (Dow Jones)", category: "Indices" },
  { value: "NASDAQ", label: "NASDAQ 100", category: "Indices" },
  { value: "SP500", label: "S&P 500", category: "Indices" },
  { value: "RUSSELL", label: "Russell 2000", category: "Indices" },
  { value: "DAX", label: "DAX 40", category: "Indices" },
  { value: "FTSE", label: "FTSE 100", category: "Indices" },
  { value: "NIKKEI", label: "Nikkei 225", category: "Indices" },
  { value: "ASX", label: "ASX 200", category: "Indices" },
];

export const getGroupedAssets = () => {
  return assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);
};

export const getAssetLabel = (value: string) => {
  return assets.find(asset => asset.value === value)?.label || value;
};
