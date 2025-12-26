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
import { GraduationCap, Plus, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const SafetyTrainingPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { drivers } = useTransportData();
  const { toast } = useToast();
  
  const [trainings, setTrainings] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    driver_id: '',
    training_type: 'induction',
    training_name: '',
    training_provider: '',
    training_date: '',
    duration_hours: '',
    status: 'completed',
    score: '',
    passing_score: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const driver = drivers.find(d => d.id === formData.driver_id);
    const score = formData.score ? parseFloat(formData.score) : null;
    const passingScore = formData.passing_score ? parseFloat(formData.passing_score) : null;
    
    const newTraining = {
      id: crypto.randomUUID(),
      ...formData,
      driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown',
      score,
      passing_score: passingScore,
      passed: score !== null && passingScore !== null ? score >= passingScore : null,
    };
    
    setTrainings([newTraining, ...trainings]);
    toast({ title: 'Training record added successfully' });
    setIsOpen(false);
    setFormData({
      driver_id: '',
      training_type: 'induction',
      training_name: '',
      training_provider: '',
      training_date: '',
      duration_hours: '',
      status: 'completed',
      score: '',
      passing_score: '',
      notes: '',
    });
  };

  const getStatusBadge = (training: any) => {
    switch (training.status) {
      case 'completed':
        if (training.passed === true) return <Badge className="bg-green-500">Passed</Badge>;
        if (training.passed === false) return <Badge className="bg-red-500">Failed</Badge>;
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{training.status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'induction': return 'bg-blue-500';
      case 'refresher': return 'bg-purple-500';
      case 'specialized': return 'bg-green-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    total: trainings.length,
    completed: trainings.filter((t: any) => t.status === 'completed').length,
    passed: trainings.filter((t: any) => t.passed === true).length,
    scheduled: trainings.filter((t: any) => t.status === 'scheduled').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Training Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-500" />
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
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Safety Training Records</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Training</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Training Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Driver</Label>
                    <Select value={formData.driver_id} onValueChange={(v) => setFormData({ ...formData, driver_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select driver (optional)" /></SelectTrigger>
                      <SelectContent>
                        {drivers?.map((d: any) => (
                          <SelectItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Training Type *</Label>
                    <Select value={formData.training_type} onValueChange={(v) => setFormData({ ...formData, training_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="induction">Induction</SelectItem>
                        <SelectItem value="refresher">Refresher</SelectItem>
                        <SelectItem value="specialized">Specialized</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Training Name *</Label>
                    <Input
                      value={formData.training_name}
                      onChange={(e) => setFormData({ ...formData, training_name: e.target.value })}
                      placeholder="e.g., Defensive Driving Course"
                      required
                    />
                  </div>
                  <div>
                    <Label>Training Provider</Label>
                    <Input
                      value={formData.training_provider}
                      onChange={(e) => setFormData({ ...formData, training_provider: e.target.value })}
                      placeholder="Provider name"
                    />
                  </div>
                  <div>
                    <Label>Training Date *</Label>
                    <Input
                      type="date"
                      value={formData.training_date}
                      onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Duration (hours)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Score</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
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
                  <Button type="submit">Add Training</Button>
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
                <TableHead>Training</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training: any) => (
                <TableRow key={training.id}>
                  <TableCell>{training.driver_name || '-'}</TableCell>
                  <TableCell className="font-medium">{training.training_name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(training.training_type)}>
                      {training.training_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{training.training_date ? format(new Date(training.training_date), 'MMM dd, yyyy') : '-'}</TableCell>
                  <TableCell>{training.duration_hours ? `${training.duration_hours}h` : '-'}</TableCell>
                  <TableCell>
                    {training.score !== null ? (
                      <span>
                        {training.score}
                        {training.passing_score && <span className="text-muted-foreground">/{training.passing_score}</span>}
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(training)}</TableCell>
                </TableRow>
              ))}
              {trainings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No training records
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
