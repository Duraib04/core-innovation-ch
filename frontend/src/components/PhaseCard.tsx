import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PhaseData {
  power: number;
  vll: number;
  vln: number;
  current: number;
  loadPercentage: number;
}

interface PhaseCardProps {
  phase: number;
  data: PhaseData;
  className?: string;
}

export function PhaseCard({ phase, data, className }: PhaseCardProps) {
  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return "text-energy-danger";
    if (percentage >= 75) return "text-energy-warning";
    return "text-energy-success";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-energy-danger";
    if (percentage >= 75) return "bg-energy-warning";
    return "bg-energy-success";
  };

  return (
    <Card className={cn(
      "p-3 sm:p-4 lg:p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg",
      "hover:shadow-glow transition-all duration-300 hover:scale-105",
      className
    )}>
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-energy-primary mb-2 sm:mb-4">
          Phase {phase}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
        <div className="space-y-2 sm:space-y-3">
           <div>
             <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Power</p>
             <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-energy-primary">
               {data.power.toFixed(2)}
               <span className="text-sm sm:text-base font-semibold text-muted-foreground ml-1">kW</span>
             </p>
           </div>
           <div>
             <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">VLL</p>
             <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-energy-primary">
               {data.vll.toFixed(2)}
               <span className="text-sm sm:text-base font-semibold text-muted-foreground ml-1">V</span>
             </p>
           </div>
         </div>
         
         <div className="space-y-2 sm:space-y-3">
           <div>
             <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">VLN</p>
             <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-energy-primary">
               {data.vln.toFixed(2)}
               <span className="text-sm sm:text-base font-semibold text-muted-foreground ml-1">V</span>
             </p>
           </div>
           <div>
             <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Current</p>
             <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-energy-primary">
               {data.current.toFixed(2)}
               <span className="text-sm sm:text-base font-semibold text-muted-foreground ml-1">A</span>
             </p>
           </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Load</span>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs sm:text-sm font-bold",
            "bg-energy-secondary/10 text-energy-secondary"
          )}>
            {data.loadPercentage}% Load
          </div>
        </div>
        <Progress 
          value={data.loadPercentage} 
          className="h-2"
        />
      </div>
    </Card>
  );
}