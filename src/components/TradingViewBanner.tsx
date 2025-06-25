
import { useEffect, useRef } from 'react';

interface TradingViewBannerProps {
  symbols?: string[];
  colorTheme?: 'light' | 'dark';
  isTransparent?: boolean;
  displayMode?: 'adaptive' | 'compact' | 'regular';
}

const TradingViewBanner = ({ 
  symbols = [
    "FX:EURUSD",
    "FX:GBPUSD", 
    "FX:USDJPY",
    "FX:AUDUSD",
    "OANDA:XAUUSD",
    "CRYPTOCAP:BTC",
    "CRYPTOCAP:ETH",
    "INDEX:SPX",
    "INDEX:DJI",
    "INDEX:NDX"
  ],
  colorTheme = 'light',
  isTransparent = true,
  displayMode = 'adaptive'
}: TradingViewBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols.map(symbol => ({
        proName: symbol,
        title: symbol.split(':')[1] || symbol
      })),
      showSymbolLogo: true,
      colorTheme: colorTheme,
      isTransparent: isTransparent,
      displayMode: displayMode,
      locale: "en"
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbols, colorTheme, isTransparent, displayMode]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div 
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: '46px', width: '100%' }}
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default TradingViewBanner;
