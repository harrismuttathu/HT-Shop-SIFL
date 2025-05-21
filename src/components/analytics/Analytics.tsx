import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Types for logs
interface HeatTreatmentLog {
  id: string;
  date: string;
  shift: string;
  furnace: string;
  jobNo: string;
  material: string;
  quantity: string;
  weightPerForging: string;
  heatNo: string;
  serialNo: string;
  htBatchNo: string;
  process: string;
  processStartTime: string;
  temperature: string;
  endTime: string;
  coolingMode: string;
  createdAt: string;
}

interface MaintenanceLog {
  id: string;
  date: string;
  machine: string;
  breakdownType: string;
  breakdownTime: string;
  rectificationTime: string;
  repairTime: string;
  createdAt: string;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Analytics: React.FC = () => {
  // State for logs
  const [heatTreatmentLogs, setHeatTreatmentLogs] = useState<HeatTreatmentLog[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  
  // State for filters
  const [timeRange, setTimeRange] = useState('all');
  const [selectedFurnace, setSelectedFurnace] = useState('all');
  const [selectedProcess, setSelectedProcess] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('all'); // 'day', 'month', 'year'
  
  // State for chart data
  const [furnaceUtilizationData, setFurnaceUtilizationData] = useState<any[]>([]);
  const [processDistributionData, setProcessDistributionData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  const [weightByProcessData, setWeightByProcessData] = useState<any[]>([]);
  const [weightByTimeData, setWeightByTimeData] = useState<any[]>([]);
  
  // Load logs from localStorage on component mount
  useEffect(() => {
    const storedHeatTreatmentLogs = JSON.parse(localStorage.getItem('heatTreatmentLogs') || '[]');
    const storedMaintenanceLogs = JSON.parse(localStorage.getItem('maintenanceLogs') || '[]');
    
    setHeatTreatmentLogs(storedHeatTreatmentLogs);
    setMaintenanceLogs(storedMaintenanceLogs);
  }, []);
  
  // Filter logs based on time range and other filters
  useEffect(() => {
    let filteredHeatTreatmentLogs = [...heatTreatmentLogs];
    let filteredMaintenanceLogs = [...maintenanceLogs];
    
    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredHeatTreatmentLogs = heatTreatmentLogs.filter(log => 
        new Date(log.date) >= startDate
      );
      
      filteredMaintenanceLogs = maintenanceLogs.filter(log => 
        new Date(log.date) >= startDate
      );
    }
    
    // Furnace filter
    if (selectedFurnace !== 'all') {
      filteredHeatTreatmentLogs = filteredHeatTreatmentLogs.filter(log => 
        log.furnace === selectedFurnace
      );
      
      filteredMaintenanceLogs = filteredMaintenanceLogs.filter(log => 
        log.machine === selectedFurnace
      );
    }
    
    // Process filter
    if (selectedProcess !== 'all') {
      filteredHeatTreatmentLogs = filteredHeatTreatmentLogs.filter(log => 
        log.process === selectedProcess
      );
    }
    
    // Generate chart data
    generateFurnaceUtilizationData(filteredHeatTreatmentLogs);
    generateProcessDistributionData(filteredHeatTreatmentLogs);
    generateBreakdownData(filteredMaintenanceLogs);
    generateWeightByProcessData(filteredHeatTreatmentLogs);
    generateWeightByTimeData(filteredHeatTreatmentLogs, dateFilterType);
    
  }, [timeRange, selectedFurnace, selectedProcess, dateFilterType, heatTreatmentLogs, maintenanceLogs]);
  
  // Generate furnace utilization data
  const generateFurnaceUtilizationData = (logs: HeatTreatmentLog[]) => {
    const furnaceMap = new Map<string, number>();
    
    logs.forEach(log => {
      if (!log.furnace || !log.processStartTime || !log.endTime) return;
      
      const startTime = new Date(`${log.date}T${log.processStartTime}`);
      const endTime = new Date(`${log.date}T${log.endTime}`);
      
      // Handle case where end time is on the next day
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }
      
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      furnaceMap.set(
        log.furnace, 
        (furnaceMap.get(log.furnace) || 0) + durationHours
      );
    });
    
    const data = Array.from(furnaceMap.entries()).map(([name, hours]) => ({
      name,
      hours: parseFloat(hours.toFixed(2))
    }));
    
    setFurnaceUtilizationData(data);
  };
  
  // Generate process distribution data
  const generateProcessDistributionData = (logs: HeatTreatmentLog[]) => {
    const processMap = new Map<string, number>();
    
    logs.forEach(log => {
      if (!log.process) return;
      processMap.set(log.process, (processMap.get(log.process) || 0) + 1);
    });
    
    const data = Array.from(processMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    setProcessDistributionData(data);
  };
  
  // Generate breakdown data
  const generateBreakdownData = (logs: MaintenanceLog[]) => {
    const machineMap = new Map<string, number>();
    
    logs.forEach(log => {
      if (!log.machine || !log.repairTime) return;
      
      // Extract hours from repair time string (e.g., "2 hours, 30 minutes")
      const hoursMatch = log.repairTime.match(/(\d+)\s+hours?/);
      const minutesMatch = log.repairTime.match(/(\d+)\s+minutes?/);
      
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) / 60 : 0;
      
      const totalHours = hours + minutes;
      
      machineMap.set(
        log.machine, 
        (machineMap.get(log.machine) || 0) + totalHours
      );
    });
    
    const data = Array.from(machineMap.entries()).map(([name, hours]) => ({
      name,
      hours: parseFloat(hours.toFixed(2))
    }));
    
    setBreakdownData(data);
  };
  
  // Generate weight by process data
  const generateWeightByProcessData = (logs: HeatTreatmentLog[]) => {
    const processWeightMap = new Map<string, number>();
    
    logs.forEach(log => {
      if (!log.process || !log.quantity || !log.weightPerForging) return;
      
      const quantity = parseInt(log.quantity) || 0;
      const weightPerForging = parseFloat(log.weightPerForging) || 0;
      const totalWeight = quantity * weightPerForging;
      
      processWeightMap.set(
        log.process, 
        (processWeightMap.get(log.process) || 0) + totalWeight
      );
    });
    
    const data = Array.from(processWeightMap.entries()).map(([name, weight]) => ({
      name,
      weight: parseFloat(weight.toFixed(2))
    }));
    
    setWeightByProcessData(data);
  };
  
  // Generate weight by time data (day, month, year)
  const generateWeightByTimeData = (logs: HeatTreatmentLog[], filterType: string) => {
    const timeWeightMap = new Map<string, number>();
    
    logs.forEach(log => {
      if (!log.date || !log.quantity || !log.weightPerForging) return;
      
      const quantity = parseInt(log.quantity) || 0;
      const weightPerForging = parseFloat(log.weightPerForging) || 0;
      const totalWeight = quantity * weightPerForging;
      
      let timeKey: string;
      const date = new Date(log.date);
      
      switch (filterType) {
        case 'day':
          timeKey = log.date; // YYYY-MM-DD
          break;
        case 'month':
          timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
          break;
        case 'year':
          timeKey = date.getFullYear().toString(); // YYYY
          break;
        default:
          timeKey = log.date; // Default to day
      }
      
      timeWeightMap.set(
        timeKey, 
        (timeWeightMap.get(timeKey) || 0) + totalWeight
      );
    });
    
    // Sort by time key
    const sortedEntries = Array.from(timeWeightMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    const data = sortedEntries.map(([time, weight]) => ({
      time,
      weight: parseFloat(weight.toFixed(2))
    }));
    
    setWeightByTimeData(data);
  };
  
  // Get unique furnaces for filter dropdown
  const getUniqueFurnaces = () => {
    const furnaces = new Set<string>();
    
    heatTreatmentLogs.forEach(log => {
      if (log.furnace) furnaces.add(log.furnace);
    });
    
    maintenanceLogs.forEach(log => {
      if (log.machine) furnaces.add(log.machine);
    });
    
    return Array.from(furnaces);
  };
  
  // Get unique processes for filter dropdown
  const getUniqueProcesses = () => {
    const processes = new Set<string>();
    
    heatTreatmentLogs.forEach(log => {
      if (log.process) processes.add(log.process);
    });
    
    return Array.from(processes);
  };
  
  // Calculate total weight for all filtered logs
  const calculateTotalWeight = () => {
    let filteredLogs = [...heatTreatmentLogs];
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.date) >= startDate
      );
    }
    
