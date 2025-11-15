import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Speedometer } from "./Speedometer";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
  className?: string;
  showSpeedometer?: boolean;
  speedometerMin?: number;
  speedometerMax?: number;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  variant = "default",
  className,
  showSpeedometer = false,
  speedometerMin = 0,
  speedometerMax = 100
}: MetricCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary text-white shadow-lg backdrop-blur-sm border border-border/50";
      case "accent":
        return "bg-gradient-accent text-white shadow-lg backdrop-blur-sm border border-border/50";
      case "success":
        return "bg-gradient-success text-white shadow-lg backdrop-blur-sm border border-border/50";
      case "warning":
        return "bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg border-energy-warning/30";
      case "danger":
        return "bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg border-energy-danger/30";
      default:
        return "bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    return trend.isPositive ? "text-energy-success" : "text-energy-danger";
  };

  return (
    <Card className={cn(
      "p-3 sm:p-4 lg:p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-glow",
      getCardStyles(),
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-xs sm:text-sm font-semibold mb-1 sm:mb-2",
            variant === "default" ? "text-muted-foreground" : "text-inherit"
          )}>
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight",
              variant === "default" ? "text-energy-primary" : "text-inherit"
            )}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className={cn(
                "text-sm sm:text-base font-semibold ml-1",
                variant === "default" ? "text-muted-foreground" : "text-inherit"
              )}>
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium",
              getTrendColor()
            )}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="opacity-70">vs yesterday</span>
            </div>
          )}
        </div>
        {showSpeedometer ? (
          <div className="flex items-center justify-center">
            <Speedometer 
              value={typeof value === "number" ? value : parseFloat(value.toString())} 
              min={speedometerMin}
              max={speedometerMax}
              unit={unit}
            />
          </div>
        ) : icon && (
          <div className={cn(
            "flex-shrink-0 flex items-center justify-center",
            variant === "default" 
              ? "text-energy-primary" 
              : "text-inherit"
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}