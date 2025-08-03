import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Filter, X, Calendar as CalendarIcon, Users, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  classes: string[];
  yearGroups: string[];
  feeTypes: string[];
  paymentStatus: string[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  searchTerm: string;
}

const defaultFilters: FilterOptions = {
  dateRange: { from: null, to: null },
  classes: [],
  yearGroups: [],
  feeTypes: [],
  paymentStatus: [],
  amountRange: { min: null, max: null },
  searchTerm: ''
};

export function FiltersModal({ open, onOpenChange, onApplyFilters, currentFilters }: FiltersModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const { toast } = useToast();

  const availableClasses = ['7A', '7B', '8A', '8B', '8C', '9A', '9B', '9C', '10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'];
  const availableYearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];
  const availableFeeTypes = ['Tuition Fee', 'Transport Fee', 'Examination Fee', 'Library Fee', 'ICT Fee', 'Sports Fee', 'Music Lessons'];
  const availableStatuses = ['Paid', 'Partial', 'Pending', 'Overdue'];

  const handleArrayFilter = (category: keyof Pick<FilterOptions, 'classes' | 'yearGroups' | 'feeTypes' | 'paymentStatus'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    toast({
      title: "Filters Applied",
      description: "Dashboard data has been filtered according to your selection.",
    });
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared and data refreshed.",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.classes.length > 0) count++;
    if (filters.yearGroups.length > 0) count++;
    if (filters.feeTypes.length > 0) count++;
    if (filters.paymentStatus.length > 0) count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="default" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Filter your fee management data to focus on specific criteria
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Date Range
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, from: date || null } }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, to: date || null } }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Global Search</Label>
            <Input
              placeholder="Search students, transactions, references..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          {/* Classes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Classes ({filters.classes.length} selected)
            </Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {availableClasses.map(className => (
                <div key={className} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${className}`}
                    checked={filters.classes.includes(className)}
                    onCheckedChange={() => handleArrayFilter('classes', className)}
                  />
                  <Label htmlFor={`class-${className}`} className="text-sm cursor-pointer">
                    {className}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Year Groups */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Year Groups ({filters.yearGroups.length} selected)
            </Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {availableYearGroups.map(yearGroup => (
                <div key={yearGroup} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${yearGroup}`}
                    checked={filters.yearGroups.includes(yearGroup)}
                    onCheckedChange={() => handleArrayFilter('yearGroups', yearGroup)}
                  />
                  <Label htmlFor={`year-${yearGroup}`} className="text-sm cursor-pointer">
                    {yearGroup}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Fee Types ({filters.feeTypes.length} selected)</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {availableFeeTypes.map(feeType => (
                <div key={feeType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fee-${feeType}`}
                    checked={filters.feeTypes.includes(feeType)}
                    onCheckedChange={() => handleArrayFilter('feeTypes', feeType)}
                  />
                  <Label htmlFor={`fee-${feeType}`} className="text-sm cursor-pointer">
                    {feeType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Status ({filters.paymentStatus.length} selected)</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
              {availableStatuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.paymentStatus.includes(status)}
                    onCheckedChange={() => handleArrayFilter('paymentStatus', status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-3 lg:col-span-2">
            <Label className="text-sm font-medium">Amount Range (£)</Label>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters.amountRange.min || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    amountRange: { ...prev.amountRange, min: e.target.value ? Number(e.target.value) : null }
                  }))}
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters.amountRange.max || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    amountRange: { ...prev.amountRange, max: e.target.value ? Number(e.target.value) : null }
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={handleResetFilters}>
            <X className="w-4 h-4 mr-2" />
            Reset All
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}