
import { useEffect, useRef, useState } from 'react';

export const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

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

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []);

  return { canvasRef, canvasReady };
};
