import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Save, DollarSign } from 'lucide-react';
import { useFeeData, FeeHead, FeeStructure } from '@/hooks/useFeeData';
import { useToast } from '@/hooks/use-toast';

const YEAR_GROUPS = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

const TERMS = ['Autumn', 'Spring', 'Summer', 'Annual'];
const ACADEMIC_YEARS = ['2024-25', '2025-26', '2026-27'];
const STUDENT_TYPES = [
  { value: 'new', label: 'New Students' },
  { value: 'existing', label: 'Existing Students' },
  { value: 'all', label: 'All Students' }
];

interface FeeStructureFormProps {
  feeStructure?: FeeStructure;
  onSave: () => void;
  onCancel: () => void;
}

export const FeeStructureForm = ({ feeStructure, onSave, onCancel }: FeeStructureFormProps) => {
  const { feeHeads, createFeeStructure, updateFeeStructure } = useFeeData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: feeStructure?.name || '',
    description: feeStructure?.description || '',
    academic_year: feeStructure?.academic_year || '2024-25',
    term: feeStructure?.term || 'Annual',
    applicable_year_groups: feeStructure?.applicable_year_groups || [] as string[],
    student_type: feeStructure?.student_type || 'all',
    status: feeStructure?.status || 'draft',
    selected_fee_heads: [] as string[], // IDs of selected fee heads
    school_id: feeStructure?.school_id || ''
  });

  const [selectedFeeHeadIds, setSelectedFeeHeadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize selected fee heads from existing structure
    if (feeStructure?.fee_heads) {
      const heads = feeStructure.fee_heads as unknown as FeeHead[];
      const ids = heads.map(h => h.name); // Match by name for now
      setSelectedFeeHeadIds(new Set(ids));
    }
  }, [feeStructure]);

  const toggleFeeHead = (feeHeadId: string) => {
    const newSet = new Set(selectedFeeHeadIds);
    if (newSet.has(feeHeadId)) {
      newSet.delete(feeHeadId);
    } else {
      newSet.add(feeHeadId);
    }
    setSelectedFeeHeadIds(newSet);
  };

  const toggleYearGroup = (yearGroup: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_year_groups: prev.applicable_year_groups.includes(yearGroup)
        ? prev.applicable_year_groups.filter(y => y !== yearGroup)
        : [...prev.applicable_year_groups, yearGroup]
    }));
  };

  const getSelectedFeeHeads = (): FeeHead[] => {
    return feeHeads.filter(fh => selectedFeeHeadIds.has(fh.id));
  };

  const calculateTotal = (): number => {
    return getSelectedFeeHeads().reduce((sum, fh) => sum + (fh.amount || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFeeHeadIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one fee head',
        variant: 'destructive'
      });
      return;
    }

    if (formData.applicable_year_groups.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one year group',
        variant: 'destructive'
      });
      return;
    }

    try {
      const selectedHeads = getSelectedFeeHeads();
      const totalAmount = calculateTotal();

      const structureData = {
        ...formData,
        fee_heads: selectedHeads,
        total_amount: totalAmount,
        school_id: formData.school_id || crypto.randomUUID() // Temp for demo
      };

      if (feeStructure) {
        await updateFeeStructure(feeStructure.id, structureData);
        toast({
          title: 'Success',
          description: 'Fee structure updated successfully'
        });
      } else {
        await createFeeStructure(structureData);
        toast({
          title: 'Success',
          description: 'Fee structure created successfully'
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to save fee structure',
        variant: 'destructive'
      });
    }
  };

  // Group fee heads by category
  const groupedFeeHeads = feeHeads.reduce((acc, feeHead) => {
    const category = feeHead.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feeHead);
    return acc;
  }, {} as Record<string, FeeHead[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Fee Structure Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Year 6 Annual Fees 2025-26"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this fee structure"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Select
                value={formData.academic_year}
                onValueChange={(value) => setFormData(prev => ({ ...prev, academic_year: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term *</Label>
              <Select
                value={formData.term}
                onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERMS.map(term => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_type">Student Type *</Label>
              <Select
                value={formData.student_type}
                onValueChange={(value: 'new' | 'existing' | 'all') => setFormData(prev => ({ ...prev, student_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applicable Year Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Applicable Year Groups *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {YEAR_GROUPS.map(yearGroup => (
              <Badge
                key={yearGroup}
                variant={formData.applicable_year_groups.includes(yearGroup) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleYearGroup(yearGroup)}
              >
                {yearGroup}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Select Fee Heads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Fee Heads *</span>
            <Badge variant="secondary">
              {selectedFeeHeadIds.size} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(groupedFeeHeads).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No fee heads available. Please create fee heads first.</p>
              <p className="text-sm mt-2">Go to Fee Structure Builder tab to create fee heads.</p>
            </div>
          ) : (
            Object.entries(groupedFeeHeads).map(([category, heads]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm">{category}</h4>
                <div className="space-y-2 pl-4 border-l-2">
                  {heads.map(feeHead => (
                    <div key={feeHead.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedFeeHeadIds.has(feeHead.id)}
                          onCheckedChange={() => toggleFeeHead(feeHead.id)}
                        />
                        <div>
                          <p className="font-medium">{feeHead.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {feeHead.recurrence} • {feeHead.applicable_classes?.length > 0 ? feeHead.applicable_classes.join(', ') : 'All classes'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{feeHead.amount.toLocaleString()}</p>
                        {!feeHead.is_active && (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Total Summary */}
      {selectedFeeHeadIds.size > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Structure Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getSelectedFeeHeads().map(fh => (
                <div key={fh.id} className="flex items-center justify-between text-sm">
                  <span>{fh.name}</span>
                  <span>₹{fh.amount.toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total Annual Fees</span>
                <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This amount will be shown to parents during admissions for selected year groups
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {feeStructure ? 'Update' : 'Create'} Fee Structure
        </Button>
      </div>
    </form>
  );
};
