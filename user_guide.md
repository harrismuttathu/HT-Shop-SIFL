# SIFL Heat Treatment and Maintenance Log System - User Guide

## Overview

This web application is designed for the Heat Treatment and Metallurgical Laboratory of Steel and Industrial Forgings Ltd. (SIFL) to track heat treatment processes and maintenance activities. The application allows you to:

1. Log heat treatment processes with detailed parameters
2. Track machine breakdowns and maintenance activities
3. Visualize data through interactive graphs and charts
4. Export data to CSV format for further analysis

## Accessing the Application

The application is deployed on GitHub Pages and can be accessed from any device with an internet connection. All data is stored locally on your device, so you can access your logs even without an internet connection once the page is loaded.

## Features

### Heat Treatment Log

The Heat Treatment Log module allows you to record:

- Shift (A, B, C)
- Employee information
- Furnace selection (HF1, HF2, HF3, HF4, TF2, BOFCO, Hi-Heat, Pit Furnace 150kW, Pit Furnace 240kW, Drop Bottom, Air Oven)
- Job details (job number, material, heat number, serial number, HT batch number)
- Process type (Normalising, Hardnening, Tempering, Homogenising, Ageing, Annealing, Solutionising, Stress Relieveing, Air Hardening, I Tempering, II Tempering)
- Time tracking (process start time, attaining time, soaking time, end time)
- Temperature settings
- Cooling mode (Air, Furnace, Fan, Water, Oil, Brine)
- Additional notes

### Maintenance Log

The Maintenance Log module allows you to record:

- Machine information
- Breakdown type
- Date and time of breakdown
- Time of rectification
- Total repair time (automatically calculated)
- Additional notes

### Analytics Dashboard

The Analytics Dashboard provides visual insights into your data:

- Furnace Utilization: See which furnaces are used most frequently and for how long
- Process Distribution: Understand the distribution of different heat treatment processes
- Breakdown Analysis: Track machine downtime and identify maintenance patterns

### Data Export

All logs can be exported to CSV format for further analysis in spreadsheet applications like Microsoft Excel.

## Using the Application

### Adding a Heat Treatment Log

1. Navigate to the "Heat Treatment" tab
2. Fill in the required fields in the form
3. Click "Save Heat Treatment Log"
4. The log will be saved and appear in the list on the right

### Adding a Maintenance Log

1. Navigate to the "Maintenance" tab
2. Fill in the required fields in the form
3. Click "Save Maintenance Log"
4. The log will be saved and appear in the list on the right

### Viewing Analytics

1. Navigate to the "Analytics" tab
2. Use the filters at the top to select a time range and specific furnace/machine
3. Switch between different visualization tabs to view different aspects of your data

### Exporting Data

1. Navigate to either the "Heat Treatment" or "Maintenance" tab
2. Click the "Export to CSV" button above the data table
3. The file will be downloaded to your device

## Data Storage

All data is stored locally on your device using the browser's localStorage feature. This means:

- Your data remains private and is not sent to any external servers
- You can access your data even without an internet connection once the page is loaded
- Clearing your browser data will delete your logs, so export important data regularly

## Mobile Access

The application is fully responsive and can be used on mobile devices. You can access all features from your phone or tablet, making it easy to log data directly from the factory floor.

## Customization

The dropdown lists for shifts, employees, furnaces, materials, processes, and cooling modes can be modified by editing the configuration in the application code. Please contact your IT department if you need to make changes to these lists.

## Support

If you encounter any issues or have questions about using the application, please contact your IT department or the application developer.
