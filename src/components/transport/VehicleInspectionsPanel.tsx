import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car, Plus, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';
import { format } from 'date-fns';

export const VehicleInspectionsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const { data: inspections, isLoading } = useVehicleInspections();
  const { data: vehicles } = useVehicles();
  const createInspection = useCreateInspection();
  const updateInspection = useUpdateInspection();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    inspection_type: 'daily',
    inspection_date: new Date().toISOString().slice(0, 10),
    next_inspection_date: '',
    inspector_name: '',
    inspector_type: 'internal',
    overall_result: 'pass',
    odometer_reading: '',
    defects_found: '',
    repairs_required: '',
    estimated_repair_cost: '',
    certificate_number: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      odometer_reading: formData.odometer_reading ? parseInt(formData.odometer_reading) : null,
      estimated_repair_cost: formData.estimated_repair_cost ? parseFloat(formData.estimated_repair_cost) : null,
      next_inspection_date: formData.next_inspection_date || null,
      defects_found: formData.defects_found ? formData.defects_found.split(',').map(s => s.trim()) : null,
      repairs_required: formData.repairs_required ? formData.repairs_required.split(',').map(s => s.trim()) : null,
    };
    
    await createInspection.mutateAsync(payload);
    setIsOpen(false);
    setFormData({
      vehicle_id: '',
      inspection_type: 'daily',
      inspection_date: new Date().toISOString().slice(0, 10),
      next_inspection_date: '',
      inspector_name: '',
      inspector_type: 'internal',
      overall_result: 'pass',
      odometer_reading: '',
      defects_found: '',
      repairs_required: '',
      estimated_repair_cost: '',
      certificate_number: '',
      notes: '',
    });
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'pass': return <Badge className="bg-green-500">Pass</Badge>;
      case 'fail': return <Badge className="bg-red-500">Fail</Badge>;
      case 'conditional': return <Badge className="bg-yellow-500">Conditional</Badge>;
      default: return <Badge variant="outline">{result}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'monthly': return 'bg-green-500';
      case 'annual': return 'bg-orange-500';
      case 'roadworthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    total: inspections?.length || 0,
    passed: inspections?.filter((i: any) => i.overall_result === 'pass').length || 0,
    failed: inspections?.filter((i: any) => i.overall_result === 'fail').length || 0,
    pending: inspections?.filter((i: any) => !i.repairs_completed && i.overall_result !== 'pass').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Inspections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.passed}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Repairs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vehicle Inspections</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Record Inspection</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record Vehicle Inspection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle *</Label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({ ...formData, vehicle_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                      <SelectContent>
                        {vehicles?.map((v: any) => (
                          <SelectItem key={v.id} value={v.id}>{v.registration_number} - {v.make} {v.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Inspection Type *</Label>
                    <Select value={formData.inspection_type} onValueChange={(v) => setFormData({ ...formData, inspection_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="roadworthy">Roadworthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Inspection Date *</Label>
                    <Input
                      type="date"
                      value={formData.inspection_date}
                      onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Next Inspection Date</Label>
                    <Input
                      type="date"
                      value={formData.next_inspection_date}
                      onChange={(e) => setFormData({ ...formData, next_inspection_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Inspector Name *</Label>
                    <Input
                      value={formData.inspector_name}
                      onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                      placeholder="Name of inspector"
                      required
                    />
                  </div>
                  <div>
                    <Label>Inspector Type</Label>
                    <Select value={formData.inspector_type} onValueChange={(v) => setFormData({ ...formData, inspector_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Overall Result *</Label>
                    <Select value={formData.overall_result} onValueChange={(v) => setFormData({ ...formData, overall_result: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Odometer Reading</Label>
                    <Input
                      type="number"
                      value={formData.odometer_reading}
                      onChange={(e) => setFormData({ ...formData, odometer_reading: e.target.value })}
                      placeholder="Current mileage"
                    />
                  </div>
                  <div>
                    <Label>Certificate Number</Label>
                    <Input
                      value={formData.certificate_number}
                      onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                      placeholder="If applicable"
                    />
                  </div>
                  <div>
                    <Label>Estimated Repair Cost</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.estimated_repair_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_repair_cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Defects Found</Label>
                  <Textarea
                    value={formData.defects_found}
                    onChange={(e) => setFormData({ ...formData, defects_found: e.target.value })}
                    placeholder="List defects separated by commas"
                  />
                </div>
                <div>
                  <Label>Repairs Required</Label>
                  <Textarea
                    value={formData.repairs_required}
                    onChange={(e) => setFormData({ ...formData, repairs_required: e.target.value })}
                    placeholder="List repairs needed separated by commas"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createInspection.isPending}>Record Inspection</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading inspections...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections?.map((inspection: any) => (
                  <TableRow key={inspection.id}>
                    <TableCell>
                      {inspection.vehicles ? `${inspection.vehicles.registration_number}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(inspection.inspection_type)}>
                        {inspection.inspection_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(inspection.inspection_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{inspection.inspector_name}</TableCell>
                    <TableCell>{inspection.odometer_reading?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{getResultBadge(inspection.overall_result)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedInspection(inspection)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!inspections || inspections.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No inspections recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Inspection Detail Dialog */}
      <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inspection Details</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Vehicle:</strong> {selectedInspection.vehicles?.registration_number}</div>
                <div><strong>Type:</strong> <span className="capitalize">{selectedInspection.inspection_type}</span></div>
                <div><strong>Date:</strong> {format(new Date(selectedInspection.inspection_date), 'PPP')}</div>
                <div><strong>Next Inspection:</strong> {selectedInspection.next_inspection_date ? format(new Date(selectedInspection.next_inspection_date), 'PPP') : '-'}</div>
                <div><strong>Inspector:</strong> {selectedInspection.inspector_name}</div>
                <div><strong>Inspector Type:</strong> <span className="capitalize">{selectedInspection.inspector_type}</span></div>
                <div><strong>Result:</strong> {getResultBadge(selectedInspection.overall_result)}</div>
                <div><strong>Odometer:</strong> {selectedInspection.odometer_reading?.toLocaleString() || '-'} km</div>
              </div>
              {selectedInspection.defects_found?.length > 0 && (
                <div>
                  <strong>Defects Found:</strong>
                  <ul className="mt-1 list-disc list-inside text-muted-foreground">
                    {selectedInspection.defects_found.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedInspection.repairs_required?.length > 0 && (
                <div>
                  <strong>Repairs Required:</strong>
                  <ul className="mt-1 list-disc list-inside text-muted-foreground">
                    {selectedInspection.repairs_required.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedInspection.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-1 text-muted-foreground">{selectedInspection.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
