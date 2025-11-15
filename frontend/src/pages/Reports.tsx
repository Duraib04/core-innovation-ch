import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { apiService, PowerMeterReading } from "@/lib/api";

// Meter mapping
const meterMapping = {
  "Meter-001": "Main Panel",
  "Meter-002": "DG Supply", 
  "Meter-003": "Sub Panel",
  "Meter-004": "Lighting Load",
  "Meter-005": "AC Plant"
};

const meterNameToId = {
  "Main Panel": "Meter-001",
  "DG Supply": "Meter-002",
  "Sub Panel": "Meter-003",
  "Lighting Load": "Meter-004",
  "AC Plant": "Meter-005"
};

// Interface for processed report data
interface ReportRow {
  sno: number;
  dateTime: {
    date: string;
    time: string;
  };
  incomingEnergy: string;
  todayConsumption: string;
  liveConsumption: string;
  unitsConsumed: string;
  powerFactor: string;
  v12: string;
  v23: string;
  v31: string;
  avgVLL: string;
  v1n: string;
  v2n: string;
  v3n: string;
  avgVLN: string;
  i1: string;
  i2: string;
  i3: string;
  avgI: string;
  p1: string;
  p2: string;
  p3: string;
  avgP: string;
  loadP1: string;
  loadP2: string;
  loadP3: string;
  avgLoad: string;
}

// Convert database reading to report row format
const convertToReportRow = (reading: PowerMeterReading, index: number): ReportRow => {
  // Database stores date as DD-MM-YYYY text, use it directly
  const formattedDate = reading.date;
  
  return {
    sno: index + 1,
    dateTime: {
      date: formattedDate,
      time: reading.time
    },
    incomingEnergy: (reading.forward_active_energy_kwh || 0).toFixed(2),
    todayConsumption: (reading.todays_consumption_kwh || 0).toFixed(2),
    liveConsumption: (reading.consumed_energy_kwh || 0).toFixed(2), // Keep in kWh
    unitsConsumed: (reading.units_consumed || 0).toFixed(2),
    powerFactor: (reading.pf_avg || 0).toFixed(3),
    v12: (reading.v12 || 0).toFixed(1),
    v23: (reading.v23 || 0).toFixed(1),
    v31: (reading.v31 || 0).toFixed(1),
    avgVLL: (reading.vll_avg || 0).toFixed(1),
    v1n: (reading.v1_n || 0).toFixed(1),
    v2n: (reading.v2_n || 0).toFixed(1),
    v3n: (reading.v3_n || 0).toFixed(1),
    avgVLN: (reading.vln_avg || 0).toFixed(1),
    i1: (reading.i1 || 0).toFixed(2),
    i2: (reading.i2 || 0).toFixed(2),
    i3: (reading.i3 || 0).toFixed(2),
    avgI: (reading.iavg || 0).toFixed(2),
    p1: (reading.p1_active_kw || 0).toFixed(2),
    p2: (reading.p2_active_kw || 0).toFixed(2),
    p3: (reading.p3_active_kw || 0).toFixed(2),
    avgP: (reading.total_active_power_kw || 0).toFixed(2),
    loadP1: (reading.percent_load_l1 || 0).toFixed(1),
    loadP2: (reading.percent_load_l2 || 0).toFixed(1),
    loadP3: (reading.percent_load_l3 || 0).toFixed(1),
    avgLoad: (reading.percent_average_load || 0).toFixed(1),
  };
};

