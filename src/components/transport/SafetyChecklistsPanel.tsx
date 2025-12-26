import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ClipboardCheck, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const SafetyChecklistsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<any>(null);
  const { toast } = useToast();
  
  const [checklists, setChecklists] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    checklist_name: '',
    checklist_type: 'pre_trip',
    applies_to: 'vehicle',
    is_mandatory: true,
    items: [] as { item_id: string; item_text: string; category: string }[],
  });

  const [newItem, setNewItem] = useState({ item_text: '', category: '' });

  const handleAddItem = () => {
    if (newItem.item_text) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...newItem, item_id: crypto.randomUUID() }],
      });
      setNewItem({ item_text: '', category: '' });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(i => i.item_id !== itemId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChecklist) {
      setChecklists(checklists.map(c => c.id === editingChecklist.id ? { ...c, ...formData } : c));
      toast({ title: 'Checklist updated successfully' });
    } else {
      const newChecklist = {
        id: crypto.randomUUID(),
        ...formData,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setChecklists([...checklists, newChecklist]);
      toast({ title: 'Checklist created successfully' });
    }
    setIsOpen(false);
    setEditingChecklist(null);
    setFormData({
      checklist_name: '',
      checklist_type: 'pre_trip',
      applies_to: 'vehicle',
      is_mandatory: true,
      items: [],
    });
  };

  const handleEdit = (checklist: any) => {
    setEditingChecklist(checklist);
    setFormData({
      checklist_name: checklist.checklist_name,
      checklist_type: checklist.checklist_type,
      applies_to: checklist.applies_to,
      is_mandatory: checklist.is_mandatory,
      items: checklist.items || [],
    });
    setIsOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setChecklists(checklists.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pre_trip': return 'bg-blue-500';
      case 'post_trip': return 'bg-purple-500';
      case 'daily': return 'bg-green-500';
      case 'weekly': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Checklist Templates</CardTitle>
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEditingChecklist(null);
                setFormData({
                  checklist_name: '',
                  checklist_type: 'pre_trip',
                  applies_to: 'vehicle',
                  is_mandatory: true,
                  items: [],
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Checklist</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingChecklist ? 'Edit Checklist' : 'Create New Checklist'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Checklist Name *</Label>
                      <Input
                        value={formData.checklist_name}
                        onChange={(e) => setFormData({ ...formData, checklist_name: e.target.value })}
                        placeholder="e.g., Pre-Trip Vehicle Check"
                        required
                      />
                    </div>
                    <div>
                      <Label>Type *</Label>
                      <Select value={formData.checklist_type} onValueChange={(v) => setFormData({ ...formData, checklist_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre_trip">Pre-Trip</SelectItem>
                          <SelectItem value="post_trip">Post-Trip</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Applies To</Label>
                      <Select value={formData.applies_to} onValueChange={(v) => setFormData({ ...formData, applies_to: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="route">Route</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        checked={formData.is_mandatory}
                        onCheckedChange={(v) => setFormData({ ...formData, is_mandatory: v })}
                      />
                      <Label>Mandatory</Label>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <Label>Checklist Items</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newItem.item_text}
                        onChange={(e) => setNewItem({ ...newItem, item_text: e.target.value })}
                        placeholder="Enter checklist item"
                        className="flex-1"
                      />
                      <Input
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="Category"
                        className="w-32"
                      />
                      <Button type="button" onClick={handleAddItem} size="sm">Add</Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {formData.items.map((item, idx) => (
                        <div key={item.item_id} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{idx + 1}. {item.item_text}</span>
                          <div className="flex items-center gap-2">
                            {item.category && <Badge variant="outline">{item.category}</Badge>}
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveItem(item.item_id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {formData.items.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No items added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit">
                      {editingChecklist ? 'Update' : 'Create'} Checklist
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklists.map((checklist: any) => (
                <div 
                  key={checklist.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{checklist.checklist_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(checklist.checklist_type)}>
                          {checklist.checklist_type.replace('_', '-')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {checklist.items?.length || 0} items
                        </span>
                        {checklist.is_mandatory && (
                          <Badge variant="outline">Mandatory</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={checklist.is_active}
                      onCheckedChange={() => handleToggleActive(checklist.id)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(checklist)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {checklists.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No checklists created yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completions.map((completion: any) => (
                <div 
                  key={completion.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {completion.overall_status === 'pass' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{completion.checklist_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {completion.completed_by} • {format(new Date(completion.completed_at), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={completion.overall_status === 'pass' ? 'default' : 'destructive'}>
                    {completion.overall_status}
                  </Badge>
                </div>
              ))}
              {completions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No completions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
