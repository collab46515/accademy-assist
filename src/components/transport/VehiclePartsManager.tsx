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
import { Plus, Pencil, Trash2, Wrench, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { VehiclePart, useTransportMasterData } from '@/hooks/useTransportMasterData';
import { useTransportData, Vehicle } from '@/hooks/useTransportData';
import { format, differenceInDays, isPast, addMonths } from 'date-fns';

interface VehiclePartsManagerProps {
  vehicle?: Vehicle;
}

const PART_CATEGORIES = [
  { value: 'engine', label: 'Engine' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'brake', label: 'Brakes' },
  { value: 'tire', label: 'Tires' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'cooling', label: 'Cooling System' },
  { value: 'exhaust', label: 'Exhaust' },
  { value: 'body', label: 'Body Parts' },
  { value: 'safety', label: 'Safety Equipment' },
  { value: 'other', label: 'Other' },
];

export const VehiclePartsManager: React.FC<VehiclePartsManagerProps> = ({ vehicle }) => {
  const { userSchoolId, vehicles } = useTransportData();
  const { parts, loading, fetchParts, addPart, updatePart, deletePart } = useTransportMasterData(userSchoolId);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicle?.id || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<VehiclePart | null>(null);
  const [formData, setFormData] = useState({
    part_name: '',
    part_serial_number: '',
    manufacturer: '',
    part_category: 'other',
    installation_date: '',
    installation_odometer: '',
    warranty_type: 'none',
    warranty_months: '',
    warranty_kms: '',
    standard_lifetime_months: '',
    standard_lifetime_kms: '',
    replacement_cost: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedVehicle) {
      fetchParts(selectedVehicle);
    }
  }, [selectedVehicle]);

  const resetForm = () => {
    setFormData({
      part_name: '',
      part_serial_number: '',
      manufacturer: '',
      part_category: 'other',
      installation_date: '',
      installation_odometer: '',
      warranty_type: 'none',
      warranty_months: '',
      warranty_kms: '',
      standard_lifetime_months: '',
      standard_lifetime_kms: '',
      replacement_cost: '',
      notes: '',
    });
    setEditingPart(null);
  };

  const handleEdit = (part: VehiclePart) => {
    setEditingPart(part);
    setFormData({
      part_name: part.part_name,
      part_serial_number: part.part_serial_number || '',
      manufacturer: part.manufacturer || '',
      part_category: part.part_category || 'other',
      installation_date: part.installation_date,
      installation_odometer: part.installation_odometer?.toString() || '',
      warranty_type: part.warranty_type || 'none',
      warranty_months: part.warranty_months?.toString() || '',
      warranty_kms: part.warranty_kms?.toString() || '',
      standard_lifetime_months: part.standard_lifetime_months?.toString() || '',
      standard_lifetime_kms: part.standard_lifetime_kms?.toString() || '',
      replacement_cost: part.replacement_cost?.toString() || '',
      notes: part.notes || '',
    });
    setIsDialogOpen(true);
  };

  const calculateWarrantyExpiry = (installDate: string, months: number) => {
    return format(addMonths(new Date(installDate), months), 'yyyy-MM-dd');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    try {
      const warrantyExpiry = formData.warranty_type !== 'none' && formData.installation_date && formData.warranty_months
        ? calculateWarrantyExpiry(formData.installation_date, parseInt(formData.warranty_months))
        : null;

      const expectedReplacement = formData.installation_date && formData.standard_lifetime_months
        ? calculateWarrantyExpiry(formData.installation_date, parseInt(formData.standard_lifetime_months))
        : null;

      const partData = {
        vehicle_id: selectedVehicle,
        part_name: formData.part_name,
        part_serial_number: formData.part_serial_number || null,
        manufacturer: formData.manufacturer || null,
        part_category: formData.part_category,
        installation_date: formData.installation_date,
        installation_odometer: formData.installation_odometer ? parseInt(formData.installation_odometer) : null,
        warranty_type: formData.warranty_type,
        warranty_months: formData.warranty_months ? parseInt(formData.warranty_months) : null,
        warranty_kms: formData.warranty_kms ? parseInt(formData.warranty_kms) : null,
        warranty_expiry_date: warrantyExpiry,
        standard_lifetime_months: formData.standard_lifetime_months ? parseInt(formData.standard_lifetime_months) : null,
        standard_lifetime_kms: formData.standard_lifetime_kms ? parseInt(formData.standard_lifetime_kms) : null,
        expected_replacement_date: expectedReplacement,
        replacement_cost: formData.replacement_cost ? parseFloat(formData.replacement_cost) : null,
        notes: formData.notes || null,
        status: 'active',
      };

      if (editingPart) {
        await updatePart(editingPart.id, partData);
      } else {
        await addPart(partData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving part:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this part record?')) {
      await deletePart(id);
    }
  };

  const getWarrantyStatus = (part: VehiclePart) => {
    if (part.warranty_type === 'none' || !part.warranty_expiry_date) {
      return { status: 'no_warranty', label: 'No Warranty' };
    }

    const expiry = new Date(part.warranty_expiry_date);
    const daysLeft = differenceInDays(expiry, new Date());

    if (isPast(expiry)) {
      return { status: 'expired', label: 'Warranty Expired', daysLeft: Math.abs(daysLeft) };
    } else if (daysLeft <= 30) {
      return { status: 'expiring', label: 'Expiring Soon', daysLeft };
    } else {
      return { status: 'active', label: 'Under Warranty', daysLeft };
    }
  };

  const renderWarrantyBadge = (part: VehiclePart) => {
    const status = getWarrantyStatus(part);
    
    if (status.status === 'no_warranty') {
      return <Badge variant="outline">No Warranty</Badge>;
    } else if (status.status === 'expired') {
      return <Badge variant="secondary">Warranty Expired</Badge>;
    } else if (status.status === 'expiring') {
      return (
        <Badge className="bg-amber-100 text-amber-800 gap-1">
          <AlertTriangle className="h-3 w-3" />
          {status.daysLeft}d left
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 gap-1">
          <Shield className="h-3 w-3" />
          {status.daysLeft}d warranty
        </Badge>
      );
    }
  };

  const getCategoryLabel = (category: string) => {
    return PART_CATEGORIES.find(c => c.value === category)?.label || category;
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
            <Wrench className="h-5 w-5" />
            Vehicle Parts & Warranty
          </CardTitle>
          <CardDescription>
            Track parts, warranty periods, and expected replacements
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
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPart ? 'Edit Part' : 'Add Vehicle Part'}
                </DialogTitle>
                <DialogDescription>
                  Record part installation and warranty information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="part_name">Part Name *</Label>
                    <Input
                      id="part_name"
                      value={formData.part_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, part_name: e.target.value }))}
                      placeholder="e.g., Battery, Tire, Brake Pad"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="part_category">Category</Label>
                    <Select
                      value={formData.part_category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, part_category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PART_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="part_serial_number">Serial Number</Label>
                    <Input
                      id="part_serial_number"
                      value={formData.part_serial_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, part_serial_number: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="installation_date">Installation Date *</Label>
                    <Input
                      id="installation_date"
                      type="date"
                      value={formData.installation_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="installation_odometer">Odometer at Installation (km)</Label>
                    <Input
                      id="installation_odometer"
                      type="number"
                      value={formData.installation_odometer}
                      onChange={(e) => setFormData(prev => ({ ...prev, installation_odometer: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="warranty_type">Warranty Type</Label>
                    <Select
                      value={formData.warranty_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, warranty_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Warranty</SelectItem>
                        <SelectItem value="time_based">Time-based (Months)</SelectItem>
                        <SelectItem value="usage_based">Usage-based (Kms)</SelectItem>
                        <SelectItem value="both">Both (Time & Usage)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.warranty_type === 'time_based' || formData.warranty_type === 'both') && (
                    <div>
                      <Label htmlFor="warranty_months">Warranty Period (Months)</Label>
                      <Input
                        id="warranty_months"
                        type="number"
                        value={formData.warranty_months}
                        onChange={(e) => setFormData(prev => ({ ...prev, warranty_months: e.target.value }))}
                      />
                    </div>
                  )}

                  {(formData.warranty_type === 'usage_based' || formData.warranty_type === 'both') && (
                    <div>
                      <Label htmlFor="warranty_kms">Warranty (Kms)</Label>
                      <Input
                        id="warranty_kms"
                        type="number"
                        value={formData.warranty_kms}
                        onChange={(e) => setFormData(prev => ({ ...prev, warranty_kms: e.target.value }))}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="standard_lifetime_months">Standard Lifetime (Months)</Label>
                    <Input
                      id="standard_lifetime_months"
                      type="number"
                      value={formData.standard_lifetime_months}
                      onChange={(e) => setFormData(prev => ({ ...prev, standard_lifetime_months: e.target.value }))}
                      placeholder="Expected lifespan"
                    />
                  </div>

                  <div>
                    <Label htmlFor="replacement_cost">Replacement Cost (₹)</Label>
                    <Input
                      id="replacement_cost"
                      type="number"
                      value={formData.replacement_cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, replacement_cost: e.target.value }))}
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
                    {editingPart ? 'Update' : 'Add'} Part
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
                <SelectValue placeholder="Choose a vehicle to view parts" />
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
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a vehicle to view parts and warranty</p>
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No parts recorded for this vehicle</p>
            <p className="text-sm">Add parts to track warranty and replacements</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Installed</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{part.part_name}</p>
                      {part.manufacturer && (
                        <p className="text-sm text-muted-foreground">{part.manufacturer}</p>
                      )}
                      {part.part_serial_number && (
                        <p className="text-xs text-muted-foreground">S/N: {part.part_serial_number}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(part.part_category || 'other')}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{format(new Date(part.installation_date), 'dd MMM yyyy')}</p>
                      {part.installation_odometer && (
                        <p className="text-sm text-muted-foreground">{part.installation_odometer.toLocaleString()} km</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{renderWarrantyBadge(part)}</TableCell>
                  <TableCell>
                    <Badge variant={part.status === 'active' ? 'default' : 'secondary'}>
                      {part.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(part)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)}>
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
