const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface PowerMeterReading {
  meter_id: string;
  date: string;
  time: string;
  vll_avg: number;
  v12: number;
  v23: number;
  v31: number;
  vln_avg: number;
  v1_n: number;
  v2_n: number;
  v3_n: number;
  iavg: number;
  i1: number;
  i2: number;
  i3: number;
  total_active_power_kw: number;
  p1_active_kw: number;
  p2_active_kw: number;
  p3_active_kw: number;
  pf_avg: number;
  frequency_hz: number;
  forward_active_energy_kwh: number;
  total_active_energy_kwh: number;
  consumed_energy_kwh: number;
  percent_average_load: number;
  percent_load_l1: number;
  percent_load_l2: number;
  percent_load_l3: number;
  todays_consumption_kwh: number;
  units_consumed: number;
}

export interface ReportResponse {
  data: PowerMeterReading[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface MeterStats {
  meter_id: string;
  total_readings: number;
  avg_power: number;
  max_power: number;
  min_power: number;
  avg_voltage: number;
  avg_current: number;
  avg_power_factor: number;
  avg_load: number;
  total_energy: number;
}

export interface HourlyData {
  hour: string;
  consumption: number;
  peakLoad: number;
  avgLoad: number;
  unitsConsumed: number;
}

export interface WeeklyData {
  day: string;
  date: string;
  consumption: number;
  units: number;
}

export interface MonthlyData {
  day: string;
  date: string;
  consumption: number;
  units: number;
}

export interface Last60DaysData {
  day: string;
  date: string;
  consumption: number;
  units: number;
}

export interface CustomData {
  month: string;
  year: number;
  consumption: number;
  units: number;
  isCurrentMonth: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }

  // Get all meter IDs
  async getMeters(): Promise<{ meter_id: string }[]> {
    const response = await fetch(`${this.baseUrl}/meters`);
    if (!response.ok) throw new Error('Failed to fetch meters');
    return response.json();
  }

  // Get latest reading for a specific meter
  async getLatestReading(meterId: string): Promise<PowerMeterReading> {
    const response = await fetch(`${this.baseUrl}/meters/${meterId}/latest`);
    if (!response.ok) throw new Error('Failed to fetch latest reading');
    return response.json();
  }

  // Get latest readings for all meters
  async getAllLatestReadings(): Promise<PowerMeterReading[]> {
    console.log('🌐 Making API call to:', `${this.baseUrl}/meters/all/latest`);
    const response = await fetch(`${this.baseUrl}/meters/all/latest`);
    console.log('📡 API response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error('Failed to fetch all latest readings');
    }
    const data = await response.json();
    console.log('📦 API data received:', data);
    return data;
  }

  // Get report data with filters
  async getReportData(params: {
    meterId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.meterId) queryParams.append('meterId', params.meterId);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${this.baseUrl}/reports?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch report data');
    return response.json();
  }

  // Get meter statistics
  async getMeterStats(
    meterId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<MeterStats> {
    const queryParams = new URLSearchParams();
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);

    const response = await fetch(
      `${this.baseUrl}/meters/${meterId}/stats?${queryParams.toString()}`
    );
    if (!response.ok) throw new Error('Failed to fetch meter statistics');
    return response.json();
  }

  // Get real-time data stream
  async getRealtimeData(meterId: string): Promise<PowerMeterReading[]> {
    const response = await fetch(`${this.baseUrl}/meters/${meterId}/realtime`);
    if (!response.ok) throw new Error('Failed to fetch real-time data');
    return response.json();
  }

  // Get hourly analytics for a specific meter and date
  async getHourlyAnalytics(meterId: string, date: string): Promise<HourlyData[]> {
    const response = await fetch(
      `${this.baseUrl}/analytics/hourly/${meterId}?date=${date}`
    );
    if (!response.ok) throw new Error('Failed to fetch hourly analytics');
    return response.json();
  }

  // Get weekly analytics for a specific meter (last 7 days)
  async getWeeklyAnalytics(meterId: string): Promise<WeeklyData[]> {
    const response = await fetch(
      `${this.baseUrl}/analytics/weekly/${meterId}`
    );
    if (!response.ok) throw new Error('Failed to fetch weekly analytics');
    return response.json();
  }

  // Get monthly analytics for a specific meter (last 30 days)
  async getMonthlyAnalytics(meterId: string): Promise<MonthlyData[]> {
    const response = await fetch(
      `${this.baseUrl}/analytics/monthly/${meterId}`
    );
    if (!response.ok) throw new Error('Failed to fetch monthly analytics');
    return response.json();
  }

  // Get last 60 days analytics for a specific meter
  async getLast60DaysAnalytics(meterId: string): Promise<Last60DaysData[]> {
    const response = await fetch(
      `${this.baseUrl}/analytics/last60days/${meterId}`
    );
    if (!response.ok) throw new Error('Failed to fetch last 60 days analytics');
    return response.json();
  }

  // Get custom date range analytics for a specific meter (monthly aggregation)
  async getCustomAnalytics(meterId: string, fromDate: string, toDate: string): Promise<CustomData[]> {
    const response = await fetch(
      `${this.baseUrl}/analytics/custom/${meterId}?fromDate=${fromDate}&toDate=${toDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch custom analytics');
    return response.json();
  }
}

export const apiService = new ApiService();