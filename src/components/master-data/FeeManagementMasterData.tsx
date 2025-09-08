import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useFeeData } from '@/hooks/useFeeData';
import { usePaymentData } from '@/hooks/usePaymentData';
import { CreditCard, Plus, Search, Download, Upload, Edit, Trash } from 'lucide-react';

// Mock fee heads data with INR amounts
const mockFeeHeads = [
  {
    name: 'Tuition Fee',
    description: 'Main academic tuition fees',
    category: 'Tuition',
    default_amount: 120000, // ₹1,20,000 (equivalent to £1500)
    currency: 'INR',
    is_mandatory: true,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Registration Fee',
    description: 'One-time registration and admission processing',
    category: 'Registration',
    default_amount: 20000, // ₹20,000
    currency: 'INR',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Transport Fee',
    description: 'School bus and transport services',
    category: 'Transport',
    default_amount: 12000, // ₹12,000 (equivalent to £150)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Meal Fee',
    description: 'Lunch and snack services',
    category: 'Meals',
    default_amount: 16000, // ₹16,000 (equivalent to £200)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Examination Fee',
    description: 'External and internal examination fees',
    category: 'Examination',
    default_amount: 8000, // ₹8,000 (equivalent to £100)
    currency: 'INR',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: ['Year 10', 'Year 11', 'Year 12', 'Year 13'],
    applicable_genders: []
  },
  {
    name: 'ICT Fee',
    description: 'Information and Communication Technology resources',
    category: 'ICT',
    default_amount: 6000, // ₹6,000 (equivalent to £75)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'annually',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Laboratory Fee',
    description: 'Science laboratory usage and materials',
    category: 'Laboratory',
    default_amount: 9600, // ₹9,600 (equivalent to £120)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'],
    applicable_genders: []
  },
  {
    name: 'Library Fee',
    description: 'Library resources and book replacement',
    category: 'Library',
    default_amount: 2400, // ₹2,400 (equivalent to £30)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'annually',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Sports Fee',
    description: 'Sports equipment and activities',
    category: 'Sports',
    default_amount: 6400, // ₹6,400 (equivalent to £80)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Music Lessons',
    description: 'Individual music lessons and instrument hire',
    category: 'Music Lessons',
    default_amount: 16000, // ₹16,000 (equivalent to £200)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Boarding Fee',
    description: 'Accommodation and boarding services',
    category: 'Boarding',
    default_amount: 200000, // ₹2,00,000 (equivalent to £2500)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Uniform Fee',
    description: 'School uniform and PE kit',
    category: 'Uniform',
    default_amount: 12000, // ₹12,000 (equivalent to £150)
    currency: 'INR',
    is_mandatory: true,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Activity Fee',
    description: 'Extracurricular activities and clubs',
    category: 'Activity Fees',
    default_amount: 4800, // ₹4,800 (equivalent to £60)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: true,
    recurrence_frequency: 'termly',
    applicable_classes: [],
    applicable_genders: []
  },
  {
    name: 'Excursion Fee',
    description: 'Educational trips and excursions',
    category: 'Excursions',
    default_amount: 8000, // ₹8,000 (equivalent to £100)
    currency: 'INR',
    is_mandatory: false,
    is_recurring: false,
    recurrence_frequency: '',
    applicable_classes: [],
    applicable_genders: []
  }
];

export function FeeManagementMasterData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('fee-heads');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const form = useForm();

  // Use real fee data and payment data
  const { feeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, loading } = useFeeData();
  const { paymentPlans, discounts, createPaymentPlan, updatePaymentPlan, deletePaymentPlan, createDiscount, updateDiscount, deleteDiscount, loading: paymentLoading } = usePaymentData('2f21656b-0848-40ee-bbec-12e5e8137545');

  const handleCreate = async (data: any) => {
    console.log('Form data received:', data);
    console.log('Active tab:', activeTab);
    try {
      if (activeTab === 'structures') {
        // Convert comma-separated string to array for applicable_year_groups
        const yearGroups = data.applicable_year_groups 
          ? data.applicable_year_groups.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
          
        console.log('Processed year groups:', yearGroups);
          
        if (editingItem) {
          console.log('Updating existing structure:', editingItem.id);
          await updateFeeStructure(editingItem.id, {
            name: data.name,
            description: data.description || '',
            academic_year: data.academic_year || '2024-25', // Add fallback
            term: data.term || 'Full Year',
            fee_heads: data.fee_heads || [],
            total_amount: parseFloat(data.total_amount || '0'),
            applicable_year_groups: yearGroups,
            status: 'active'
          });
        } else {
          console.log('Creating new structure');
          await createFeeStructure({
            school_id: data.school_id || '2f21656b-0848-40ee-bbec-12e5e8137545', // Default school
            name: data.name,
            description: data.description || '',
            academic_year: data.academic_year || '2024-25', // Add fallback
            term: data.term || 'Full Year',
            fee_heads: data.fee_heads || [],
            total_amount: parseFloat(data.total_amount || '0'),
            applicable_year_groups: yearGroups,
            status: 'active'
          });
        }
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
    } catch (error) {
      console.error('Error creating/updating:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
    form.reset(item);
  };

  const handleDelete = async (id: string) => {
    console.log('Delete called with ID:', id, 'for tab:', activeTab);
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        if (activeTab === 'structures') {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Management Master Data</h2>
          <p className="text-muted-foreground">Configure fee structures, payment plans, and financial settings</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
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
            { id: 'fee-heads', label: 'Fee Heads', count: mockFeeHeads.length },
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
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeeHeads
                    .filter(item =>
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((feeHead, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{feeHead.name}</div>
                          <div className="text-sm text-gray-500">{feeHead.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{feeHead.category}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(feeHead.default_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={feeHead.is_mandatory ? 'default' : 'secondary'}>
                          {feeHead.is_mandatory ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feeHead.is_recurring ? 'default' : 'secondary'}>
                          {feeHead.is_recurring ? feeHead.recurrence_frequency : 'One-time'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(feeHead)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(feeHead.name)}>
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
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(structure)}>
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
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
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
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(discount)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Create'} {
                activeTab === 'structures' ? 'Fee Structure' : 
                activeTab === 'payment-plans' ? 'Payment Plan' : 
                activeTab === 'discounts' ? 'Discount' : 'Fee Head'
              }
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Total Amount (₹) *</label>
                    <Input 
                      {...form.register('total_amount', { required: 'Total amount is required' })} 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Term</label>
                    <Input {...form.register('term')} placeholder="Full Year, Term 1, etc." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Applicable Year Groups</label>
                  <Input 
                    {...form.register('applicable_year_groups')} 
                    placeholder="Year 7, Year 8 (comma-separated)" 
                  />
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
                  <label className="text-sm font-medium">Applicable Classes</label>
                  <Input {...form.register('applicable_classes')} placeholder="All, 1-5, 6-10, etc." />
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
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
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
