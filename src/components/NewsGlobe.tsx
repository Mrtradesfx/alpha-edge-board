
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Activity } from "lucide-react";

interface NewsLocation {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  sentiment: "bullish" | "bearish" | "neutral";
  headline: string;
}

const NewsGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [newsLocations] = useState<NewsLocation[]>([
    { id: 1, lat: 40.7128, lng: -74.0060, intensity: 0.9, sentiment: "bullish", headline: "Fed Rate Decision" },
    { id: 2, lat: 51.5074, lng: -0.1278, intensity: 0.7, sentiment: "bearish", headline: "UK GDP Data" },
    { id: 3, lat: 35.6762, lng: 139.6503, intensity: 0.8, sentiment: "neutral", headline: "Japan Manufacturing" },
    { id: 4, lat: 52.5200, lng: 13.4050, intensity: 0.6, sentiment: "bullish", headline: "ECB Meeting" },
    { id: 5, lat: 39.9042, lng: 116.4074, intensity: 0.8, sentiment: "bearish", headline: "China Trade Data" },
    { id: 6, lat: -33.8688, lng: 151.2093, intensity: 0.5, sentiment: "neutral", headline: "RBA Statement" }
  ]);

  // Handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = Math.min(containerWidth * 0.6, 300);
        
        if (containerWidth > 0 && containerHeight > 0) {
          canvas.width = containerWidth;
          canvas.height = containerHeight;
          setCanvasReady(true);
        }
      }
    };

    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Use ResizeObserver for more accurate container size tracking
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Check if canvas is still valid and has dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        if (radius <= 0) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        // Draw globe background with gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(0.7, 'rgba(37, 99, 235, 0.2)');
        gradient.addColorStop(1, 'rgba(29, 78, 216, 0.1)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw globe outline
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw latitude lines
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          const y = centerY + (radius * 0.6 * Math.cos(i * Math.PI / 4));
          const ellipseRadius = radius * Math.sin(i * Math.PI / 4);
          if (ellipseRadius > 0) {
            ctx.beginPath();
            ctx.ellipse(centerX, y, ellipseRadius, radius * 0.2, 0, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }

        // Draw longitude lines with rotation
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 + rotationRef.current;
          const radiusX = Math.abs(radius * Math.cos(angle));
          if (radiusX > 0) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radius, angle, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }

        // Draw news location lights
        newsLocations.forEach((location) => {
          const phi = (90 - location.lat) * (Math.PI / 180);
          const theta = (location.lng + rotationRef.current * 57.3) * (Math.PI / 180);
          
          const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
          const y = centerY + radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          // Only draw if point is on visible side of globe
          if (z > 0) {
            const intensity = location.intensity * (1 + Math.sin(Date.now() * 0.003) * 0.3);
            const size = 4 + intensity * 6;
            
            // Get color based on sentiment
            let color;
            switch (location.sentiment) {
              case 'bullish':
                color = `rgba(34, 197, 94, ${intensity})`;
                break;
              case 'bearish':
                color = `rgba(239, 68, 68, ${intensity})`;
                break;
              default:
                color = `rgba(168, 85, 247, ${intensity})`;
            }
            
            // Draw outer glow
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
            glowGradient.addColorStop(0, color);
            glowGradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, 2 * Math.PI);
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // Draw core light
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }
        });

        // Update rotation for spinning effect
        rotationRef.current += 0.01;
        
        console.log('Globe spinning, rotation:', rotationRef.current);
      } catch (error) {
        console.error('Canvas drawing error:', error);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [newsLocations, canvasReady]);

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
              background: 'radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              minHeight: '200px'
            }}
          />
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Bullish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Bearish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Neutral</span>
            </div>
          </div>

          {/* Live indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
          </div>
        </div>

        {/* Recent Headlines */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Active News Locations
          </div>
          {newsLocations.slice(0, 3).map((location) => (
            <div key={location.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {location.headline}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  location.sentiment === 'bullish' 
                    ? 'border-green-500/30 text-green-600 dark:text-green-400' 
                    : location.sentiment === 'bearish'
                    ? 'border-red-500/30 text-red-600 dark:text-red-400'
                    : 'border-purple-500/30 text-purple-600 dark:text-purple-400'
                }`}
              >
                {location.sentiment}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsGlobe;
