
import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  colorTheme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  interval?: string;
  hideSideToolbar?: boolean;
  allowSymbolChange?: boolean;
  saveImage?: boolean;
  hideDateRanges?: boolean;
  hideMarketStatus?: boolean;
  hideSymbolSearch?: boolean;
  showPopupButton?: boolean;
  locale?: string;
  utcOffset?: string;
  autosize?: boolean;
}

const TradingViewChart = ({
  symbol = "FX:EURUSD",
  colorTheme = 'light',
  width = "100%",
  height = 300,
  interval = "D",
  hideSideToolbar = true,
  allowSymbolChange = true,
  saveImage = false,
  hideDateRanges = true,
  hideMarketStatus = true,
  hideSymbolSearch = true,
  showPopupButton = false,
  locale = "en",
  utcOffset = "Etc/UTC",
  autosize = false
}: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: containerRef.current?.id || 'tradingview_chart',
          autosize: autosize,
          width: autosize ? undefined : width,
          height: autosize ? undefined : height,
          symbol: symbol,
          interval: interval,
          timezone: utcOffset,
          theme: colorTheme,
          style: "1",
          locale: locale,
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          withdateranges: !hideDateRanges,
          allow_symbol_change: allowSymbolChange,
          save_image: saveImage,
          hide_side_toolbar: hideSideToolbar,
          hide_legend: false,
          hide_volume: true,
          studies: [],
          show_popup_button: showPopupButton,
          popup_width: "1000",
          popup_height: "650",
          details: false,
          hotlist: false,
          calendar: false,
          news: []
        });
      }
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, colorTheme, width, height, interval, hideSideToolbar, allowSymbolChange, saveImage, hideDateRanges, hideMarketStatus, hideSymbolSearch, showPopupButton, locale, utcOffset, autosize]);

  return (
    <div className="w-full" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div 
        ref={containerRef}
        id={`tradingview_chart_${Math.random().toString(36).substr(2, 9)}`}
        className="w-full h-full"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    </div>
  );
};

// Declare TradingView on window object for TypeScript
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;
