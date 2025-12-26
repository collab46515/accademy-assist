import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Award, Plus, Edit, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const DriverCertificationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { drivers } = useTransportData();
  const { toast } = useToast();
  
  // Mock data for demo
  const [certifications, setCertifications] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    driver_id: '',
    certification_type: '',
    certification_name: '',
    issuing_authority: '',
    certificate_number: '',
    issue_date: '',
    expiry_date: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const driver = drivers.find(d => d.id === formData.driver_id);
    const newCert = {
      id: crypto.randomUUID(),
      ...formData,
      driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown',
    };
    setCertifications([...certifications, newCert]);
    toast({ title: 'Certification added successfully' });
    setIsOpen(false);
    setFormData({
      driver_id: '',
      certification_type: '',
      certification_name: '',
      issuing_authority: '',
      certificate_number: '',
      issue_date: '',
      expiry_date: '',
      notes: '',
    });
  };

  const getStatusBadge = (cert: any) => {
    if (!cert.expiry_date) return <Badge variant="outline">No Expiry</Badge>;
    
    const daysUntilExpiry = differenceInDays(new Date(cert.expiry_date), new Date());
    
    if (daysUntilExpiry < 0) {
      return <Badge className="bg-red-500">Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge className="bg-orange-500">Expiring Soon</Badge>;
    } else if (daysUntilExpiry <= 90) {
      return <Badge className="bg-yellow-500">Expires in {daysUntilExpiry}d</Badge>;
    }
    return <Badge className="bg-green-500">Valid</Badge>;
  };

  const expiringCount = certifications.filter((c: any) => {
    if (!c.expiry_date) return false;
    const days = differenceInDays(new Date(c.expiry_date), new Date());
    return days >= 0 && days <= 30;
  }).length;

  const expiredCount = certifications.filter((c: any) => {
    if (!c.expiry_date) return false;
    return differenceInDays(new Date(c.expiry_date), new Date()) < 0;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{certifications.length}</p>
                <p className="text-sm text-muted-foreground">Total Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {certifications.length - expiringCount - expiredCount}
                </p>
                <p className="text-sm text-muted-foreground">Valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{expiringCount}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{expiredCount}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driver Certifications</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Certification</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Certification</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Driver *</Label>
                  <Select value={formData.driver_id} onValueChange={(v) => setFormData({ ...formData, driver_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                    <SelectContent>
                      {drivers?.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Certification Type *</Label>
                    <Select value={formData.certification_type} onValueChange={(v) => setFormData({ ...formData, certification_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="license">Driving License</SelectItem>
                        <SelectItem value="first_aid">First Aid</SelectItem>
                        <SelectItem value="defensive_driving">Defensive Driving</SelectItem>
                        <SelectItem value="child_safety">Child Safety</SelectItem>
                        <SelectItem value="prdp">PrDP</SelectItem>
                        <SelectItem value="medical">Medical Fitness</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Certification Name *</Label>
                    <Input
                      value={formData.certification_name}
                      onChange={(e) => setFormData({ ...formData, certification_name: e.target.value })}
                      placeholder="e.g., Code 10 License"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Issue Date *</Label>
                    <Input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Certification</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((cert: any) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.driver_name}</TableCell>
                  <TableCell className="font-medium">{cert.certification_name}</TableCell>
                  <TableCell className="capitalize">{cert.certification_type?.replace('_', ' ')}</TableCell>
                  <TableCell>{cert.issue_date ? format(new Date(cert.issue_date), 'MMM dd, yyyy') : '-'}</TableCell>
                  <TableCell>
                    {cert.expiry_date ? format(new Date(cert.expiry_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(cert)}</TableCell>
                </TableRow>
              ))}
              {certifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No certifications recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