    // Apply furnace filter
    if (selectedFurnace !== 'all') {
      filteredLogs = filteredLogs.filter(log => 
        log.furnace === selectedFurnace
      );
    }
    
    // Apply process filter
    if (selectedProcess !== 'all') {
      filteredLogs = filteredLogs.filter(log => 
        log.process === selectedProcess
      );
    }
    
    return filteredLogs.reduce((total, log) => {
      const quantity = parseInt(log.quantity) || 0;
      const weight = parseFloat(log.weightPerForging) || 0;
      return total + (quantity * weight);
    }, 0).toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Analytics Dashboard</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select 
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="furnace">Furnace/Machine</Label>
              <Select 
                value={selectedFurnace}
                onValueChange={setSelectedFurnace}
              >
                <SelectTrigger id="furnace">
                  <SelectValue placeholder="Select furnace/machine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Furnaces</SelectItem>
                  {getUniqueFurnaces().map(furnace => (
                    <SelectItem key={furnace} value={furnace}>
                      {furnace}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="process">Process</Label>
              <Select 
                value={selectedProcess}
                onValueChange={setSelectedProcess}
              >
                <SelectTrigger id="process">
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  {getUniqueProcesses().map(process => (
                    <SelectItem key={process} value={process}>
                      {process}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Summary</h3>
            <p className="text-lg">Total Weight: <span className="font-bold">{calculateTotalWeight()} kg</span></p>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="weightByProcess">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="weightByProcess">Weight by Process</TabsTrigger>
          <TabsTrigger value="weightByTime">Weight by Time</TabsTrigger>
          <TabsTrigger value="furnaceUtilization">Furnace Utilization</TabsTrigger>
          <TabsTrigger value="processDistribution">Process Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weightByProcess">
          <Card>
            <CardHeader>
              <CardTitle>Total Weight by Process (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              {weightByProcessData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={weightByProcessData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                    <Legend />
                    <Bar dataKey="weight" fill="#8884d8" name="Total Weight (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10">No data available for the selected filters</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weightByTime">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Weight by Time Period (kg)</CardTitle>
                <Select 
                  value={dateFilterType}
                  onValueChange={setDateFilterType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">By Day</SelectItem>
                    <SelectItem value="month">By Month</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {weightByTimeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={weightByTimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" angle={-45} textAnchor="end" height={70} />
                    <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Total Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10">No data available for the selected filters</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="furnaceUtilization">
          <Card>
            <CardHeader>
              <CardTitle>Furnace Utilization (Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              {furnaceUtilizationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={furnaceUtilizationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} hours`, 'Utilization']} />
                    <Legend />
                    <Bar dataKey="hours" fill="#0088FE" name="Hours Used" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10">No data available for the selected filters</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processDistribution">
          <Card>
            <CardHeader>
              <CardTitle>Process Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {processDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={processDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processDistributionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} logs`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10">No data available for the selected filters</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
