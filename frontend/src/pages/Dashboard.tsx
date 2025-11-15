import { 
  Zap, 
  TrendingUp, 
  Activity, 
  BarChart3,
  Gauge,
  Timer,
  Battery,
  Power
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PhaseCard } from "@/components/PhaseCard";
import { MeterSelection } from "@/components/MeterSelection";
import { useMeterData, getKeyMetrics, getAdditionalMetrics, getPhaseData } from "@/hooks/useMeterData";

const Index = () => {
  const { meters, selectedMeterId } = useMeterData();
  const keyMetrics = getKeyMetrics(meters, selectedMeterId);
  const additionalMetrics = getAdditionalMetrics(meters, selectedMeterId);
  const phaseData = getPhaseData(meters, selectedMeterId);

  return (
    <div className="p-2 sm:p-2 lg:p-3 space-y-3 sm:space-y-3 lg:space-y-3">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-energy-primary">Dashboard</h1>
      
      {/* Meter Selection */}
      <MeterSelection />
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard
          title="Incoming Energy"
          value={keyMetrics.incomingEnergy.value}
          unit={keyMetrics.incomingEnergy.unit}
          variant="default"
          icon={<Zap className="w-6 h-6" />}
        />
        <MetricCard
          title="Consumed Energy"
          value={keyMetrics.liveConsumption.value}
          unit={keyMetrics.liveConsumption.unit}
          variant="default"
          icon={<Activity className="w-6 h-6" />}
        />
        <MetricCard
          title="Today's Consumption"
          value={keyMetrics.todaysConsumption.value}
          unit={keyMetrics.todaysConsumption.unit}
          variant="default"
          icon={<Timer className="w-6 h-6" />}
        />
        <MetricCard
          title="Units Consumed Today"
          value={keyMetrics.totalUnits.value}
          unit={keyMetrics.totalUnits.unit}
          variant="default"
          icon={<BarChart3 className="w-6 h-6" />}
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        <MetricCard
          title="Power"
          value={additionalMetrics.avgPower.value.toFixed(2)}
          unit={additionalMetrics.avgPower.unit}
          icon={<Power className="w-4 h-4" />}
        />
        <MetricCard
          title="Load %"
          value={additionalMetrics.avgLoad.value}
          unit={additionalMetrics.avgLoad.unit}
          variant={additionalMetrics.avgLoad.value > 80 ? "warning" : "default"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Power Factor"
          value={additionalMetrics.avgPowerFactor.value}
          icon={<Battery className="w-4 h-4" />}
        />
        <MetricCard
          title="Voltage VLL"
          value={additionalMetrics.avgVLL.value}
          unit={additionalMetrics.avgVLL.unit}
          icon={<Gauge className="w-4 h-4" />}
        />
        <MetricCard
          title="Voltage VLN"
          value={additionalMetrics.avgVLN.value}
          unit={additionalMetrics.avgVLN.unit}
          icon={<Gauge className="w-4 h-4" />}
        />
        <MetricCard
          title="Current"
          value={additionalMetrics.avgCurrent.value}
          unit={additionalMetrics.avgCurrent.unit}
          icon={<Power className="w-4 h-4" />}
        />
      </div>

      {/* Phase-wise Consumption */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-energy-primary mb-4 sm:mb-6">Phase-wise Consumption</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {phaseData.map(({ phase, data }) => (
            <PhaseCard key={phase} phase={phase} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;