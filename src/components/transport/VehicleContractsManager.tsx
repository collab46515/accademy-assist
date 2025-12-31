import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, FileText, Calendar, DollarSign, Upload } from 'lucide-react';
import { useTransportMasterData, VehicleContract } from '@/hooks/useTransportMasterData';
import { useTransportData } from '@/hooks/useTransportData';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const VehicleContractsManager = () => {
  const { userSchoolId, vehicles } = useTransportData();
  const { contractors, contracts, loading, refetch } = useTransportMasterData(userSchoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<VehicleContract | null>(null);
  const [formData, setFormData] = useState({
    contractor_id: '',
    vehicle_id: '',
    contract_number: '',
    contract_start_date: '',
    contract_end_date: '',
    payment_type: 'fixed_monthly',
    payment_amount: 0,
    payment_frequency: 'monthly',
    terms_and_conditions: '',
    status: 'active',
  });

  const resetForm = () => {
    setFormData({
      contractor_id: '',
      vehicle_id: '',
      contract_number: '',
      contract_start_date: '',
      contract_end_date: '',
      payment_type: 'fixed_monthly',
      payment_amount: 0,
      payment_frequency: 'monthly',
      terms_and_conditions: '',
      status: 'active',
    });
    setEditingContract(null);
  };

  const handleEdit = (contract: VehicleContract) => {
    setEditingContract(contract);
    setFormData({
      contractor_id: contract.contractor_id,
      vehicle_id: contract.vehicle_id || '',
      contract_number: contract.contract_number || '',
      contract_start_date: contract.contract_start_date,
      contract_end_date: contract.contract_end_date,
      payment_type: contract.payment_type,
      payment_amount: contract.payment_amount,
      payment_frequency: contract.payment_frequency || 'monthly',
      terms_and_conditions: contract.terms_and_conditions || '',
      status: contract.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId) return;

    try {
      const contractData = {
        ...formData,
        school_id: userSchoolId,
        vehicle_id: formData.vehicle_id || null,
      };

      if (editingContract) {
        const { error } = await supabase
          .from('vehicle_contracts')
          .update(contractData)
          .eq('id', editingContract.id);
        if (error) throw error;
        toast.success('Contract updated successfully');
      } else {
        const { error } = await supabase
          .from('vehicle_contracts')
          .insert([contractData]);
        if (error) throw error;
        toast.success('Contract added successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error('Error saving contract:', err);
      toast.error('Failed to save contract');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      try {
        const { error } = await supabase
          .from('vehicle_contracts')
          .delete()
          .eq('id', id);
        if (error) throw error;
        toast.success('Contract deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete contract');
      }
    }
  };

  const getStatusBadge = (contract: VehicleContract) => {
    const today = new Date();
    const endDate = parseISO(contract.contract_end_date);
    const warningDate = addDays(today, 30);

    if (contract.status === 'terminated') {
      return <Badge variant="destructive">Terminated</Badge>;
    }
    if (isBefore(endDate, today)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isBefore(endDate, warningDate)) {
      return <Badge className="bg-amber-100 text-amber-800">Expiring Soon</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed_monthly': return 'Fixed Monthly';
      case 'per_km': return 'Per Kilometer';
      case 'per_trip': return 'Per Trip';
      default: return type;
    }
  };

  const getContractorName = (contractorId: string) => {
    const contractor = contractors.find(c => c.id === contractorId);
    return contractor?.contractor_name || 'Unknown';
  };

  const getVehicleName = (vehicleId?: string) => {
    if (!vehicleId) return 'All Vehicles';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.vehicle_number} (${vehicle.make_model || vehicle.vehicle_type})` : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle Contracts
          </CardTitle>
          <CardDescription>
            Manage contractor vehicle contracts with payment terms and SLA documents
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContract ? 'Edit Contract' : 'Add New Contract'}
              </DialogTitle>
              <DialogDescription>
                Enter contract details including payment terms and validity
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractor_id">Contractor *</Label>
                  <Select
                    value={formData.contractor_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contractor_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractors.map((contractor) => (
                        <SelectItem key={contractor.id} value={contractor.id}>
                          {contractor.contractor_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle_id">Associated Vehicle</Label>
                  <Select
                    value={formData.vehicle_id || 'all'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value === 'all' ? '' : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All vehicles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number} - {vehicle.make_model || vehicle.vehicle_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contract_number">Contract Number</Label>
                  <Input
                    id="contract_number"
                    value={formData.contract_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, contract_number: e.target.value }))}
                    placeholder="CON-2024-001"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contract_start_date">Start Date *</Label>
                  <Input
                    id="contract_start_date"
                    type="date"
                    value={formData.contract_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, contract_start_date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contract_end_date">End Date *</Label>
                  <Input
                    id="contract_end_date"
                    type="date"
                    value={formData.contract_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, contract_end_date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="payment_type">Payment Type *</Label>
                  <Select
                    value={formData.payment_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed_monthly">Fixed Monthly</SelectItem>
                      <SelectItem value="per_km">Per Kilometer</SelectItem>
                      <SelectItem value="per_trip">Per Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_amount">
                    Rate Amount * {formData.payment_type === 'fixed_monthly' ? '(₹/month)' : formData.payment_type === 'per_km' ? '(₹/km)' : '(₹/trip)'}
                  </Label>
                  <Input
                    id="payment_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payment_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_amount: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="payment_frequency">Payment Frequency</Label>
                  <Select
                    value={formData.payment_frequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="terms_and_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_and_conditions"
                    value={formData.terms_and_conditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                    rows={3}
                    placeholder="Enter contract terms and SLA details..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContract ? 'Update' : 'Add'} Contract
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No contracts added yet</p>
            <p className="text-sm">Add your first vehicle contract to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="font-medium">{contract.contract_number || 'N/A'}</div>
                  </TableCell>
                  <TableCell>{getContractorName(contract.contractor_id)}</TableCell>
                  <TableCell>{getVehicleName(contract.vehicle_id)}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(contract.contract_start_date), 'dd MMM yyyy')}
                      </div>
                      <div className="text-muted-foreground">
                        to {format(parseISO(contract.contract_end_date), 'dd MMM yyyy')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ₹{contract.payment_amount.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        {getPaymentTypeLabel(contract.payment_type)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contract)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(contract)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contract.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
