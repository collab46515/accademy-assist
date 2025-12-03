import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, Settings } from 'lucide-react';
import { useFeeData, FeeHead } from '@/hooks/useFeeData';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';

const FEE_CATEGORIES = [
  'Tuition',
  'Registration',
  'Examination',
  'Transport',
  'Meals',
  'Boarding',
  'ICT',
  'Uniform',
  'Excursions',
  'Music Lessons',
  'Laboratory',
  'Library',
  'Sports',
  'Activity Fees',
  'Miscellaneous'
];

const RECURRENCE_OPTIONS = [
  { value: 'termly', label: 'Termly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
  { value: 'weekly', label: 'Weekly' }
];

const CLASS_GROUPS = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

interface FeeHeadFormProps {
  feeHead?: FeeHead;
  onSave: (feeHead: Omit<FeeHead, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const FeeHeadForm = ({ feeHead, onSave, onCancel }: FeeHeadFormProps) => {
  const [formData, setFormData] = useState({
    name: feeHead?.name || '',
    description: feeHead?.description || '',
    category: feeHead?.category || '',
    amount: feeHead?.amount || 0,
    recurrence: feeHead?.recurrence || 'monthly',
    applicable_classes: feeHead?.applicable_classes || [],
    applicable_genders: feeHead?.applicable_genders || [],
    is_active: feeHead?.is_active !== false,
    school_id: feeHead?.school_id || '' // We'll set this properly later
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_classes: prev.applicable_classes.includes(className)
        ? prev.applicable_classes.filter(c => c !== className)
        : [...prev.applicable_classes, className]
    }));
  };

  const toggleGender = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_genders: prev.applicable_genders.includes(gender)
        ? prev.applicable_genders.filter(g => g !== gender)
        : [...prev.applicable_genders, gender]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Fee Head Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Tuition Fee"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {FEE_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this fee"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recurrence">Recurrence</Label>
          <Select
            value={formData.recurrence}
            onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECURRENCE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="active">Active Fee</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Applicable Classes (Leave empty for all classes)</Label>
        <div className="flex flex-wrap gap-2">
          {CLASS_GROUPS.map(className => (
            <Badge
              key={className}
              variant={formData.applicable_classes.includes(className) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleClass(className)}
            >
              {className}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Applicable Genders (Leave empty for all genders)</Label>
        <div className="flex gap-2">
          {['Male', 'Female'].map(gender => (
            <Badge
              key={gender}
              variant={formData.applicable_genders.includes(gender) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleGender(gender)}
            >
              {gender}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {feeHead ? 'Update' : 'Create'} Fee Head
        </Button>
      </div>
    </form>
  );
};

export const FeeStructureBuilder = () => {
  const { currentSchoolId } = useSchoolFilter();
  const { feeHeads, loading, createFeeHead, updateFeeHead, deleteFeeHead } = useFeeData(currentSchoolId);
  const [showForm, setShowForm] = useState(false);
  const [editingFeeHead, setEditingFeeHead] = useState<FeeHead | undefined>();

  const handleSave = async (feeHeadData: Omit<FeeHead, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentSchoolId) {
      console.error('No school context available');
      return;
    }
    
    try {
      const dataWithSchool = { ...feeHeadData, school_id: currentSchoolId };
      
      if (editingFeeHead) {
        await updateFeeHead(editingFeeHead.id, dataWithSchool);
      } else {
        await createFeeHead(dataWithSchool);
      }
      setShowForm(false);
      setEditingFeeHead(undefined);
    } catch (error) {
      console.error('Error saving fee head:', error);
    }
  };

  const handleEdit = (feeHead: FeeHead) => {
    setEditingFeeHead(feeHead);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee head?')) {
      await deleteFeeHead(id);
    }
  };

  const groupedFeeHeads = feeHeads.reduce((acc, feeHead) => {
    const category = feeHead.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feeHead);
    return acc;
  }, {} as Record<string, FeeHead[]>);

  if (loading) {
    return <div className="p-6">Loading fee structure data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Structure Builder</h2>
          <p className="text-muted-foreground">Create and manage fee heads and structures</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFeeHead(undefined)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Head
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFeeHead ? 'Edit Fee Head' : 'Create New Fee Head'}
              </DialogTitle>
            </DialogHeader>
            <FeeHeadForm
              feeHead={editingFeeHead}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(groupedFeeHeads).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Fee Heads Created Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating fee heads like Tuition, Transport, Meals, etc.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Fee Head
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeeHeads).map(([category, feeHeads]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {category}
                  <Badge variant="secondary">{feeHeads.length} fee{feeHeads.length !== 1 ? 's' : ''}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feeHeads.map((feeHead) => (
                    <Card key={feeHead.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{feeHead.name}</h4>
                            {feeHead.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {feeHead.description}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(feeHead)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(feeHead.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-medium">
                              £{feeHead.amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {feeHead.is_active && (
                              <Badge variant="secondary" className="text-xs">Active</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {feeHead.recurrence}
                            </Badge>
                          </div>
                          
                          {feeHead.applicable_classes && feeHead.applicable_classes.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Classes: {feeHead.applicable_classes.join(', ')}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};