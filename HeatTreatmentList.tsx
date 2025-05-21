import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

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

const HeatTreatmentList: React.FC = () => {
  const [logs, setLogs] = useState<HeatTreatmentLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<HeatTreatmentLog[]>([]);
  const [sortField, setSortField] = useState<keyof HeatTreatmentLog>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load logs from localStorage on component mount
  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('heatTreatmentLogs') || '[]');
    setLogs(storedLogs);
    setFilteredLogs(storedLogs);
  }, []);

  // Filter and sort logs when search term or sort parameters change
  useEffect(() => {
    let filtered = [...logs];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.jobNo.toLowerCase().includes(lowerCaseSearch) ||
        log.material.toLowerCase().includes(lowerCaseSearch) ||
        log.process.toLowerCase().includes(lowerCaseSearch) ||
        log.furnace.toLowerCase().includes(lowerCaseSearch) ||
        log.date.includes(searchTerm)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredLogs(filtered);
  }, [searchTerm, logs, sortField, sortDirection]);

  // Handle log deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      const updatedLogs = logs.filter(log => log.id !== id);
      setLogs(updatedLogs);
      localStorage.setItem('heatTreatmentLogs', JSON.stringify(updatedLogs));
    }
  };

  // Handle sort change
  const handleSort = (field: keyof HeatTreatmentLog) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export logs to CSV
  const exportToCSV = () => {
    if (logs.length === 0) {
      alert('No logs to export');
      return;
    }

    // Create CSV header
    const headers = Object.keys(logs[0]).join(',');
    
    // Create CSV rows
    const csvRows = logs.map(log => {
      return Object.values(log).map(value => {
        // Handle arrays and objects by stringifying them
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Handle strings with commas by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    }).join('\n');
    
    // Combine header and rows
    const csvContent = `${headers}\n${csvRows}`;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `heat_treatment_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total weight
  const calculateTotalWeight = () => {
    return filteredLogs.reduce((total, log) => {
      const quantity = parseInt(log.quantity) || 0;
      const weight = parseFloat(log.weightPerForging) || 0;
      return total + (quantity * weight);
    }, 0).toFixed(2);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Heat Treatment Logs</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={exportToCSV} variant="outline">
            Export to CSV
          </Button>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Total Weight: {calculateTotalWeight()} kg</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Furnace</TableHead>
                <TableHead>Job No.</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Weight/Forging (kg)</TableHead>
                <TableHead>Total Weight (kg)</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('process')}
                >
                  Process {sortField === 'process' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.shift}</TableCell>
                    <TableCell>{log.furnace}</TableCell>
                    <TableCell>{log.jobNo}</TableCell>
                    <TableCell>{log.material}</TableCell>
                    <TableCell>{log.quantity}</TableCell>
                    <TableCell>{log.weightPerForging}</TableCell>
                    <TableCell>
                      {((parseInt(log.quantity) || 0) * (parseFloat(log.weightPerForging) || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>{log.process}</TableCell>
                    <TableCell>{log.temperature}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No heat treatment logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatTreatmentList;
