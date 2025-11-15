import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SpeedometerProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  className?: string;
}

export function Speedometer({ 
  value, 
  min = 0, 
  max = 100, 
  unit = "", 
  className 
}: SpeedometerProps) {
  const [animatedValue, setAnimatedValue] = useState(min);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Normalize value to 0-1 range
  const normalizedValue = Math.min(Math.max((animatedValue - min) / (max - min), 0), 1);
  
  // Convert to angle (-90 to 90 degrees for 180° arc)
  const angle = -90 + (normalizedValue * 180);
  
  // Get color based on value
  const getColor = () => {
    if (normalizedValue < 0.4) return "hsl(var(--energy-success))";
    if (normalizedValue < 0.7) return "hsl(var(--energy-warning))";
    return "hsl(var(--energy-danger))";
  };

  const color = getColor();

  return (
    <div className={cn("relative w-12 h-8", className)}>
      <svg 
        viewBox="0 0 120 80" 
        className="w-full h-full"
      >
        {/* Background arc */}
        <path
          d="M 20 70 A 40 40 0 0 1 100 70"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="4"
          opacity="0.3"
        />
        
        {/* Active arc */}
        <path
          d="M 20 70 A 40 40 0 0 1 100 70"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${normalizedValue * 125.66} 125.66`}
          className="transition-all duration-500 ease-out"
        />
        
        {/* Center dot */}
        <circle
          cx="60"
          cy="70"
          r="3"
          fill="hsl(var(--foreground))"
        />
        
        {/* Pointer */}
        <line
          x1="60"
          y1="70"
          x2={60 + 32 * Math.cos((angle * Math.PI) / 180)}
          y2={70 + 32 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  );
}