import React, { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, FileCheck, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { VehicleComplianceDoc, useTransportMasterData } from '@/hooks/useTransportMasterData';
import { useTransportData, Vehicle } from '@/hooks/useTransportData';
import { format, differenceInDays, isPast, isFuture, addDays } from 'date-fns';

interface VehicleComplianceManagerProps {
  vehicle?: Vehicle;
}

const DOCUMENT_TYPES = [
  { value: 'rc', label: 'Registration Certificate (RC)' },
  { value: 'fc', label: 'Fitness Certificate (FC)' },
  { value: 'insurance', label: 'Insurance Policy' },
  { value: 'poc', label: 'Pollution Certificate (PUC)' },
  { value: 'permit', label: 'Permit' },
  { value: 'tax_token', label: 'Road Tax Token' },
  { value: 'other', label: 'Other' },
];

export const VehicleComplianceManager: React.FC<VehicleComplianceManagerProps> = ({ vehicle }) => {
  const { userSchoolId, vehicles } = useTransportData();
  const { complianceDocs, loading, fetchComplianceDocs, addComplianceDoc, updateComplianceDoc, deleteComplianceDoc } = useTransportMasterData(userSchoolId);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicle?.id || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VehicleComplianceDoc | null>(null);
  const [formData, setFormData] = useState({
    document_type: 'rc',
    document_number: '',
    issue_date: '',
    expiry_date: '',
    issuing_authority: '',
    insurance_provider: '',
    insurance_policy_number: '',
    insurance_premium: '',
    permit_type: '',
    document_url: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedVehicle) {
      fetchComplianceDocs(selectedVehicle);
    }
  }, [selectedVehicle]);

  const resetForm = () => {
    setFormData({
      document_type: 'rc',
      document_number: '',
      issue_date: '',
      expiry_date: '',
      issuing_authority: '',
      insurance_provider: '',
      insurance_policy_number: '',
      insurance_premium: '',
      permit_type: '',
      document_url: '',
      notes: '',
    });
    setEditingDoc(null);
  };

  const handleEdit = (doc: VehicleComplianceDoc) => {
    setEditingDoc(doc);
    setFormData({
      document_type: doc.document_type,
      document_number: doc.document_number || '',
      issue_date: doc.issue_date || '',
      expiry_date: doc.expiry_date || '',
      issuing_authority: doc.issuing_authority || '',
      insurance_provider: doc.insurance_provider || '',
      insurance_policy_number: doc.insurance_policy_number || '',
      insurance_premium: doc.insurance_premium?.toString() || '',
      permit_type: doc.permit_type || '',
      document_url: doc.document_url || '',
      notes: doc.notes || '',
    });
    setIsDialogOpen(true);
  };

  const getExpiryStatus = (expiryDate: string | undefined) => {
    if (!expiryDate) return { status: 'unknown', label: 'No expiry', color: 'secondary' };
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = differenceInDays(expiry, today);

    if (isPast(expiry)) {
      return { status: 'expired', label: 'Expired', color: 'destructive', days: Math.abs(daysUntilExpiry) };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring_soon', label: 'Expiring Soon', color: 'warning', days: daysUntilExpiry };
    } else {
      return { status: 'valid', label: 'Valid', color: 'success', days: daysUntilExpiry };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const expiryStatus = getExpiryStatus(formData.expiry_date);

    try {
      const docData = {
        vehicle_id: selectedVehicle,
        document_type: formData.document_type,
        document_number: formData.document_number || null,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null,
        issuing_authority: formData.issuing_authority || null,
        insurance_provider: formData.document_type === 'insurance' ? formData.insurance_provider : null,
        insurance_policy_number: formData.document_type === 'insurance' ? formData.insurance_policy_number : null,
        insurance_premium: formData.document_type === 'insurance' && formData.insurance_premium ? parseFloat(formData.insurance_premium) : null,
        permit_type: formData.document_type === 'permit' ? formData.permit_type : null,
        document_url: formData.document_url || null,
        notes: formData.notes || null,
        status: expiryStatus.status,
        reminder_sent: false,
      };

      if (editingDoc) {
        await updateComplianceDoc(editingDoc.id, docData);
      } else {
        await addComplianceDoc(docData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteComplianceDoc(id);
    }
  };

  const getDocumentLabel = (type: string) => {
    return DOCUMENT_TYPES.find(d => d.value === type)?.label || type;
  };

  const renderExpiryBadge = (doc: VehicleComplianceDoc) => {
    const status = getExpiryStatus(doc.expiry_date);
    
    if (status.status === 'expired') {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired {status.days}d ago
        </Badge>
      );
    } else if (status.status === 'expiring_soon') {
      return (
        <Badge className="bg-amber-100 text-amber-800 gap-1">
          <Clock className="h-3 w-3" />
          {status.days}d left
        </Badge>
      );
    } else if (status.status === 'valid') {
      return (
        <Badge className="bg-green-100 text-green-800 gap-1">
          <CheckCircle className="h-3 w-3" />
          Valid
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  if (loading && selectedVehicle) {
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
            <FileCheck className="h-5 w-5" />
            Vehicle Compliance Documents
          </CardTitle>
          <CardDescription>
            Track RC, FC, Insurance, Permits and other compliance documents
          </CardDescription>
        </div>
        {selectedVehicle && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDoc ? 'Edit Document' : 'Add Compliance Document'}
                </DialogTitle>
                <DialogDescription>
                  Add or update vehicle compliance documentation
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="document_type">Document Type *</Label>
                    <Select
                      value={formData.document_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="document_number">Document Number</Label>
                    <Input
                      id="document_number"
                      value={formData.document_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry_date">Expiry Date *</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="issuing_authority">Issuing Authority</Label>
                    <Input
                      id="issuing_authority"
                      value={formData.issuing_authority}
                      onChange={(e) => setFormData(prev => ({ ...prev, issuing_authority: e.target.value }))}
                    />
                  </div>

                  {formData.document_type === 'insurance' && (
                    <>
                      <div>
                        <Label htmlFor="insurance_provider">Insurance Provider</Label>
                        <Input
                          id="insurance_provider"
                          value={formData.insurance_provider}
                          onChange={(e) => setFormData(prev => ({ ...prev, insurance_provider: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurance_policy_number">Policy Number</Label>
                        <Input
                          id="insurance_policy_number"
                          value={formData.insurance_policy_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, insurance_policy_number: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurance_premium">Premium Amount</Label>
                        <Input
                          id="insurance_premium"
                          type="number"
                          value={formData.insurance_premium}
                          onChange={(e) => setFormData(prev => ({ ...prev, insurance_premium: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {formData.document_type === 'permit' && (
                    <div>
                      <Label htmlFor="permit_type">Permit Type</Label>
                      <Select
                        value={formData.permit_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, permit_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select permit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="state">State Permit</SelectItem>
                          <SelectItem value="national">National Permit</SelectItem>
                          <SelectItem value="contract_carriage">Contract Carriage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="col-span-2">
                    <Label htmlFor="document_url">Document URL</Label>
                    <Input
                      id="document_url"
                      type="url"
                      value={formData.document_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, document_url: e.target.value }))}
                      placeholder="Link to uploaded document"
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
                    {editingDoc ? 'Update' : 'Add'} Document
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {!vehicle && (
          <div className="mb-6">
            <Label htmlFor="vehicle_select">Select Vehicle</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Choose a vehicle to view documents" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.vehicle_number} - {v.make_model || v.vehicle_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!selectedVehicle ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a vehicle to view compliance documents</p>
          </div>
        ) : complianceDocs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No compliance documents added for this vehicle</p>
            <p className="text-sm">Add RC, FC, Insurance and other documents</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="font-medium">{getDocumentLabel(doc.document_type)}</div>
                    {doc.issuing_authority && (
                      <p className="text-sm text-muted-foreground">{doc.issuing_authority}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {doc.document_number && <p>{doc.document_number}</p>}
                      {doc.insurance_policy_number && (
                        <p className="text-sm text-muted-foreground">Policy: {doc.insurance_policy_number}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.expiry_date ? format(new Date(doc.expiry_date), 'dd MMM yyyy') : '-'}
                  </TableCell>
                  <TableCell>{renderExpiryBadge(doc)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {doc.document_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
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
