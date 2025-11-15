import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMeterData } from "@/hooks/useMeterData";
import { Card, CardContent } from "@/components/ui/card";

export function MeterSelection() {
  const { meters, selectedMeterId, setSelectedMeterId } = useMeterData();
  
  // Get selected meter data
  const selectedMeter = meters.find(meter => meter.id === selectedMeterId);

  const handleMeterIdChange = (meterId: string) => {
    setSelectedMeterId(meterId);
  };

  const handleMeterNameChange = (meterName: string) => {
    const meter = meters.find(m => m.name === meterName);
    if (meter) {
      setSelectedMeterId(meter.id);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-8 flex-wrap">
          {/* Meter ID Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm lg:text-base font-semibold text-muted-foreground whitespace-nowrap">Meter ID:</span>
            <Select value={selectedMeterId} onValueChange={handleMeterIdChange}>
              <SelectTrigger className="w-32 sm:w-40 lg:w-48 bg-background/50 border-border/60 shadow-sm font-semibold text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                {meters.map((meter) => (
                  <SelectItem key={meter.id} value={meter.id} className="font-semibold text-xs sm:text-sm">
                    {meter.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meter Name Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm lg:text-base font-semibold text-muted-foreground whitespace-nowrap">Meter Name:</span>
            <Select value={selectedMeter?.name || ""} onValueChange={handleMeterNameChange}>
              <SelectTrigger className="w-36 sm:w-44 lg:w-52 bg-background/50 border-border/60 shadow-sm font-semibold text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                {meters.map((meter) => (
                  <SelectItem key={meter.name} value={meter.name} className="font-semibold text-xs sm:text-sm">
                    {meter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}