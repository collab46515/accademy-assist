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
import { Plus, Pencil, Trash2, Building2, Phone, Mail, FileText } from 'lucide-react';
import { Contractor, useTransportMasterData } from '@/hooks/useTransportMasterData';
import { useTransportData } from '@/hooks/useTransportData';

export const ContractorsManager = () => {
  const { userSchoolId } = useTransportData();
  const { contractors, loading, addContractor, updateContractor, deleteContractor } = useTransportMasterData(userSchoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [formData, setFormData] = useState({
    contractor_name: '',
    contact_person_name: '',
    contact_phone: '',
    contact_email: '',
    office_address: '',
    gst_number: '',
    pan_number: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc_code: '',
    status: 'active',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      contractor_name: '',
      contact_person_name: '',
      contact_phone: '',
      contact_email: '',
      office_address: '',
      gst_number: '',
      pan_number: '',
      bank_account_name: '',
      bank_account_number: '',
      bank_ifsc_code: '',
      status: 'active',
      notes: '',
    });
    setEditingContractor(null);
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setFormData({
      contractor_name: contractor.contractor_name,
      contact_person_name: contractor.contact_person_name || '',
      contact_phone: contractor.contact_phone || '',
      contact_email: contractor.contact_email || '',
      office_address: contractor.office_address || '',
      gst_number: contractor.gst_number || '',
      pan_number: contractor.pan_number || '',
      bank_account_name: contractor.bank_account_name || '',
      bank_account_number: contractor.bank_account_number || '',
      bank_ifsc_code: contractor.bank_ifsc_code || '',
      status: contractor.status,
      notes: contractor.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId) return;

    try {
      if (editingContractor) {
        await updateContractor(editingContractor.id, formData);
      } else {
        await addContractor({ ...formData, school_id: userSchoolId });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving contractor:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contractor?')) {
      await deleteContractor(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-amber-100 text-amber-800">Suspended</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <Building2 className="h-5 w-5" />
            Transport Contractors
          </CardTitle>
          <CardDescription>
            Manage external transport vendors and their contracts
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContractor ? 'Edit Contractor' : 'Add New Contractor'}
              </DialogTitle>
              <DialogDescription>
                Enter contractor details and contact information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="contractor_name">Contractor Name *</Label>
                  <Input
                    id="contractor_name"
                    value={formData.contractor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractor_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact_person_name">Contact Person</Label>
                  <Input
                    id="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person_name: e.target.value }))}
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="office_address">Office Address</Label>
                  <Textarea
                    id="office_address"
                    value={formData.office_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, office_address: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={formData.gst_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="pan_number">PAN Number</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bank_account_name">Bank Account Name</Label>
                  <Input
                    id="bank_account_name"
                    value={formData.bank_account_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_account_name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bank_account_number">Bank Account Number</Label>
                  <Input
                    id="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bank_ifsc_code">IFSC Code</Label>
                  <Input
                    id="bank_ifsc_code"
                    value={formData.bank_ifsc_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_ifsc_code: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContractor ? 'Update' : 'Add'} Contractor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contractors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No contractors added yet</p>
            <p className="text-sm">Add your first contractor to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tax IDs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{contractor.contractor_name}</p>
                      {contractor.contact_person_name && (
                        <p className="text-sm text-muted-foreground">{contractor.contact_person_name}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contractor.contact_phone && (
                        <p className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {contractor.contact_phone}
                        </p>
                      )}
                      {contractor.contact_email && (
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {contractor.contact_email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {contractor.gst_number && <p>GST: {contractor.gst_number}</p>}
                      {contractor.pan_number && <p>PAN: {contractor.pan_number}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contractor.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(contractor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contractor.id)}>
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
