import React, { useRef, useEffect, useState } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  style?: React.CSSProperties;
  className?: string;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#7df9ff',
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    
    return () => {
        window.removeEventListener('resize', updateDimensions);
        observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let frameCount = 0;

    const drawLightning = (x1: number, y1: number, x2: number, y2: number, displacement: number) => {
      if (displacement < 2) {
        ctx.lineTo(x2, y2);
        return;
      }

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      // Calculate normal vector
      const dx = x2 - x1;
      const dy = y2 - y1;
      const normalX = -dy;
      const normalY = dx;
      const len = Math.sqrt(normalX * normalX + normalY * normalY);
      
      // Normalize and scale by random displacement
      // chaos affects how "wild" the arc is
      const offset = (Math.random() - 0.5) * displacement * (chaos * 2); 
      
      const newX = midX + (normalX / len) * offset;
      const newY = midY + (normalY / len) * offset;

      drawLightning(x1, y1, newX, newY, displacement / 2);
      drawLightning(newX, newY, x2, y2, displacement / 2);
    };

    const animate = () => {
      if (!dimensions.width || !dimensions.height) return;
      
      frameCount++;
      // Control speed by only updating every N frames relative to speed prop
      // speed 1 = normal, higher = faster updates
      const updateInterval = Math.max(1, Math.floor(10 / speed));
      
      if (frameCount % updateInterval === 0) {
          ctx.clearRect(0, 0, dimensions.width, dimensions.height);
          
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;

          const w = dimensions.width;
          const h = dimensions.height;
          // approximate corner padding
          const pad = 0; 

          // Draw around the perimeter
          // Top
          ctx.moveTo(pad, pad);
          drawLightning(pad, pad, w - pad, pad, w / 4);
          
          // Right
          // ctx.moveTo(w - pad, pad);
          drawLightning(w - pad, pad, w - pad, h - pad, h / 4);
          
          // Bottom
          // ctx.moveTo(w - pad, h - pad);
          drawLightning(w - pad, h - pad, pad, h - pad, w / 4);
          
          // Left
          // ctx.moveTo(pad, h - pad);
          drawLightning(pad, h - pad, pad, pad, h / 4);

          ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, color, speed, chaos, thickness]);

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`} 
      style={{ ...style }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50 rounded-[inherit]"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="relative z-0 h-full w-full rounded-[inherit] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;