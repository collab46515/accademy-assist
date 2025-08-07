export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header];
        // Handle null/undefined values
        if (cell === null || cell === undefined) {
          cell = '';
        }
        // Convert to string and escape commas and quotes
        cell = String(cell);
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (amount: number, currency: string = 'OMR'): string => {
  return new Intl.NumberFormat('ar-OM', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100 * 100) / 100; // Round to 2 decimal places
};

export const generateReportSummary = (data: any[], type: string) => {
  const summary = {
    reportType: type,
    generatedAt: new Date().toISOString(),
    totalRecords: data.length,
    dateRange: {
      from: '',
      to: ''
    }
  };

  if (data.length > 0) {
    // Try to find date fields to establish range
    const dateFields = ['created_at', 'due_date', 'request_date', 'start_date'];
    
    for (const field of dateFields) {
      if (data[0][field]) {
        const dates = data.map(item => new Date(item[field])).sort((a, b) => a.getTime() - b.getTime());
        summary.dateRange.from = dates[0].toISOString().split('T')[0];
        summary.dateRange.to = dates[dates.length - 1].toISOString().split('T')[0];
        break;
      }
    }
  }

  return summary;
};