import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, Calendar, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from "date-fns";

interface CSVReportSectionProps {
  title: string;
  description: string;
  moduleName: string; // e.g., "infirmary", "complaints", "safeguarding"
}

type ReportPeriod = "today" | "week" | "month" | "mtd" | "quarter" | "ytd" | "year" | "custom";
type ReportFormat = "csv" | "excel" | "pdf";

interface ReportOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function CSVReportSection({ title, description, moduleName }: CSVReportSectionProps) {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("month");
  const [reportFormat, setReportFormat] = useState<ReportFormat>("csv");
  const [isGenerating, setIsGenerating] = useState(false);

  // These would be different for each module
  const getReportOptions = (): ReportOption[] => {
    switch (moduleName) {
      case "infirmary":
        return [
          { id: "visits", label: "Medical Visits", description: "All medical visits with details", enabled: true },
          { id: "medicine", label: "Medicine Administration", description: "Medication records and dosages", enabled: true },
          { id: "appointments", label: "Appointments", description: "Scheduled and completed appointments", enabled: true },
          { id: "active_cases", label: "Active Medical Cases", description: "Students with ongoing medical needs", enabled: false },
          { id: "vital_signs", label: "Vital Signs Records", description: "Temperature, BP, pulse data", enabled: false },
          { id: "parent_notifications", label: "Parent Notifications", description: "Parent contact history", enabled: false },
          { id: "summary_stats", label: "Summary Statistics", description: "Aggregate data and trends", enabled: true },
        ];
      case "complaints":
        return [
          { id: "complaints", label: "All Complaints", description: "Complete complaints register", enabled: true },
          { id: "resolutions", label: "Resolution Details", description: "How complaints were resolved", enabled: true },
          { id: "response_times", label: "Response Times", description: "Time to resolution metrics", enabled: false },
          { id: "complainant_details", label: "Complainant Information", description: "Who submitted complaints", enabled: false },
          { id: "summary_stats", label: "Summary Statistics", description: "Aggregate data and trends", enabled: true },
        ];
      case "safeguarding":
        return [
          { id: "concerns", label: "Safeguarding Concerns", description: "All recorded concerns (anonymized)", enabled: true },
          { id: "actions", label: "Actions Taken", description: "Interventions and follow-ups", enabled: true },
          { id: "risk_assessments", label: "Risk Assessments", description: "Risk level changes over time", enabled: false },
          { id: "agency_involvement", label: "External Agency Contacts", description: "Third-party involvement", enabled: false },
          { id: "summary_stats", label: "Summary Statistics", description: "Aggregate data and trends", enabled: true },
        ];
      default:
        return [
          { id: "all_data", label: "All Data", description: "Complete dataset", enabled: true },
          { id: "summary_stats", label: "Summary Statistics", description: "Aggregate data and trends", enabled: true },
        ];
    }
  };

  const [reportOptions, setReportOptions] = useState<ReportOption[]>(getReportOptions());

  const periodOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
    { value: "mtd", label: "Month to Date" },
    { value: "quarter", label: "This Quarter" },
    { value: "ytd", label: "Year to Date" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const formatOptions = [
    { value: "csv", label: "CSV (Excel Compatible)", icon: FileSpreadsheet },
    { value: "excel", label: "Excel (.xlsx)", icon: FileSpreadsheet },
    { value: "pdf", label: "PDF Report", icon: FileSpreadsheet },
  ];

  const getDateRange = (period: ReportPeriod) => {
    const now = new Date();
    switch (period) {
      case "today":
        return { start: now, end: now };
      case "week":
        return { start: subDays(now, 7), end: now };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "mtd":
        return { start: startOfMonth(now), end: now };
      case "quarter":
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return { start: quarterStart, end: quarterEnd };
      case "ytd":
        return { start: startOfYear(now), end: now };
      case "year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: now, end: now };
    }
  };

  const toggleReportOption = (optionId: string) => {
    setReportOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    const enabledOptions = reportOptions.filter(option => option.enabled);
    const dateRange = getDateRange(reportPeriod);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here we would call the actual report generation API
      console.log("Generating report with:", {
        module: moduleName,
        period: reportPeriod,
        format: reportFormat,
        dateRange,
        options: enabledOptions,
      });
      
      // Simulate download
      const filename = `${moduleName}_report_${format(dateRange.start, "yyyy-MM-dd")}_to_${format(dateRange.end, "yyyy-MM-dd")}.${reportFormat}`;
      alert(`Report "${filename}" would be downloaded now`);
      
    } catch (error) {
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedDateRange = getDateRange(reportPeriod);
  const enabledOptionsCount = reportOptions.filter(option => option.enabled).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Period Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Period</label>
          <Select value={reportPeriod} onValueChange={(value: ReportPeriod) => setReportPeriod(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {format(selectedDateRange.start, "MMM dd, yyyy")} - {format(selectedDateRange.end, "MMM dd, yyyy")}
          </p>
        </div>

        {/* Report Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select value={reportFormat} onValueChange={(value: ReportFormat) => setReportFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Report Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Include in Report</label>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {reportOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <Checkbox
                  id={option.id}
                  checked={option.enabled}
                  onCheckedChange={() => toggleReportOption(option.id)}
                />
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {enabledOptionsCount} option{enabledOptionsCount !== 1 ? 's' : ''} selected
          </div>
          <Button 
            onClick={generateReport} 
            disabled={isGenerating || enabledOptionsCount === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : `Generate ${reportFormat.toUpperCase()}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}