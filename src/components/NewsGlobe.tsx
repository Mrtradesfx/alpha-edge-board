
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useCanvasSetup } from './globe/useCanvasSetup';
import { useGlobeAnimation } from './globe/useGlobeAnimation';
import GlobeLegend from './globe/GlobeLegend';
import NewsLocationsList from './globe/NewsLocationsList';
import { NewsLocation } from './globe/types';
import { useTheme } from '@/contexts/ThemeContext';

const NewsGlobe = () => {
  const { canvasRef, canvasReady } = useCanvasSetup();
  const { theme } = useTheme();
  const [newsLocations] = useState<NewsLocation[]>([
    { id: 1, lat: 40.7128, lng: -74.0060, intensity: 0.9, sentiment: "bullish", headline: "Fed Rate Decision" },
    { id: 2, lat: 51.5074, lng: -0.1278, intensity: 0.7, sentiment: "bearish", headline: "UK GDP Data" },
    { id: 3, lat: 35.6762, lng: 139.6503, intensity: 0.8, sentiment: "neutral", headline: "Japan Manufacturing" },
    { id: 4, lat: 52.5200, lng: 13.4050, intensity: 0.6, sentiment: "bullish", headline: "ECB Meeting" },
    { id: 5, lat: 39.9042, lng: 116.4074, intensity: 0.8, sentiment: "bearish", headline: "China Trade Data" },
    { id: 6, lat: -33.8688, lng: 151.2093, intensity: 0.5, sentiment: "neutral", headline: "RBA Statement" }
  ]);

  useGlobeAnimation(canvasReady, canvasRef, newsLocations);

  // Theme-aware background styles
  const getCanvasBackground = () => {
    if (theme === 'dark') {
      return 'radial-gradient(circle, rgba(15, 23, 42, 0.9) 0%, rgba(7, 12, 23, 0.95) 100%)';
    } else {
      return 'radial-gradient(circle, rgba(219, 234, 254, 0.8) 0%, rgba(147, 197, 253, 0.9) 100%)';
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-base sm:text-lg">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Global News Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-3 sm:p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[300px] rounded-lg"
            style={{ 
              background: getCanvasBackground(),
              minHeight: '200px'
            }}
          />
          
          <GlobeLegend />

          {/* Live indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
          </div>
        </div>

        <NewsLocationsList newsLocations={newsLocations} />
      </CardContent>
    </Card>
  );
};

export default NewsGlobe;
