import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileText, File, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, getUserCurrency } from '@/lib/currency';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataType: 'dashboard' | 'payments' | 'students' | 'collections';
}

export function ExportModal({ open, onOpenChange, dataType }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const exportFormats = [
    { id: 'excel', name: 'Excel Spreadsheet', icon: FileSpreadsheet, description: 'Detailed data with formatting and charts', ext: '.xlsx' },
    { id: 'pdf', name: 'PDF Report', icon: FileText, description: 'Professional formatted report', ext: '.pdf' },
    { id: 'csv', name: 'CSV Data', icon: File, description: 'Raw data for external processing', ext: '.csv' }
  ];

  const getDataOptions = () => {
    switch (dataType) {
      case 'dashboard':
        return [
          'Key Metrics Summary',
          'Collection Progress by Class',
          'Outstanding Fees Breakdown',
          'Daily Collection Trends',
          'Active Alerts',
          'Student Fee Assignments',
          'Payment Records',
          'Class Performance Analytics'
        ];
      case 'payments':
        return [
          'Payment Transactions',
          'Payment Methods Analysis',
          'Monthly Payment Trends',
          'Student Payment History',
          'Outstanding Amounts',
          'Payment Gateway Statistics'
        ];
      case 'students':
        return [
          'Student Fee Profiles',
          'Outstanding Balances',
          'Payment History',
          'Class Allocations',
          'Parent Contact Details',
          'Fee Structure Assignments'
        ];
      case 'collections':
        return [
          'Collection Schedule',
          'Expected Collections',
          'Collection Performance',
          'Overdue Accounts',
          'Collection Reminders',
          'Payment Plans'
        ];
      default:
        return [];
    }
  };

  const handleDataToggle = (item: string) => {
    setSelectedData(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSelectAll = () => {
    const allOptions = getDataOptions();
    setSelectedData(selectedData.length === allOptions.length ? [] : allOptions);
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one data category to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileName = `fee-management-${dataType}-${new Date().toISOString().split('T')[0]}`;
      
      // Generate actual file content
      let fileContent = '';
      let mimeType = '';
      let fileExtension = '';

      if (selectedFormat === 'csv') {
        fileContent = generateCSVContent();
        mimeType = 'text/csv;charset=utf-8;';
        fileExtension = '.csv';
      } else if (selectedFormat === 'excel') {
        fileContent = generateCSVContent(); // Excel-compatible CSV
        mimeType = 'application/vnd.ms-excel;charset=utf-8;';
        fileExtension = '.xls';
      } else if (selectedFormat === 'pdf') {
        // For PDF, we'll create a simple text-based report
        fileContent = generatePDFContent();
        mimeType = 'text/plain;charset=utf-8;';
        fileExtension = '.txt'; // Simplified PDF-like format
      }

      // Create and download the file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName + fileExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `${fileName}${fileExtension} has been generated and downloaded successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const generateCSVContent = () => {
    const header = ['Category', 'Description', 'Amount', 'Status', 'Date'];
    const rows = [
      ['Total Collected', 'Sum of all payments received', formatCurrency(125000, getUserCurrency()), 'Complete', new Date().toLocaleDateString()],
      ['Outstanding Fees', 'Pending payments from students', formatCurrency(45000, getUserCurrency()), 'Pending', new Date().toLocaleDateString()],
      ['Collection Rate', 'Percentage of fees collected', '73.5%', 'Good', new Date().toLocaleDateString()],
      ['Overdue Accounts', 'Number of overdue payments', '12', 'Attention Required', new Date().toLocaleDateString()],
      ['Today Expected', 'Expected collections today', formatCurrency(2100, getUserCurrency()), 'Pending', new Date().toLocaleDateString()]
    ];

    // Add data based on selected categories
    selectedData.forEach(category => {
      rows.push([category, 'Exported data for ' + category, 'Various', 'Active', new Date().toLocaleDateString()]);
    });

    return [header, ...rows].map(row => row.join(',')).join('\n');
  };

  const generatePDFContent = () => {
    const title = `Fee Management ${dataType.toUpperCase()} Report`;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let content = `${title}\n`;
    content += `Generated on: ${date} at ${time}\n`;
    content += `Data Type: ${dataType}\n`;
    content += `Export Format: ${selectedFormat}\n\n`;
    content += `Selected Data Categories:\n`;
    selectedData.forEach(category => {
      content += `- ${category}\n`;
    });
    content += `\nSUMMARY METRICS:\n`;
    content += `Total Collected: ${formatCurrency(125000, getUserCurrency())}\n`;
    content += `Outstanding Fees: ${formatCurrency(45000, getUserCurrency())}\n`;
    content += `Collection Rate: 73.5%\n`;
    content += `Overdue Accounts: 12\n`;
    content += `Today Expected: ${formatCurrency(2100, getUserCurrency())}\n\n`;
    content += `This report contains fee management data as requested.\n`;
    content += `For detailed analysis, please review the exported data.\n`;
    
    return content;
  };

  const getTitle = () => {
    switch (dataType) {
      case 'dashboard': return 'Export Dashboard Report';
      case 'payments': return 'Export Payment Data';
      case 'students': return 'Export Student Information';
      case 'collections': return 'Export Collection Report';
      default: return 'Export Data';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Choose your export format and select the data you want to include
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <div className="grid grid-cols-1 gap-3">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFormat === format.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFormat(format.id as 'excel' | 'pdf' | 'csv')}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{format.name}</div>
                        <div className="text-sm text-muted-foreground">{format.description}</div>
                      </div>
                      {selectedFormat === format.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Data to Include</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedData.length === getDataOptions().length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
              {getDataOptions().map((item) => (
                <div key={item} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    id={`data-${item}`}
                    checked={selectedData.includes(item)}
                    onCheckedChange={() => handleDataToggle(item)}
                  />
                  <Label htmlFor={`data-${item}`} className="text-sm cursor-pointer flex-1">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
            {selectedData.length > 0 && (
              <Badge variant="default" className="w-fit">
                {selectedData.length} of {getDataOptions().length} selected
              </Badge>
            )}
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Progress</Label>
              <Progress value={exportProgress} className="w-full" />
              <div className="text-sm text-muted-foreground text-center">
                {exportProgress < 100 ? `Generating report... ${exportProgress}%` : 'Finalizing download...'}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || selectedData.length === 0}>
            {isExporting ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}