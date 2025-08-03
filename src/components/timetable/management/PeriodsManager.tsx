import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Period {
  id: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
}

export function PeriodsManager() {
  const { toast } = useToast();
  const [periods, setPeriods] = useState<Period[]>([
    {
      id: '1',
      period_number: 1,
      period_name: 'Period 1',
      start_time: '08:30',
      end_time: '09:15',
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '2',
      period_number: 2,
      period_name: 'Period 2',
      start_time: '09:15',
      end_time: '10:00',
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '3',
      period_number: 3,
      period_name: 'Break',
      start_time: '10:00',
      end_time: '10:15',
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const [formData, setFormData] = useState({
    period_name: '',
    start_time: '',
    end_time: '',
    days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  const handleSave = () => {
    if (editingPeriod) {
      setPeriods(periods.map(p => 
        p.id === editingPeriod.id 
          ? { ...editingPeriod, ...formData, period_number: periods.length + 1 }
          : p
      ));
      toast({ title: "Period updated successfully" });
    } else {
      const newPeriod: Period = {
        id: Math.random().toString(),
        period_number: periods.length + 1,
        ...formData
      };
      setPeriods([...periods, newPeriod]);
      toast({ title: "Period added successfully" });
    }
    
    setIsOpen(false);
    setEditingPeriod(null);
    setFormData({
      period_name: '',
      start_time: '',
      end_time: '',
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    });
  };

  const handleEdit = (period: Period) => {
    setEditingPeriod(period);
    setFormData({
      period_name: period.period_name,
      start_time: period.start_time,
      end_time: period.end_time,
      days_of_week: period.days_of_week
    });
    setIsOpen(true);
  };

  const handleDelete = (periodId: string) => {
    setPeriods(periods.filter(p => p.id !== periodId));
    toast({ title: "Period deleted successfully" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Manage Periods & Times
          </span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPeriod(null);
                setFormData({
                  period_name: '',
                  start_time: '',
                  end_time: '',
                  days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPeriod ? 'Edit Period' : 'Add New Period'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="period_name">Period Name</Label>
                  <Input
                    id="period_name"
                    value={formData.period_name}
                    onChange={(e) => setFormData({ ...formData, period_name: e.target.value })}
                    placeholder="e.g., Period 1, Break, Lunch"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingPeriod ? 'Update Period' : 'Add Period'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {periods.map((period) => (
            <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    Period {period.period_number}
                  </Badge>
                  <span className="font-medium">{period.period_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {period.start_time} - {period.end_time}
                  </span>
                </div>
                <div className="flex gap-1 mt-1">
                  {period.days_of_week.map((day) => (
                    <Badge key={day} variant="secondary" className="text-xs">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(period)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(period.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}