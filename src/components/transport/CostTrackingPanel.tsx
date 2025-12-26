import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTransportAnalytics } from "@/hooks/useTransportAnalytics";
import { DollarSign, Plus, Trash2, Fuel, Wrench, User, Shield, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COST_CATEGORIES = [
  { value: 'fuel', label: 'Fuel', icon: Fuel },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench },
  { value: 'driver_salary', label: 'Driver Salary', icon: User },
  { value: 'insurance', label: 'Insurance', icon: Shield },
  { value: 'depreciation', label: 'Depreciation', icon: DollarSign },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

export function CostTrackingPanel() {
  const { costs, isLoading, addCost, deleteCost } = useTransportAnalytics();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cost_category: '',
    amount: '',
    cost_date: new Date().toISOString().split('T')[0],
    description: '',
    vendor_name: '',
    invoice_number: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCost({
      school_id: 'default-school',
      cost_category: formData.cost_category,
      amount: parseFloat(formData.amount),
      cost_date: formData.cost_date,
      description: formData.description || undefined,
      vendor_name: formData.vendor_name || undefined,
      invoice_number: formData.invoice_number || undefined,
      notes: formData.notes || undefined,
      currency: 'USD',
      metadata: {},
    });
    setFormData({
      cost_category: '',
      amount: '',
      cost_date: new Date().toISOString().split('T')[0],
      description: '',
      vendor_name: '',
      invoice_number: '',
      notes: '',
    });
    setIsDialogOpen(false);
  };

  const getCategoryBadge = (category: string) => {
    const cat = COST_CATEGORIES.find(c => c.value === category);
    const colors: Record<string, string> = {
      fuel: 'bg-orange-500',
      maintenance: 'bg-blue-500',
      driver_salary: 'bg-green-500',
      insurance: 'bg-purple-500',
      depreciation: 'bg-gray-500',
      other: 'bg-slate-500',
    };
    return <Badge className={colors[category] || 'bg-slate-500'}>{cat?.label || category}</Badge>;
  };

  // Calculate category totals
  const categoryTotals = COST_CATEGORIES.map(cat => ({
    ...cat,
    total: costs.filter(c => c.cost_category === cat.value).reduce((sum, c) => sum + c.amount, 0),
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categoryTotals.map((cat) => (
          <Card key={cat.value}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{cat.label}</CardTitle>
              <cat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${cat.total.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Records
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Cost
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Cost Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.cost_category}
                      onValueChange={(v) => setFormData({ ...formData, cost_category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {COST_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.cost_date}
                      onChange={(e) => setFormData({ ...formData, cost_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Input
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      placeholder="Vendor name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input
                      value={formData.invoice_number}
                      onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                      placeholder="INV-001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.cost_category || !formData.amount}>
                    Add Cost
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Cost Records</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start tracking transport costs by adding your first record.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Cost
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>{new Date(cost.cost_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getCategoryBadge(cost.cost_category)}</TableCell>
                    <TableCell>{cost.description || '-'}</TableCell>
                    <TableCell>{cost.vendor_name || '-'}</TableCell>
                    <TableCell>{cost.invoice_number || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${cost.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCost(cost.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
