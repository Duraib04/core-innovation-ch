import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MeterSelection } from "@/components/MeterSelection";
import { useMeterData } from "@/hooks/useMeterData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { apiService, HourlyData, WeeklyData, MonthlyData, Last60DaysData, CustomData } from "@/lib/api";

type AnalyticsType = "today" | "weekly" | "monthly" | "last60days" | "custom";

const EnergyAnalytics = () => {
  const { meters, selectedMeterId, setSelectedMeterId } = useMeterData();
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>("today");
  const [fromDate, setFromDate] = useState<string>(getTodayDate());
  const [toDate, setToDate] = useState<string>(getTodayDate());
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [appliedType, setAppliedType] = useState<AnalyticsType>("today");
  const [appliedMeterId, setAppliedMeterId] = useState<string>("");
  const [appliedFromDate, setAppliedFromDate] = useState<string>("");
  const [appliedToDate, setAppliedToDate] = useState<string>("");
  const [appliedYear, setAppliedYear] = useState<string>("2025");

  // Set appliedMeterId when meters are loaded
  useEffect(() => {
    if (meters.length > 0 && !appliedMeterId) {
      setAppliedMeterId(selectedMeterId);
    }
  }, [meters, selectedMeterId, appliedMeterId]);
  
  // State for hourly analytics data
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoadingHourly, setIsLoadingHourly] = useState(false);
  const [hourlyError, setHourlyError] = useState<string | null>(null);
  
  // State for weekly analytics data
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

  // State for monthly analytics data
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  // State for last 60 days analytics data
  const [last60DaysData, setLast60DaysData] = useState<Last60DaysData[]>([]);
  const [isLoadingLast60Days, setIsLoadingLast60Days] = useState(false);
  const [last60DaysError, setLast60DaysError] = useState<string | null>(null);

  // State for custom analytics data
  const [customData, setCustomData] = useState<CustomData[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const minDate = "2025-01-01";
  const maxDate = getTodayDate();
  
  // Generate all years (2025 to 2030) with availability status
  const currentYear = new Date().getFullYear();
  const allYears = Array.from({ length: 6 }, (_, i) => ({
    year: 2025 + i,
    isAvailable: 2025 + i <= currentYear
  }));

  // Handle year change and update from/to dates
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Update from date to January of selected year
    setFromDate(`${year}-01-01`);
    // Update to date to December of selected year (or current month if it's current year)
    const isCurrentYear = parseInt(year) === currentYear;
    if (isCurrentYear) {
      setToDate(getTodayDate());
    } else {
      setToDate(`${year}-12-01`);
    }
  };

  const handleApplyFilter = () => {
    // Apply meter ID, analytics type, date range, and year for custom
    setAppliedType(analyticsType);
    setAppliedMeterId(selectedMeterId);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedYear(selectedYear);
  };

  // Fetch hourly analytics data from the database
  useEffect(() => {
    const fetchHourlyData = async () => {
      if (appliedType !== "today" || !appliedMeterId) {
        return;
      }

      setIsLoadingHourly(true);
      setHourlyError(null);

      try {
        const date = getTodayDate();
        const data = await apiService.getHourlyAnalytics(appliedMeterId, date);
        setHourlyData(data);
      } catch (error) {
        console.error('Error fetching hourly analytics:', error);
        setHourlyError('Failed to fetch hourly analytics data');
        // Fallback to empty array
        setHourlyData([]);
      } finally {
        setIsLoadingHourly(false);
      }
    };

    fetchHourlyData();
  }, [appliedType, appliedMeterId]);

  // Fetch weekly analytics data from the database
  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (appliedType !== "weekly" || !appliedMeterId) {
        return;
      }

      setIsLoadingWeekly(true);
      setWeeklyError(null);

      try {
        const data = await apiService.getWeeklyAnalytics(appliedMeterId);
        setWeeklyData(data);
      } catch (error) {
        console.error('Error fetching weekly analytics:', error);
        setWeeklyError('Failed to fetch weekly analytics data');
        // Fallback to empty array
        setWeeklyData([]);
      } finally {
        setIsLoadingWeekly(false);
      }
    };

    fetchWeeklyData();
  }, [appliedType, appliedMeterId]);

  // Fetch monthly analytics data from the database
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (appliedType !== "monthly" || !appliedMeterId) {
        return;
      }

      setIsLoadingMonthly(true);
      setMonthlyError(null);

      try {
        const data = await apiService.getMonthlyAnalytics(appliedMeterId);
        setMonthlyData(data);
      } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        setMonthlyError('Failed to fetch monthly analytics data');
        // Fallback to empty array
        setMonthlyData([]);
      } finally {
        setIsLoadingMonthly(false);
      }
    };

    fetchMonthlyData();
  }, [appliedType, appliedMeterId]);

  // Fetch last 60 days analytics data from the database
  useEffect(() => {
    const fetchLast60DaysData = async () => {
      if (appliedType !== "last60days" || !appliedMeterId) {
        return;
      }

      setIsLoadingLast60Days(true);
      setLast60DaysError(null);

      try {
        const data = await apiService.getLast60DaysAnalytics(appliedMeterId);
        setLast60DaysData(data);
      } catch (error) {
        console.error('Error fetching last 60 days analytics:', error);
        setLast60DaysError('Failed to fetch last 60 days analytics data');
        // Fallback to empty array
        setLast60DaysData([]);
      } finally {
        setIsLoadingLast60Days(false);
      }
    };

    fetchLast60DaysData();
  }, [appliedType, appliedMeterId]);

  // Fetch custom analytics data from the database
  useEffect(() => {
    const fetchCustomData = async () => {
      if (appliedType !== "custom" || !appliedMeterId || !appliedFromDate || !appliedToDate) {
        return;
      }

      setIsLoadingCustom(true);
      setCustomError(null);

      try {
        const data = await apiService.getCustomAnalytics(appliedMeterId, appliedFromDate, appliedToDate);
        setCustomData(data);
      } catch (error) {
        console.error('Error fetching custom analytics:', error);
        setCustomError('Failed to fetch custom analytics data');
        // Fallback to empty array
        setCustomData([]);
      } finally {
        setIsLoadingCustom(false);
      }
    };

    fetchCustomData();
  }, [appliedType, appliedMeterId, appliedFromDate, appliedToDate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate hourly data for today (24 hours) - now uses real data from database
  const generateHourlyConsumptionData = () => {
    // Return real data from the database
    if (hourlyData && hourlyData.length > 0) {
      return hourlyData.map(item => ({
        hour: item.hour,
        power: parseFloat(item.consumption.toFixed(2))
      }));
    }

    // Return empty array if no data is available
    return [];
  };

  const generateHourlyPeakData = () => {
    // Return real data from the database
    if (hourlyData && hourlyData.length > 0) {
      return hourlyData.map(item => ({
        hour: item.hour,
        units: parseFloat(item.unitsConsumed.toFixed(1))
      }));
    }

    // Return empty array if no data is available
    return [];
  };

  // Generate daily data for weekly/monthly/custom
  const generateDailyConsumptionData = () => {
    if (appliedType === "weekly") {
      // Use real data from database
      if (weeklyData && weeklyData.length > 0) {
        return weeklyData.map(item => ({
          day: item.day,
          consumption: parseFloat(item.consumption.toFixed(2))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else if (appliedType === "monthly") {
      // Use real data from database
      if (monthlyData && monthlyData.length > 0) {
        return monthlyData.map(item => ({
          day: item.day,
          consumption: parseFloat(item.consumption.toFixed(2))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else if (appliedType === "last60days") {
      // Use real data from database
      if (last60DaysData && last60DaysData.length > 0) {
        return last60DaysData.map(item => ({
          day: item.day,
          consumption: parseFloat(item.consumption.toFixed(2))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else {
      // Custom date range - Use real data from database
      if (customData && customData.length > 0) {
        // Display only the months that were fetched from the backend
        return customData.map(item => ({
          day: item.month,
          consumption: parseFloat(item.consumption.toFixed(2))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    }
  };

  const generateDailyPeakData = () => {
    if (appliedType === "weekly") {
      // Use real data from database
      if (weeklyData && weeklyData.length > 0) {
        return weeklyData.map(item => ({
          day: item.day,
          units: parseFloat(item.units.toFixed(1))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else if (appliedType === "monthly") {
      // Use real data from database
      if (monthlyData && monthlyData.length > 0) {
        return monthlyData.map(item => ({
          day: item.day,
          units: parseFloat(item.units.toFixed(1))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else if (appliedType === "last60days") {
      // Use real data from database
      if (last60DaysData && last60DaysData.length > 0) {
        return last60DaysData.map(item => ({
          day: item.day,
          units: parseFloat(item.units.toFixed(1))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    } else {
      // Custom date range - Use real data from database
      if (customData && customData.length > 0) {
        // Display only the months that were fetched from the backend
        return customData.map(item => ({
          day: item.month,
          units: parseFloat(item.units.toFixed(1))
        }));
      }
      
      // Return empty array if no data is available
      return [];
    }
  };

  const getChartData = () => {
    if (appliedType === "today") {
      return {
        consumption: generateHourlyConsumptionData(),
        units: generateHourlyPeakData(),
        xAxisKey: "hour",
        xAxisLabel: "Time (Hour)",
        consumptionKey: "power"
      };
    } else {
      return {
        consumption: generateDailyConsumptionData(),
        units: generateDailyPeakData(),
        xAxisKey: "day",
        xAxisLabel: "Date",
        consumptionKey: "consumption"
      };
    }
  };

  const chartData = getChartData();

  const getChartTitle = () => {
    if (appliedType === "today") return "Today";
    if (appliedType === "weekly") return "Week (Last 7 Days)";
    if (appliedType === "monthly") return "Month (Last 30 Days)";
    if (appliedType === "last60days") return "Last 60 Days";
    return "Custom";
  };

  // Check if meters are available
  const hasMeters = meters && meters.length > 0;

  return (
    <div className="p-2 sm:p-2 lg:p-3 space-y-3 sm:space-y-3 lg:space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-energy-primary">Energy Analytics</h1>
      </div>
      
      {/* Show message if no meters are available */}
      {!hasMeters && (
        <Card className="w-full bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-semibold">No meters available</p>
              <p className="text-sm mt-2">Please contact support.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Combined Meter Selection and Analytics Type */}
      {hasMeters && (
        <Card className="w-full bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* First Row: All filters in one line */}
              <div className="flex flex-wrap items-center gap-4">
              {/* Meter ID */}
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-muted-foreground whitespace-nowrap">Meter ID:</span>
                <Select value={selectedMeterId} onValueChange={setSelectedMeterId}>
                  <SelectTrigger className="w-40 bg-background/50 border-border/60 shadow-sm font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                    {meters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id} className="font-semibold">
                        {meter.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Meter Name */}
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-muted-foreground whitespace-nowrap">Meter Name:</span>
                <Select value={meters.find(m => m.id === selectedMeterId)?.name || ""} onValueChange={(meterName) => {
                  const meter = meters.find(m => m.name === meterName);
                  if (meter) {
                    setSelectedMeterId(meter.id);
                  }
                }}>
                  <SelectTrigger className="w-48 bg-background/50 border-border/60 shadow-sm font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                    {meters.map((meter) => (
                      <SelectItem key={meter.name} value={meter.name} className="font-semibold">
                        {meter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-muted-foreground whitespace-nowrap">Timeline:</span>
                <Select value={analyticsType} onValueChange={(value) => setAnalyticsType(value as AnalyticsType)}>
                  <SelectTrigger className="w-56 bg-background/50 border-border/60 shadow-sm font-semibold">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                    <SelectItem value="today" className="font-semibold">Today</SelectItem>
                    <SelectItem value="weekly" className="font-semibold">Week (Last 7 Days)</SelectItem>
                    <SelectItem value="monthly" className="font-semibold">Month (Last 30 Days)</SelectItem>
                    <SelectItem value="last60days" className="font-semibold">Last 60 Days</SelectItem>
                    <SelectItem value="custom" className="font-semibold">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Button */}
              <Button 
                onClick={handleApplyFilter}
                className="bg-primary hover:bg-primary/90 px-8 whitespace-nowrap"
              >
                Apply
              </Button>
            </div>

            {/* Second Row: Custom Date Range - Show only when custom is selected */}
            {analyticsType === "custom" && (
              <div className="flex items-center gap-4">
                {/* Year Selection */}
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-muted-foreground whitespace-nowrap">Year:</span>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-32 bg-background/50 border-border/60 shadow-sm font-semibold">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
                      {allYears.map(({ year, isAvailable }) => (
                        <SelectItem 
                          key={year} 
                          value={year.toString()} 
                          className="font-semibold"
                          disabled={!isAvailable}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    From:
                  </span>
                  <Input
                    id="from-date"
                    type="month"
                    value={fromDate.substring(0, 7)}
                    onChange={(e) => setFromDate(e.target.value + '-01')}
                    min={minDate.substring(0, 7)}
                    max={maxDate.substring(0, 7)}
                    className="w-44 bg-background/50 border-border/60 shadow-sm font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    To:
                  </span>
                  <Input
                    id="to-date"
                    type="month"
                    value={toDate.substring(0, 7)}
                    onChange={(e) => setToDate(e.target.value + '-01')}
                    min={minDate.substring(0, 7)}
                    max={maxDate.substring(0, 7)}
                    className="w-44 bg-background/50 border-border/60 shadow-sm font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Date Range Display - At bottom */}
            {appliedType && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/50 mt-4">
                <span className="text-sm font-medium text-muted-foreground">Showing:</span>
                <Badge variant="secondary" className="font-semibold">
                  {appliedType === "custom" 
                    ? `${appliedMeterId || selectedMeterId} - Custom (${new Date(appliedFromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} to ${new Date(appliedToDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`
                    : `${appliedMeterId || selectedMeterId} - ${
                        appliedType === "today" ? "Today" :
                        appliedType === "weekly" ? "Week (Last 7 Days)" :
                        appliedType === "monthly" ? "Month (Last 30 Days)" :
                        appliedType === "last60days" ? "Last 60 Days" : ""
                      }`
                  }
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Charts */}
      {hasMeters && appliedType && (
      <div className={`grid gap-6 ${appliedType === "monthly" || appliedType === "last60days" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {/* Energy Consumption Chart */}
        <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
          <h3 className="text-lg font-bold text-energy-primary mb-4">
            {appliedType === "today" ? "Energy Consumed" : `Energy Consumed - ${getChartTitle()}`}
          </h3>
          {chartData.consumption.length === 0 ? (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-semibold">No data available</p>
                <p className="text-sm mt-2">No consumption data found for the selected period.</p>
              </div>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.consumption} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey={chartData.xAxisKey}
                tick={{ fill: '#64748b', fontSize: 10 }} 
                interval={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" || appliedType === "custom" ? 0 : "preserveStartEnd"}
                angle={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? -45 : 0}
                textAnchor={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? "end" : "middle"}
                height={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? 70 : 30}
                label={{ value: chartData.xAxisLabel, position: 'insideBottom', offset: (appliedType === "today" || appliedType === "monthly" || appliedType === "last60days") ? -35 : -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
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
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, appliedType === "today" ? 'Consumed' : 'Consumed']}
              />
              <Bar dataKey={chartData.consumptionKey} fill="url(#gradientBar)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          )}
        </Card>

        {/* Units Consumed Chart */}
        <Card className="p-6 rounded-lg bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
          <h3 className="text-lg font-bold text-energy-primary mb-4">
            {appliedType === "today" ? "Units Consumed" : `Units Consumed - ${getChartTitle()}`}
          </h3>
          {chartData.units.length === 0 ? (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-semibold">No data available</p>
                <p className="text-sm mt-2">No units consumption data found for the selected period.</p>
              </div>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData.units} margin={{ bottom: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey={chartData.xAxisKey}
                tick={{ fill: '#64748b', fontSize: 10 }} 
                interval={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" || appliedType === "custom" ? 0 : "preserveStartEnd"}
                angle={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? -45 : 0}
                textAnchor={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? "end" : "middle"}
                height={appliedType === "today" || appliedType === "monthly" || appliedType === "last60days" ? 70 : 30}
                label={{ value: chartData.xAxisLabel, position: 'insideBottom', offset: (appliedType === "today" || appliedType === "monthly" || appliedType === "last60days") ? -35 : -10, style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                label={{ value: 'Units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12, fontWeight: 'bold' } }}
                domain={[0, (dataMax: number) => {
                  const max = Math.ceil(dataMax);
                  
                  // Determine the order of magnitude
                  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
                  
                  // Generate nice intervals based on magnitude: 1x, 2x, 2.5x, 5x, 10x
                  const niceIntervals = [
                    magnitude * 1,
                    magnitude * 2,
                    magnitude * 2.5,
                    magnitude * 5,
                    magnitude * 10
                  ];
                  
                  const tickCount = 5;
                  const roughInterval = max / (tickCount - 1);
                  
                  // Find the smallest nice interval that's >= roughInterval
                  let interval = niceIntervals.find(val => val >= roughInterval) || (magnitude * 10);
                  
                  // Calculate the ceiling based on the interval
                  return Math.ceil(max / interval) * interval;
                }]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${Number(value).toFixed(1)} Units`, 'Consumed']}
              />
              <Line 
                type="monotone" 
                dataKey="units" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#0ea5e9' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </Card>
      </div>
      )}
    </div>
  );
};

export default EnergyAnalytics;
