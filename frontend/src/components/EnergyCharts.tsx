import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useMeterData } from "@/hooks/useMeterData";
import { Badge } from "@/components/ui/badge";

interface EnergyChartsProps {
  fromDate: string;
  toDate: string;
}

export function EnergyCharts({ fromDate, toDate }: EnergyChartsProps) {
  const { meters, selectedMeterId } = useMeterData();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Generate real-time chart data based on selected meter
  const generateHourlyData = () => {
    const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
    const basePower = selectedMeter.power / 8; // Distribute across 8 hours (3-hour intervals)
    
    return [
      { hour: '00:00', power: Math.round(basePower * 0.6) },
      { hour: '03:00', power: Math.round(basePower * 0.5) },
      { hour: '06:00', power: Math.round(basePower * 0.75) },
      { hour: '09:00', power: Math.round(basePower * 0.9) },
      { hour: '12:00', power: Math.round(basePower * 1.1) },
      { hour: '15:00', power: Math.round(basePower * 0.95) },
      { hour: '18:00', power: Math.round(basePower * 0.85) },
      { hour: '21:00', power: Math.round(basePower * 0.8) },
    ];
  };

  const generatePeakData = () => {
    const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
    const basePeak = selectedMeter.power * 1.3; // Peak is typically higher than average
    
    return [
      { hour: '00:00', peak: Math.round(basePeak * 0.65) },
      { hour: '03:00', peak: Math.round(basePeak * 0.55) },
      { hour: '06:00', peak: Math.round(basePeak * 0.80) },
      { hour: '09:00', peak: Math.round(basePeak * 1.05) },
      { hour: '12:00', peak: Math.round(basePeak * 1.25) },
      { hour: '15:00', peak: Math.round(basePeak * 1.15) },
      { hour: '18:00', peak: Math.round(basePeak * 0.95) },
      { hour: '21:00', peak: Math.round(basePeak * 0.85) },
    ];
  };

  const generateWeeklyConsumption = () => {
    const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
    const dailyBase = selectedMeter.power / 2; // Base consumption per day
    
    return [
      { day: 'Day 1', consumption: Math.round(dailyBase * 0.85) },
      { day: 'Day 2', consumption: Math.round(dailyBase * 1.0) },
      { day: 'Day 3', consumption: Math.round(dailyBase * 0.9) },
      { day: 'Day 4', consumption: Math.round(dailyBase * 1.2) },
      { day: 'Day 5', consumption: Math.round(dailyBase * 1.05) },
      { day: 'Day 6', consumption: Math.round(dailyBase * 0.85) },
      { day: 'Day 7', consumption: Math.round(dailyBase * 0.75) },
    ];
  };

  const generateWeeklyStatus = () => {
    const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
    const statusBase = selectedMeter.power * 0.8;
    
    return [
      { day: 'Day 1', peak: Math.round(statusBase * 0.85) },
      { day: 'Day 2', peak: Math.round(statusBase * 1.0) },
      { day: 'Day 3', peak: Math.round(statusBase * 0.9) },
      { day: 'Day 4', peak: Math.round(statusBase * 1.25) },
      { day: 'Day 5', peak: Math.round(statusBase * 1.1) },
      { day: 'Day 6', peak: Math.round(statusBase * 0.75) },
      { day: 'Day 7', peak: Math.round(statusBase * 0.65) },
    ];
  };

  const hourlyConsumptionData = generateHourlyData();
  const hourlyPeakData = generatePeakData();
  const weeklyConsumptionData = generateWeeklyConsumption();
  const weeklyStatusData = generateWeeklyStatus();

  return (
    <div className="space-y-4">
      {/* Date Range Display */}
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Showing data from:</span>
          <Badge variant="secondary" className="font-semibold">
            {formatDate(fromDate)}
          </Badge>
          <span className="text-muted-foreground">to</span>
          <Badge variant="secondary" className="font-semibold">
            {formatDate(toDate)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Hourly Power Consumption*/}
        <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
          <h3 className="text-lg font-bold text-energy-primary mb-4">Hourly Power Consumption</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={hourlyConsumptionData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Time (Hour)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="power" fill="url(#gradientBar)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Hourly Peak Load */}
      <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
        <h3 className="text-lg font-bold text-energy-primary mb-4">Hourly Peak Load</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={hourlyPeakData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Time (Hour)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Load %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="peak" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#0ea5e9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly Consumption */}
      <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
        <h3 className="text-lg font-bold text-energy-primary mb-4">Weekly Consumption</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyConsumptionData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Days (Last 7 Days)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [`${value} kWh`, 'Consumption']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="consumption" fill="url(#gradientWeeklyBar)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="gradientWeeklyBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly Peak Load */}
      <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
        <h3 className="text-lg font-bold text-energy-primary mb-4">Weekly Peak Load</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={weeklyStatusData} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Days (Last 7 Days)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              label={{ value: 'Load %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="peak" 
              stroke="#0ea5e9" 
              fill="url(#gradientArea)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
    </div>
  );
}