import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, Calendar, Bus, BusFront } from 'lucide-react';
import { TransportHoliday, useTransportMasterData } from '@/hooks/useTransportMasterData';
import { useTransportData } from '@/hooks/useTransportData';
import { format } from 'date-fns';

export const HolidaysManager = () => {
  const { userSchoolId } = useTransportData();
  const { holidays, loading, addHoliday, updateHoliday, deleteHoliday } = useTransportMasterData(userSchoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<TransportHoliday | null>(null);
  const [formData, setFormData] = useState({
    holiday_name: '',
    holiday_date: '',
    holiday_type: 'school',
    affects_transport: true,
    description: '',
  });

  const resetForm = () => {
    setFormData({
      holiday_name: '',
      holiday_date: '',
      holiday_type: 'school',
      affects_transport: true,
      description: '',
    });
    setEditingHoliday(null);
  };

  const handleEdit = (holiday: TransportHoliday) => {
    setEditingHoliday(holiday);
    setFormData({
      holiday_name: holiday.holiday_name,
      holiday_date: holiday.holiday_date,
      holiday_type: holiday.holiday_type,
      affects_transport: holiday.affects_transport,
      description: holiday.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId) return;

    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday.id, formData);
      } else {
        await addHoliday({ ...formData, school_id: userSchoolId });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving holiday:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      await deleteHoliday(id);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'government':
        return <Badge className="bg-blue-100 text-blue-800">Government</Badge>;
      case 'school':
        return <Badge className="bg-purple-100 text-purple-800">School</Badge>;
      case 'emergency':
        return <Badge variant="destructive">Emergency</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Group holidays by month
  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const monthYear = format(new Date(holiday.holiday_date), 'MMMM yyyy');
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(holiday);
    return acc;
  }, {} as Record<string, TransportHoliday[]>);

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
            <Calendar className="h-5 w-5" />
            Transport Holidays
          </CardTitle>
          <CardDescription>
            Manage holidays that affect transport operations
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </DialogTitle>
              <DialogDescription>
                Define holidays when transport services are affected
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="holiday_name">Holiday Name *</Label>
                <Input
                  id="holiday_name"
                  value={formData.holiday_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, holiday_name: e.target.value }))}
                  placeholder="e.g., Independence Day"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holiday_date">Date *</Label>
                  <Input
                    id="holiday_date"
                    type="date"
                    value={formData.holiday_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, holiday_date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="holiday_type">Holiday Type *</Label>
                  <Select
                    value={formData.holiday_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, holiday_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="affects_transport">Affects Transport</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle off if transport operates on this holiday
                  </p>
                </div>
                <Switch
                  id="affects_transport"
                  checked={formData.affects_transport}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, affects_transport: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes about this holiday"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHoliday ? 'Update' : 'Add'} Holiday
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {holidays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No holidays added yet</p>
            <p className="text-sm">Add holidays to manage transport schedules</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHolidays).map(([monthYear, monthHolidays]) => (
              <div key={monthYear}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{monthYear}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Holiday</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Transport</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthHolidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(holiday.holiday_date), 'EEE, dd MMM')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{holiday.holiday_name}</p>
                            {holiday.description && (
                              <p className="text-sm text-muted-foreground">{holiday.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(holiday.holiday_type)}</TableCell>
                        <TableCell>
                          {holiday.affects_transport ? (
                            <Badge variant="destructive" className="gap-1">
                              <BusFront className="h-3 w-3" /> No Service
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <Bus className="h-3 w-3" /> Running
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(holiday)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(holiday.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
