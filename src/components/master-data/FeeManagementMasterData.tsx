import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { useFeeData } from '@/hooks/useFeeData';
import { usePaymentData } from '@/hooks/usePaymentData';
import { useMasterData } from '@/hooks/useMasterData';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';
import { CreditCard, Plus, Search, Download, Upload, Edit, Trash, Info, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FeeManagementMasterData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { currentSchoolId } = useSchoolFilter();
  
  // Persist dialog and tab state in URL
  const activeTab = searchParams.get('feeTab') || 'fee-heads';
  const dialogOpen = searchParams.get('dialog') === 'open';
  
  const setActiveTab = (tab: string) => {
    setSearchParams(prev => {
      prev.set('feeTab', tab);
      return prev;
    }, { replace: true });
  };
  
  const setDialogOpen = (open: boolean) => {
    setSearchParams(prev => {
      if (open) {
        prev.set('dialog', 'open');
      } else {
        prev.delete('dialog');
        prev.delete('editId'); // Clear edit ID when closing dialog
      }
      return prev;
    }, { replace: true });
  };
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedFeeHeadIds, setSelectedFeeHeadIds] = useState<Set<string>>(new Set());
  const form = useForm();
  const { control } = form;

  // Use real fee data and payment data with current school context
  const { feeHeads, feeStructures, createFeeHead, updateFeeHead, deleteFeeHead, createFeeStructure, updateFeeStructure, deleteFeeStructure, loading } = useFeeData(currentSchoolId);
  const { paymentPlans, discounts, createPaymentPlan, updatePaymentPlan, deletePaymentPlan, createDiscount, updateDiscount, deleteDiscount, loading: paymentLoading } = usePaymentData(currentSchoolId);
  
  // Get classes/year groups from master data
  const { classes, yearGroups } = useMasterData();
  
  // Combine classes and year groups for selection
  const availableClasses = [
    ...yearGroups.map(yg => yg.year_name),
    ...classes.map(c => `${c.year_group} - ${c.class_name}`)
  ];

  // Toggle fee head selection for structures
  const toggleFeeHead = (feeHeadId: string) => {
    const newSet = new Set(selectedFeeHeadIds);
    if (newSet.has(feeHeadId)) {
      newSet.delete(feeHeadId);
    } else {
      newSet.add(feeHeadId);
    }
    setSelectedFeeHeadIds(newSet);
  };

  // Calculate total from selected fee heads
  const calculateTotalFromFeeHeads = () => {
    return feeHeads
      .filter(fh => selectedFeeHeadIds.has(fh.id))
      .reduce((sum, fh) => sum + (fh.amount || 0), 0);
  };

  // Group fee heads by category
  const groupedFeeHeads = feeHeads.reduce((acc, feeHead) => {
    const category = feeHead.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feeHead);
    return acc;
  }, {} as Record<string, typeof feeHeads>);

  useEffect(() => {
    if (editingItem && editingItem.applicable_classes) {
      setSelectedClasses(editingItem.applicable_classes);
    } else {
      setSelectedClasses([]);
    }
    // Reset selected fee heads when dialog opens/closes
    if (!dialogOpen) {
      setSelectedFeeHeadIds(new Set());
    }
  }, [editingItem, dialogOpen]);

  const handleCreate = async (data: any) => {
    console.log('Form data received:', data);
    console.log('Active tab:', activeTab);
    
    if (!currentSchoolId) {
      console.error('No school context available');
      return;
    }
    
    try {
      if (activeTab === 'fee-heads') {
        // Create or update fee head
        const feeHeadData = {
          school_id: currentSchoolId,
          name: data.name,
          description: data.description || '',
          category: data.category || 'General',
          amount: parseFloat(data.default_amount) || 0,
          recurrence: data.recurrence_frequency || 'once',
          applicable_classes: selectedClasses,
          applicable_genders: data.applicable_genders ? data.applicable_genders.split(',').map((g: string) => g.trim()) : [],
          is_active: true
        };
        
        if (editingItem) {
          await updateFeeHead(editingItem.id, feeHeadData);
        } else {
          await createFeeHead(feeHeadData);
        }
        
        setSelectedClasses([]);
      } else if (activeTab === 'structures') {
        // Convert comma-separated string to array for applicable_year_groups
        const yearGroupsData = data.applicable_year_groups 
          ? data.applicable_year_groups.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
          
        // Parse year group amounts if provided
        let yearGroupAmounts: Record<string, number> = {};
        if (data.year_group_amounts) {
          try {
            yearGroupAmounts = JSON.parse(data.year_group_amounts);
          } catch (e) {
            console.error('Error parsing year group amounts:', e);
          }
        }
        
        // Get selected fee heads
        const selectedHeads = feeHeads.filter(fh => selectedFeeHeadIds.has(fh.id));
        const calculatedTotal = selectedHeads.reduce((sum, fh) => sum + (fh.amount || 0), 0);
        const totalAmount = selectedFeeHeadIds.size > 0 ? calculatedTotal : parseFloat(data.total_amount || '0');
          
        console.log('Processed year groups:', yearGroupsData);
        console.log('Selected fee heads:', selectedHeads.length);
          
        if (editingItem) {
          console.log('Updating existing structure:', editingItem.id);
          await updateFeeStructure(editingItem.id, {
            name: data.name,
            description: data.description || '',
            academic_year: data.academic_year || '2024-25',
            term: data.term || 'Full Year',
            fee_heads: selectedHeads,
            total_amount: totalAmount,
            applicable_year_groups: yearGroupsData,
            year_group_amounts: yearGroupAmounts,
            student_type: data.student_type || 'all',
            status: 'active'
          });
        } else {
          console.log('Creating new structure');
          await createFeeStructure({
            school_id: currentSchoolId,
            name: data.name,
            description: data.description || '',
            academic_year: data.academic_year || '2024-25',
            term: data.term || 'Full Year',
            fee_heads: selectedHeads,
            total_amount: totalAmount,
            applicable_year_groups: yearGroupsData,
            year_group_amounts: yearGroupAmounts,
            student_type: data.student_type || 'all',
            status: 'active'
          });
        }
        setSelectedFeeHeadIds(new Set());
      } else if (activeTab === 'payment-plans') {
        console.log('Processing payment plan');
        if (editingItem) {
          console.log('Updating payment plan:', editingItem.id);
          await updatePaymentPlan(editingItem.id, {
            name: data.name,
            description: data.description,
            total_amount: parseFloat(data.total_amount || '0'),
            number_of_installments: parseInt(data.number_of_installments || '1'),
            frequency: data.frequency || 'monthly',
            interest_rate: parseFloat(data.interest_rate || '0'),
            status: 'active'
          });
        } else {
          console.log('Creating payment plan');
          await createPaymentPlan({
            school_id: '2f21656b-0848-40ee-bbec-12e5e8137545',
            name: data.name,
            description: data.description,
            total_amount: parseFloat(data.total_amount || '0'),
            number_of_installments: parseInt(data.number_of_installments || '1'),
            frequency: data.frequency || 'monthly',
            interest_rate: parseFloat(data.interest_rate || '0'),
            status: 'active'
          });
        }
      } else if (activeTab === 'discounts') {
        console.log('Processing discount');
        if (editingItem) {
          console.log('Updating discount:', editingItem.id);
          await updateDiscount(editingItem.id, {
            name: data.name,
            discount_type: data.discount_type || 'percentage',
            value: parseFloat(data.value || '0'),
            status: 'active'
          });
        } else {
          console.log('Creating discount with data:', data);
          const discountData = {
            school_id: '2f21656b-0848-40ee-bbec-12e5e8137545',
            name: data.name,
            discount_type: data.discount_type || 'percentage',
            value: parseFloat(data.value || '0'),
            valid_from: data.validity_start || new Date().toISOString().split('T')[0],
            valid_to: data.validity_end || null,
            status: 'active'
          };
          console.log('Sending to createDiscount:', discountData);
          await createDiscount(discountData);
        }
      }
      setDialogOpen(false);
      form.reset();
      setSelectedClasses([]);
    } catch (error) {
      console.error('Error creating/updating:', error);
    }
  };

  const handleEdit = (item: any, tab: string) => {
    setEditingItem(item);
    setActiveTab(tab);
    setDialogOpen(true);
    if (item.applicable_classes) {
      setSelectedClasses(Array.isArray(item.applicable_classes) ? item.applicable_classes : []);
    }
    
    // Map database fields to form fields for fee heads
    if (tab === 'fee-heads') {
      form.reset({
        ...item,
        default_amount: item.amount,
        recurrence_frequency: item.recurrence,
      });
    } else if (tab === 'structures') {
      // Pre-select fee heads if they exist
      if (item.fee_heads && Array.isArray(item.fee_heads)) {
        const headIds = new Set<string>(item.fee_heads.map((fh: any) => fh.id as string));
        setSelectedFeeHeadIds(headIds);
      }
      form.reset({
        ...item,
        applicable_year_groups: item.applicable_year_groups?.join(', ') || '',
      });
    } else {
      form.reset(item);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Delete called with ID:', id, 'for tab:', activeTab);
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        if (activeTab === 'fee-heads') {
          console.log('Deleting fee head:', id);
          await deleteFeeHead(id);
        } else if (activeTab === 'structures') {
          console.log('Deleting fee structure:', id);
          await deleteFeeStructure(id);
        } else if (activeTab === 'payment-plans') {
          console.log('Deleting payment plan:', id);
          await deletePaymentPlan(id);
        } else if (activeTab === 'discounts') {
          console.log('Deleting discount:', id);
          await deleteDiscount(id);
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Hierarchy Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Data Flow:</strong> Classes/Year Groups defined in <strong>Master Data → Academic Structure</strong> are used here for fee configuration and cascade throughout the system (admissions, fee structures, timetabling, etc.)
          {availableClasses.length === 0 && (
            <span className="block mt-2 text-destructive">
              <strong>Warning:</strong> No classes found in Master Data. Please add Year Groups and Classes first in the Academic Structure tab.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Management Master Data</h2>
          <p className="text-muted-foreground">
            Configure fee structures, payment plans, and financial settings
          </p>
        </div>
        <Button onClick={() => { setEditingItem(null); setSelectedClasses([]); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {[
            { id: 'fee-heads', label: 'Fee Heads', count: feeHeads.length },
            { id: 'structures', label: 'Fee Structures', count: feeStructures.length },
            { id: 'payment-plans', label: 'Payment Plans', count: paymentPlans.length },
            { id: 'discounts', label: 'Discounts & Waivers', count: discounts.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'fee-heads' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Heads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default Amount</TableHead>
                    <TableHead>Applicable Classes</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  )}
                  {!loading && feeHeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No fee heads found. Click "Add New" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && feeHeads
                    .filter(item =>
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((feeHead) => (
                    <TableRow key={feeHead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{feeHead.name}</div>
                          <div className="text-sm text-gray-500">{feeHead.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{feeHead.category}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(feeHead.amount || 0)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {feeHead.applicable_classes && feeHead.applicable_classes.length > 0 ? (
                            feeHead.applicable_classes.slice(0, 3).map((cls: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cls}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">All</span>
                          )}
                          {feeHead.applicable_classes && feeHead.applicable_classes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{feeHead.applicable_classes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feeHead.is_active ? 'default' : 'secondary'}>
                          {feeHead.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feeHead.recurrence === 'termly' || feeHead.recurrence === 'monthly' ? 'default' : 'secondary'}>
                          {feeHead.recurrence || 'Once'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(feeHead, 'fee-heads')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(feeHead.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'structures' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Structures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Applicable Classes</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : feeStructures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No fee structures found. Click "Add New" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    feeStructures
                      .filter(item =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.academic_year.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((structure) => (
                      <TableRow key={structure.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{structure.name}</div>
                            <div className="text-sm text-gray-500">
                              {structure.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{structure.academic_year}</TableCell>
                        <TableCell>{structure.applicable_year_groups?.join(', ') || 'All'}</TableCell>
                        <TableCell>{formatCurrency(structure.total_amount)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(structure, 'structures')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(structure.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment-plans' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Installments</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                   {paymentPlans
                     .filter(item =>
                       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                     )
                     .map((plan) => (
                     <TableRow key={plan.id}>
                       <TableCell>
                         <div>
                           <div className="font-medium">{plan.name}</div>
                           <div className="text-sm text-gray-500">{plan.description}</div>
                         </div>
                       </TableCell>
                       <TableCell>{plan.description}</TableCell>
                       <TableCell>{plan.number_of_installments} ({plan.frequency})</TableCell>
                       <TableCell>{plan.interest_rate || 0}%</TableCell>
                       <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(plan, 'payment-plans')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'discounts' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Discounts & Waivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Applicable Fee Heads</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                 <TableBody>
                   {discounts
                     .filter(item =>
                       item.name.toLowerCase().includes(searchTerm.toLowerCase())
                     )
                     .map((discount) => (
                     <TableRow key={discount.id}>
                       <TableCell>
                         <div>
                           <div className="font-medium">{discount.name}</div>
                           <div className="text-sm text-gray-500">
                             {discount.valid_from} - {discount.valid_to ?? ''}
                           </div>
                         </div>
                       </TableCell>
                       <TableCell>{discount.discount_type}</TableCell>
                       <TableCell>{discount.value}{discount.discount_type === 'percentage' ? '%' : ' ₹'}</TableCell>
                       <TableCell>-</TableCell>
                       <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(discount, 'discounts')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(discount.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {editingItem ? 'Edit' : 'Create'} {
                activeTab === 'structures' ? 'Fee Structure' : 
                activeTab === 'payment-plans' ? 'Payment Plan' : 
                activeTab === 'discounts' ? 'Discount' : 'Fee Head'
              }
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {activeTab === 'structures' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Structure Name *</label>
                    <Input 
                      {...form.register('name', { required: 'Name is required' })} 
                      placeholder="e.g., Year 7 2024-25 Fees" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Academic Year *</label>
                    <Input 
                      {...form.register('academic_year', { required: 'Academic year is required' })} 
                      placeholder="e.g., 2024-25" 
                      defaultValue="2024-25"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input {...form.register('description')} placeholder="Fee structure description" />
                </div>
                
                {/* Fee Head Selection */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Select Fee Heads *
                    </label>
                    <Badge variant="secondary">
                      {selectedFeeHeadIds.size} selected
                    </Badge>
                  </div>
                  
                  {Object.keys(groupedFeeHeads).length === 0 ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No fee heads available. Please create fee heads first in the "Fee Heads" tab.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-3">
                      {Object.entries(groupedFeeHeads).map(([category, heads]) => (
                        <div key={category} className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">{category}</p>
                          <div className="space-y-1 pl-2 border-l-2">
                            {heads.map(feeHead => (
                              <div key={feeHead.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selectedFeeHeadIds.has(feeHead.id)}
                                    onCheckedChange={() => toggleFeeHead(feeHead.id)}
                                  />
                                  <span className="text-sm">{feeHead.name}</span>
                                </div>
                                <span className="text-sm font-medium">₹{feeHead.amount?.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedFeeHeadIds.size > 0 && (
                    <div className="pt-2 border-t flex items-center justify-between text-sm font-medium">
                      <span>Auto-calculated Total:</span>
                      <span className="text-primary text-lg">₹{calculateTotalFromFeeHeads().toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Manual Total Amount (₹)</label>
                    <Input 
                      {...form.register('total_amount')} 
                      type="number" 
                      placeholder="Auto-calculated if fee heads selected" 
                      step="0.01"
                      disabled={selectedFeeHeadIds.size > 0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedFeeHeadIds.size > 0 ? 'Total is auto-calculated from selected fee heads' : 'Enter manually if not selecting fee heads'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Term</label>
                    <Input {...form.register('term')} placeholder="Full Year, Term 1, etc." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Applicable Year Groups/Classes</label>
                  {availableClasses.length > 0 ? (
                    <>
                      <Input 
                        {...form.register('applicable_year_groups')} 
                        placeholder="Leave empty or select from: " 
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {availableClasses.map((className) => (
                          <Badge 
                            key={className}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
                              const current = form.getValues('applicable_year_groups') || '';
                              const classes = current ? current.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
                              if (!classes.includes(className)) {
                                form.setValue('applicable_year_groups', [...classes, className].join(', '));
                              }
                            }}
                          >
                            {className}
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No classes defined. Add Year Groups and Classes in Master Data first.
                      </AlertDescription>
                    </Alert>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Click badges above to add quickly, or type comma-separated values
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Student Type *</label>
                  <Select onValueChange={(value) => form.setValue('student_type', value)} defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select student type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="new">New Students (Admissions)</SelectItem>
                      <SelectItem value="existing">Existing Students (Promotions)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Specify if this fee structure applies to new admissions, existing students being promoted, or all students
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Class-Specific Amounts (Optional)</label>
                  <Textarea 
                    {...form.register('year_group_amounts')} 
                    placeholder='{"Year 7": 100000, "Year 8": 110000, "Year 9": 120000}'
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter JSON format to set different amounts per year group. Leave empty to use the total amount above for all classes.
                  </p>
                </div>
              </>
            ) : activeTab === 'payment-plans' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Plan Name *</label>
                    <Input {...form.register('name', { required: 'Name is required' })} placeholder="Payment plan name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Number of Installments *</label>
                    <Input {...form.register('number_of_installments', { required: 'Installments required' })} type="number" placeholder="1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input {...form.register('description')} placeholder="Payment plan description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Total Amount (₹)</label>
                    <Input {...form.register('total_amount')} type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frequency</label>
                    <Select onValueChange={(value) => form.setValue('frequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="termly">Termly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Interest Rate (%)</label>
                  <Input {...form.register('interest_rate')} type="number" placeholder="0" step="0.1" />
                </div>
              </>
            ) : activeTab === 'discounts' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Discount Name *</label>
                    <Input {...form.register('name', { required: 'Name is required' })} placeholder="Discount name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Discount Type *</label>
                    <Select onValueChange={(value) => form.setValue('discount_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Value *</label>
                  <Input {...form.register('value', { required: 'Value is required' })} type="number" placeholder="0" step="0.01" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Valid From</label>
                    <Input {...form.register('validity_start')} type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valid To</label>
                    <Input {...form.register('validity_end')} type="date" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input {...form.register('name')} placeholder="Fee head name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input {...form.register('category')} placeholder="e.g., Tuition, Transport" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input {...form.register('description')} placeholder="Brief description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Default Amount (₹)</label>
                    <Input 
                      {...form.register('default_amount')} 
                      type="number" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Recurrence Frequency</label>
                    <Input {...form.register('recurrence_frequency')} placeholder="Monthly, Yearly, etc." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Applicable Classes/Year Groups *</label>
                  {availableClasses.length > 0 ? (
                    <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="select-all-classes"
                          checked={selectedClasses.length === availableClasses.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedClasses(availableClasses);
                            } else {
                              setSelectedClasses([]);
                            }
                          }}
                        />
                        <Label htmlFor="select-all-classes" className="font-medium">
                          Select All
                        </Label>
                      </div>
                      {availableClasses.map((className) => (
                        <div key={className} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${className}`}
                            checked={selectedClasses.includes(className)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedClasses([...selectedClasses, className]);
                              } else {
                                setSelectedClasses(selectedClasses.filter(c => c !== className));
                              }
                            }}
                          />
                          <Label htmlFor={`class-${className}`}>
                            {className}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No classes defined yet. Please add Year Groups and Classes in Master Data first.
                      </AlertDescription>
                    </Alert>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to apply to all classes. Selected: {selectedClasses.length > 0 ? selectedClasses.join(', ') : 'All Classes'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Applicable Genders</label>
                  <Input {...form.register('applicable_genders')} placeholder="All, Male, Female" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox {...form.register('is_mandatory')} />
                    <label className="text-sm">Mandatory</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox {...form.register('is_recurring')} />
                    <label className="text-sm">Recurring</label>
                  </div>
                </div>
              </>
            )}
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t flex-shrink-0 mt-4 bg-background relative z-10">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const mockFeeStructures = [
  {
    id: '1',
    structure_name: 'Standard Fee Structure 2024-25',
    academic_year: '2024-25',
    applicable_classes: ['Year 7', 'Year 8', 'Year 9'],
    total_annual_amount: 150000,
    currency: 'INR',
    is_active: true,
    created_date: '2024-01-15',
    last_modified: '2024-01-20'
  },
  {
    id: '2', 
    structure_name: 'Senior Secondary Structure 2024-25',
    academic_year: '2024-25',
    applicable_classes: ['Year 10', 'Year 11'],
    total_annual_amount: 180000,
    currency: 'INR',
    is_active: true,
    created_date: '2024-01-15',
    last_modified: '2024-01-18'
  },
  {
    id: '3',
    structure_name: 'A-Level Structure 2024-25', 
    academic_year: '2024-25',
    applicable_classes: ['Year 12', 'Year 13'],
    total_annual_amount: 220000,
    currency: 'INR',
    is_active: true,
    created_date: '2024-01-15',
    last_modified: '2024-01-22'
  }
];

const mockPaymentPlans = [
  {
    id: '1',
    plan_name: 'Termly Payment Plan',
    description: 'Pay in 3 equal installments per academic year',
    installments: 3,
    frequency: 'termly',
    interest_rate: 0,
    late_fee_amount: 500,
    currency: 'INR',
    is_active: true
  },
  {
    id: '2', 
    plan_name: 'Monthly Payment Plan',
    description: 'Pay in 10 monthly installments (Sep-Jun)',
    installments: 10,
    frequency: 'monthly',
    interest_rate: 2.5,
    late_fee_amount: 200,
    currency: 'INR',
    is_active: true
  },
  {
    id: '3',
    plan_name: 'Annual Payment Plan',
    description: 'Pay full amount upfront with 5% discount',
    installments: 1,
    frequency: 'annually',
    interest_rate: -5,
    late_fee_amount: 0,
    currency: 'INR',
    is_active: true
  }
];

const mockDiscounts = [
  {
    id: '1',
    discount_name: 'Early Bird Discount',
    discount_type: 'percentage',
    discount_value: 5,
    applicable_fee_heads: ['Tuition Fee'],
    validity_start: '2024-01-01',
    validity_end: '2024-03-31',
    max_usage: 100,
    current_usage: 23,
    is_active: true
  },
  {
    id: '2',
    discount_name: 'Sibling Discount', 
    discount_type: 'percentage',
    discount_value: 10,
    applicable_fee_heads: ['Tuition Fee', 'Registration Fee'],
    validity_start: '2024-04-01',
    validity_end: '2025-03-31',
    max_usage: 0,
    current_usage: 15,
    is_active: true
  },
  {
    id: '3',
    discount_name: 'Merit Scholarship',
    discount_type: 'fixed_amount', 
    discount_value: 25000,
    applicable_fee_heads: ['Tuition Fee'],
    validity_start: '2024-04-01',
    validity_end: '2025-03-31',
    max_usage: 10,
    current_usage: 3,
    is_active: true
  }
];
