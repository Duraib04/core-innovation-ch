import { 
  Gauge, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Activity,
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMeterData } from "@/hooks/useMeterData";
import { useState } from "react";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <CheckCircle className="h-5 w-5 text-energy-success" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 text-energy-warning" />;
    case "offline":
      return <XCircle className="h-5 w-5 text-energy-danger" />;
    default:
      return <Gauge className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "online":
      return <Badge className="bg-energy-success/10 text-energy-success">Online</Badge>;
    case "warning":
      return <Badge className="bg-energy-warning/10 text-energy-warning">Warning</Badge>;
    case "offline":
      return <Badge className="bg-energy-danger/10 text-energy-danger">Offline</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getLoadColor = (percentage: number) => {
  if (percentage >= 90) return "text-energy-danger";
  if (percentage >= 75) return "text-energy-warning";
  return "text-energy-success";
};

const Devices = () => {
  const { meters: devices, lastUpdate } = useMeterData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (deviceId: string) => {
    setSelectedCard(selectedCard === deviceId ? null : deviceId);
  };

  const getCardClasses = (device: any) => {
    const baseClasses = "cursor-pointer p-4 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-glow transition-all duration-300 animate-fade-in";
    
    if (selectedCard === device.id) {
      return `${baseClasses} shadow-glow animate-glow-selected border-energy-secondary/50 dark:shadow-[0_0_30px_hsl(var(--energy-accent)/0.6),0_0_60px_hsl(var(--energy-accent)/0.3)]`;
    }
    
    return baseClasses;
  };

  // Check if meters are available
  const hasMeters = devices && devices.length > 0;

  return (
    <div className="p-2 sm:p-2 lg:p-3 space-y-3 sm:space-y-3 lg:space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-energy-primary">Connected Meters</h1>
      </div>

      {/* Show message if no meters are available */}
      {!hasMeters && (
        <Card className="w-full bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-semibold">No meters available</p>
            <p className="text-sm mt-2">Please contact support.</p>
          </div>
        </Card>
      )}

      {/* Uniform Grid Layout: Responsive grid with equal spacing for all cards */}
      {hasMeters && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-fr">
        {devices.slice(0, 5).map((device, index) => (
          <Card 
            key={device.id}
            onClick={() => handleCardClick(device.id)}
            className={`${getCardClasses(device)} ${
              index >= 3 ? 'sm:col-span-1 lg:col-span-1' : ''
            }`}
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(device.status)}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-energy-primary truncate">{device.id}</h3>
                  <p className="text-sm font-semibold text-muted-foreground truncate">{device.name}</p>
                </div>
              </div>
              {getStatusBadge(device.status)}
            </div>

            {/* Metrics Grid - Compact 2x3 */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Power</p>
                <p className="text-lg font-bold text-energy-primary tracking-tight">
                  {device.power.toFixed(2)}
                  <span className="text-sm font-semibold text-muted-foreground ml-1">kW</span>
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Current</p>
                <p className="text-lg font-bold text-energy-primary tracking-tight">
                  {device.current.toFixed(1)}
                  <span className="text-sm font-semibold text-muted-foreground ml-1">A</span>
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">VLL</p>
                <p className="text-lg font-bold text-energy-primary tracking-tight">
                  {device.voltage.toFixed(1)}
                  <span className="text-sm font-semibold text-muted-foreground ml-1">V</span>
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">VLN</p>
                <p className="text-lg font-bold text-energy-primary tracking-tight">
                  {device.vln.toFixed(1)}
                  <span className="text-sm font-semibold text-muted-foreground ml-1">V</span>
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Power Factor</p>
                <p className="text-lg font-bold text-energy-primary tracking-tight">
                  {device.powerFactor.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/20 transition-all duration-200 hover:bg-background/30">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Load</p>
                <p className={`text-lg font-bold tracking-tight ${getLoadColor(device.loadPercentage)}`}>
                  {device.loadPercentage}
                  <span className="text-sm font-semibold text-muted-foreground ml-1">%</span>
                </p>
              </div>
            </div>

            {/* Last Update */}
            <div className="flex items-center justify-center py-2 border-t border-border/30">
              <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Last Update: {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};

export default Devices;