
import { useEffect, useRef } from 'react';
import { NewsLocation } from './types';

export const useGlobeAnimation = (
  canvasReady: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  newsLocations: NewsLocation[]
) => {
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!canvasReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
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
  }, [newsLocations, canvasReady, canvasRef]);
};
