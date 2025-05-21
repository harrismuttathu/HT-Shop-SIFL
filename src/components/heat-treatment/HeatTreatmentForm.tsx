import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

// Define types for form data
interface HeatTreatmentLog {
  id: string;
  date: string;
  shift: string;
  employees: string[];
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
  attainingTime: string;
  soakingTime: string;
  endTime: string;
  coolingMode: string;
  notes: string;
}

// Initial configuration for dropdown options
const initialConfig = {
  shifts: ['A', 'B', 'C'],
  employees: ['Employee 1', 'Employee 2', 'Employee 3'],
  furnaces: [
    'HF1', 'HF2', 'HF3', 'HF4', 'TF2', 'BOFCO', 'Hi-Heat', 
    'Pit Furnace 150kW', 'Pit Furnace 240kW', 'Drop Bottom', 'Air Oven'
  ],
  processes: [
    'Normalising', 'Hardnening', 'Tempering', 'Homogenising', 
    'Ageing', 'Annealing', 'Solutionising', 'Stress Relieveing', 
    'Air Hardening', 'I Tempering', 'II Tempering'
  ],
  coolingModes: ['Air', 'Furnace', 'Fan', 'Water', 'Oil', 'Brine']
};

const HeatTreatmentForm: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState<HeatTreatmentLog>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    shift: '',
    employees: [],
    furnace: '',
    jobNo: '',
    material: '',
    quantity: '',
    weightPerForging: '',
    heatNo: '',
    serialNo: '',
    htBatchNo: '',
    process: '',
    processStartTime: '',
    temperature: '',
    attainingTime: '',
    soakingTime: '',
    endTime: '',
    coolingMode: '',
    notes: ''
  });

  // State for dropdown configuration
  const [config] = useState(initialConfig);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to local storage
    const logs = JSON.parse(localStorage.getItem('heatTreatmentLogs') || '[]');
    logs.push({...formData, createdAt: new Date().toISOString()});
    localStorage.setItem('heatTreatmentLogs', JSON.stringify(logs));
    
    // Reset form
    setFormData({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      shift: '',
      employees: [],
      furnace: '',
      jobNo: '',
      material: '',
      quantity: '',
      weightPerForging: '',
      heatNo: '',
      serialNo: '',
      htBatchNo: '',
      process: '',
      processStartTime: '',
      temperature: '',
      attainingTime: '',
      soakingTime: '',
      endTime: '',
      coolingMode: '',
      notes: ''
    });
    
    alert('Heat treatment log saved successfully!');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Heat Treatment Log</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date and Shift */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              name="date" 
              type="date" 
              value={formData.date} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shift">Shift</Label>
            <Select 
              onValueChange={(value) => handleSelectChange('shift', value)}
              value={formData.shift}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {config.shifts.map(shift => (
                  <SelectItem key={shift} value={shift}>
                    {shift}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Furnace Selection */}
        <div className="space-y-2">
          <Label htmlFor="furnace">Furnace</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('furnace', value)}
            value={formData.furnace}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select furnace" />
            </SelectTrigger>
            <SelectContent>
              {config.furnaces.map(furnace => (
                <SelectItem key={furnace} value={furnace}>
                  {furnace}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobNo">Job No.</Label>
            <Input 
              id="jobNo" 
              name="jobNo" 
              value={formData.jobNo} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input 
              id="material" 
              name="material" 
              value={formData.material} 
              onChange={handleInputChange} 
              placeholder="Enter material" 
              required 
            />
          </div>
        </div>
        
        {/* Quantity and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              value={formData.quantity} 
              onChange={handleInputChange} 
              placeholder="Enter quantity" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weightPerForging">Weight per Forging (kg)</Label>
            <Input 
              id="weightPerForging" 
              name="weightPerForging" 
              type="number" 
              step="0.01" 
              value={formData.weightPerForging} 
              onChange={handleInputChange} 
              placeholder="Enter weight per forging" 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heatNo">Heat No.</Label>
            <Input 
              id="heatNo" 
              name="heatNo" 
              value={formData.heatNo} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNo">Serial No.</Label>
            <Input 
              id="serialNo" 
              name="serialNo" 
              value={formData.serialNo} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="htBatchNo">HT Batch No.</Label>
            <Input 
              id="htBatchNo" 
              name="htBatchNo" 
              value={formData.htBatchNo} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        {/* Process Details */}
        <div className="space-y-2">
          <Label htmlFor="process">Process</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('process', value)}
            value={formData.process}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              {config.processes.map(process => (
                <SelectItem key={process} value={process}>
                  {process}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Time and Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="processStartTime">Process Start Time</Label>
            <Input 
              id="processStartTime" 
              name="processStartTime" 
              type="time" 
              value={formData.processStartTime} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input 
              id="temperature" 
              name="temperature" 
              type="number" 
              value={formData.temperature} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attainingTime">Attaining Time</Label>
            <Input 
              id="attainingTime" 
              name="attainingTime" 
              type="time" 
              value={formData.attainingTime} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="soakingTime">Soaking Time (minutes)</Label>
            <Input 
              id="soakingTime" 
              name="soakingTime" 
              type="number" 
              value={formData.soakingTime} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input 
              id="endTime" 
              name="endTime" 
              type="time" 
              value={formData.endTime} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        {/* Cooling Mode */}
        <div className="space-y-2">
          <Label htmlFor="coolingMode">Cooling Mode</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('coolingMode', value)}
            value={formData.coolingMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cooling mode" />
            </SelectTrigger>
            <SelectContent>
              {config.coolingModes.map(mode => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleInputChange} 
            rows={3} 
          />
        </div>
        
        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Heat Treatment Log
        </Button>
      </form>
    </div>
  );
};

export default HeatTreatmentForm;