const Reports = () => {
  const { toast } = useToast();
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const [selectedMeter, setSelectedMeter] = useState<string>("Meter-001");
  const [selectedMeterName, setSelectedMeterName] = useState<string>("Main Panel");
  const [fromDate, setFromDate] = useState<string>(getTodayDate()); // Current day
  const [toDate, setToDate] = useState<string>(getTodayDate()); // Current day
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);
  const recordsPerPage = 50;
  
  // Minimum date allowed (01-01-2025)
  const minDate = "2025-01-01";
  const maxDate = getTodayDate();

  // Fetch report data from API
  const fetchReportData = async (page: number = 1, showToast: boolean = false) => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching report data:', { selectedMeter, fromDate, toDate, page });
      const response = await apiService.getReportData({
        meterId: selectedMeter,
        fromDate,
        toDate,
        page,
        limit: recordsPerPage
      });

      console.log('📊 API response:', response);
      
      const processedData = response.data.map((reading, index) => 
        convertToReportRow(reading, (page - 1) * recordsPerPage + index)
      );

      setReportData(processedData);
      setTotalPages(response.pagination.totalPages);
      setTotalRecords(response.pagination.totalRecords);
      setCurrentPage(page);

      if (showToast) {
        toast({
          title: (
            <div className="flex items-center gap-2 w-fit">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="whitespace-nowrap">Report Updated Successfully</span>
            </div>
          ) as any,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching report data:', error);
      setReportData([]);
      setTotalPages(1);
      setTotalRecords(0);
      toast({
        title: "Error",
        description: "please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load on page mount - load today's data automatically
  useEffect(() => {
    if (!hasInitialLoad) {
      console.log('🚀 Initial load - fetching today\'s data');
      fetchReportData(1, false);
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!hasInitialLoad) return;

    const interval = setInterval(() => {
      fetchReportData(currentPage, true);
    }, 60000);

    return () => clearInterval(interval);
  }, [currentPage, hasInitialLoad, selectedMeter, fromDate, toDate]);

  const handleMeterIdChange = (meterId: string) => {
    setSelectedMeter(meterId);
    setSelectedMeterName(meterMapping[meterId as keyof typeof meterMapping]);
  };

  const handleMeterNameChange = (meterName: string) => {
    setSelectedMeterName(meterName);
    setSelectedMeter(meterNameToId[meterName as keyof typeof meterNameToId]);
  };

  const formatMeterDisplay = (meterId: string) => {
    const meterName = meterMapping[meterId as keyof typeof meterMapping];
    const idNumber = meterId.replace('Meter-', '');
    return `${meterId} | ${meterName}`;
  };

  const handleApplyFilter = () => {
    // Validate date range
    if (fromDate > toDate) {
      toast({
        title: "Invalid Date Range",
        description: "From Date cannot be after To Date",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentPage(1);
    fetchReportData(1, true);
    toast({
      title: "Filter Applied",
      description: `Loading data for ${selectedMeterName} from ${fromDate} to ${toDate}`,
    });
  };

  const downloadExcel = async () => {
    if (!hasInitialLoad || reportData.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to download",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Preparing Download",
        description: "Fetching all records for export...",
      });

      // Fetch all data for export (no pagination)
      const response = await apiService.getReportData({
        meterId: selectedMeter,
        fromDate,
        toDate,
        limit: 10000 // Large limit to get all records
      });

      const allData = response.data.map((reading, index) => 
        convertToReportRow(reading, index)
      );

      const meterName = meterMapping[selectedMeter as keyof typeof meterMapping];
      const filename = `Reports_${selectedMeter}_${meterName.replace(/\s+/g, '')}_${fromDate}_to_${toDate}.xlsx`;
      const timestamp = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      // Prepare header rows with filter details and timestamp
      const headerRows = [
        ['Energy Monitoring System - Report'],
        [],
        ['Filter Details:'],
        ['Meter ID:', selectedMeter],
        ['Meter Name:', meterName],
        ['From Date:', fromDate],
        ['To Date:', toDate],
        ['Total Records:', allData.length.toString()],
        ['Downloaded on:', timestamp],
        [],
        []
      ];

      // Prepare data for Excel
      const excelData = allData.map(row => ({
        'S.No': row.sno,
        'Date': row.dateTime.date,
        'Time': row.dateTime.time,
        'Incoming Energy (kWh)': row.incomingEnergy,
        "Today's Consumption (kWh)": row.todayConsumption,
        'Consumed Energy (kWh)': row.liveConsumption, // Already in kWh
        'Total Units Consumed': row.unitsConsumed,
        'Power Factor': row.powerFactor,
        'P1 (kW)': row.p1,
        'P2 (kW)': row.p2,
        'P3 (kW)': row.p3,
        'Avg P (kW)': row.avgP,
        'Load% P1': row.loadP1,
        'Load% P2': row.loadP2,
        'Load% P3': row.loadP3,
        'Avg Load%': row.avgLoad,
        'V12 (V)': row.v12,
        'V23 (V)': row.v23,
        'V31 (V)': row.v31,
        'Avg VLL (V)': row.avgVLL,
        'V1N (V)': row.v1n,
        'V2N (V)': row.v2n,
        'V3N (V)': row.v3n,
        'Avg VLN (V)': row.avgVLN,
        'I1 (A)': row.i1,
        'I2 (A)': row.i2,
        'I3 (A)': row.i3,
        'Avg I (A)': row.avgI,
      }));

      // Create worksheet starting with header
      const ws = XLSX.utils.aoa_to_sheet(headerRows);
      
      // Add data starting from row after header
      XLSX.utils.sheet_add_json(ws, excelData, { origin: -1, skipHeader: false });

      // Add footer row
      const footerRowIndex = headerRows.length + excelData.length + 1;
      XLSX.utils.sheet_add_aoa(ws, [['End of Report']], { origin: footerRowIndex });

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      // Download
      XLSX.writeFile(wb, filename);
      toast({
        title: "Excel Downloaded",
        description: `Complete report (${allData.length} records) exported successfully`,
      });
    } catch (error) {
      console.error('❌ Error downloading report:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchReportData(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchReportData(prevPage);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-2 lg:p-3 w-full">
      {/* Page Title and Download Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Reports</h1>
        <Button 
          onClick={downloadExcel} 
          className="bg-primary hover:bg-primary/90"
          disabled={!hasInitialLoad || reportData.length === 0 || isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download Report
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="inline-flex items-center px-3 py-2 bg-muted/50 rounded-md border flex-wrap">
            <span className="text-sm font-medium text-muted-foreground mr-2">Report for:</span>
            <span className="font-semibold text-foreground">
              {formatMeterDisplay(selectedMeter)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Meter ID Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="meter-select">Meter ID</Label>
              <Select value={selectedMeter} onValueChange={handleMeterIdChange}>
                <SelectTrigger id="meter-select">
                  <SelectValue placeholder="Select Meter ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meter-001">Meter-001</SelectItem>
                  <SelectItem value="Meter-002">Meter-002</SelectItem>
                  <SelectItem value="Meter-003">Meter-003</SelectItem>
                  <SelectItem value="Meter-004">Meter-004</SelectItem>
                  <SelectItem value="Meter-005">Meter-005</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meter Name Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="meter-name-select">Meter Name</Label>
              <Select value={selectedMeterName} onValueChange={handleMeterNameChange}>
                <SelectTrigger id="meter-name-select">
                  <SelectValue placeholder="Select Meter Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Panel">Main Panel</SelectItem>
                  <SelectItem value="DG Supply">DG Supply</SelectItem>
                  <SelectItem value="Sub Panel">Sub Panel</SelectItem>
                  <SelectItem value="Lighting Load">Lighting Load</SelectItem>
                  <SelectItem value="AC Plant">AC Plant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                min={minDate}
                max={maxDate}
              />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={minDate}
                max={maxDate}
              />
            </div>

            {/* Apply Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={handleApplyFilter} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="w-full shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="rounded-xl border border-border overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto relative">
              <table className="relative caption-bottom text-sm table-fixed w-full" style={{ minWidth: '1600px' }}>
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '110px' }} />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '80px' }} />
                  {/* Active Power - 4 columns */}
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  {/* Load % - 4 columns */}
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '85px' }} />
                  {/* Voltage VLL - 4 columns */}
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '80px' }} />
                  {/* Voltage VLN - 4 columns */}
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '80px' }} />
                  {/* Current - 4 columns */}
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '80px' }} />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-muted after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#d3d3d3]">
                  <tr>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">S.No</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Date</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Time</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Incoming<br/>Energy<br/>(kWh)</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Consumed<br/>Energy<br/>(kWh)</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Today's<br/>Consumption<br/>(kWh)</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Total Units<br/>Consumed</th>
                    <th rowSpan={2} className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold whitespace-nowrap text-xs border-r border-[#d3d3d3]">Power<br/>Factor</th>
                    <th colSpan={4} className="h-12 px-2 text-center align-middle font-medium border-b border-r border-[#d3d3d3] bg-muted font-semibold text-xs">Active Power (kW)</th>
                    <th colSpan={4} className="h-12 px-2 text-center align-middle font-medium border-b border-r border-[#d3d3d3] bg-muted font-semibold text-xs">Load %</th>
                    <th colSpan={4} className="h-12 px-2 text-center align-middle font-medium border-b border-r border-[#d3d3d3] bg-muted font-semibold text-xs">Voltage VLL (V)</th>
                    <th colSpan={4} className="h-12 px-2 text-center align-middle font-medium border-b border-r border-[#d3d3d3] bg-muted font-semibold text-xs">Voltage VLN (V)</th>
                    <th colSpan={4} className="h-12 px-2 text-center align-middle font-medium border-b border-r border-[#d3d3d3] bg-muted font-semibold text-xs">Current (A)</th>
                  </tr>
                  <tr>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P1</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P2</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P3</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">Avg P</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P1</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P2</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">P3</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">Avg Load%</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V12</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V23</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V31</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">Avg VLL</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V1N</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V2N</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">V3N</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">Avg VLN</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">I1</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">I2</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">I3</th>
                    <th className="h-12 px-2 text-center align-middle font-medium bg-muted font-semibold text-xs border-r border-[#d3d3d3]">Avg I</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className="border-b transition-colors">
                      <td colSpan={28} className="p-4 align-middle text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading report data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : reportData.length === 0 ? (
                    <tr className="border-b transition-colors">
                      <td colSpan={28} className="p-4 align-middle text-center py-8">
                        <p className="text-muted-foreground">No data found for the selected filters</p>
                      </td>
                    </tr>
                  ) : (
                    reportData.map((row, index) => (
                      <tr key={index} className="border-b border-[#d3d3d3] hover:bg-muted/50 transition-colors">
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.sno}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] whitespace-nowrap text-xs">{row.dateTime.date}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] whitespace-nowrap text-xs">{row.dateTime.time}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.incomingEnergy}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.liveConsumption}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.todayConsumption}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.unitsConsumed}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.powerFactor}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.p1}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.p2}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.p3}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.avgP}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.loadP1}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.loadP2}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.loadP3}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.avgLoad}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v12}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v23}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v31}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.avgVLL}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v1n}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v2n}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.v3n}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.avgVLN}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.i1}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.i2}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.i3}</td>
                        <td className="p-2 align-middle text-center border-r border-[#d3d3d3] text-xs">{row.avgI}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border border-border rounded-lg shadow-sm flex-wrap gap-4">
        <div className="text-sm text-muted-foreground">
          {hasInitialLoad && reportData.length > 0 ? (
            <>
              Showing {reportData.length} of {totalRecords} records | Page {currentPage} of {totalPages}
            </>
          ) : (
            'No data to display'
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || !hasInitialLoad || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || !hasInitialLoad || isLoading}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;