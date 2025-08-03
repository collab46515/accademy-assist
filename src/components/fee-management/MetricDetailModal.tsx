import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, Send, Calendar, TrendingUp, Users } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MetricDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricType: 'collected' | 'outstanding' | 'percentage' | 'expected' | 'overdue';
  data: any;
}

const chartConfig = {
  amount: { label: "Amount", color: "hsl(var(--primary))" },
  count: { label: "Count", color: "hsl(var(--primary))" }
};

export function MetricDetailModal({ open, onOpenChange, metricType, data }: MetricDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getModalContent = () => {
    switch (metricType) {
      case 'collected':
        return {
          title: 'Total Collected This Term',
          description: 'Detailed breakdown of all payments received',
          content: (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£42,800</div>
                    <div className="text-sm text-muted-foreground">Total Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">324</div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£132</div>
                    <div className="text-sm text-muted-foreground">Avg Payment</div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Methods Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Collection by Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[
                        { method: 'Bank Transfer', amount: 18500 },
                        { method: 'Card', amount: 15200 },
                        { method: 'Cash', amount: 6800 },
                        { method: 'Online', amount: 2300 }
                      ]}>
                        <XAxis dataKey="method" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="amount" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent Payments Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Payments</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2025-08-03', student: 'James Wilson', amount: 1600, method: 'Bank Transfer', ref: 'TXN001' },
                      { date: '2025-08-02', student: 'Sarah Brown', amount: 1250, method: 'Card', ref: 'TXN002' },
                      { date: '2025-08-01', student: 'Michael Davis', amount: 800, method: 'Cash', ref: 'TXN003' }
                    ].map((payment, i) => (
                      <TableRow key={i}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.student}</TableCell>
                        <TableCell>£{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.ref}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        };

      case 'outstanding':
        return {
          title: 'Outstanding Fees',
          description: 'Breakdown of all unpaid fees by class and category',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-destructive">£8,450</div>
                    <div className="text-sm text-muted-foreground">Total Outstanding</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-sm text-muted-foreground">Students with Dues</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">17</div>
                    <div className="text-sm text-muted-foreground">Overdue Accounts</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Outstanding by Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Amount Outstanding</TableHead>
                        <TableHead>Overdue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { class: '8B', students: 12, amount: 3200, overdue: 8 },
                        { class: '7A', students: 8, amount: 2100, overdue: 4 },
                        { class: '9C', students: 15, amount: 1900, overdue: 3 },
                        { class: '12A', students: 12, amount: 1250, overdue: 2 }
                      ].map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.class}</TableCell>
                          <TableCell>{item.students}</TableCell>
                          <TableCell className="text-destructive font-semibold">£{item.amount}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{item.overdue}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Send className="w-3 h-3 mr-1" />
                              Send Reminders
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )
        };

      case 'percentage':
        return {
          title: 'Collection Rate Analysis',
          description: 'Detailed breakdown of collection rates across different segments',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">83%</div>
                    <div className="text-sm text-muted-foreground">Overall Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£42,800</div>
                    <div className="text-sm text-muted-foreground">Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">£8,450</div>
                    <div className="text-sm text-muted-foreground">Outstanding</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£51,250</div>
                    <div className="text-sm text-muted-foreground">Total Expected</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Rate by Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { class: '7A', rate: 95, collected: 4750, outstanding: 250 },
                        { class: '8B', rate: 87, collected: 6960, outstanding: 1040 },
                        { class: '9C', rate: 82, collected: 4920, outstanding: 1080 },
                        { class: '10A', rate: 78, collected: 5460, remaining: 1540 },
                        { class: '11B', rate: 75, collected: 4500, remaining: 1500 },
                        { class: '12A', rate: 92, collected: 5520, remaining: 480 }
                      ]}>
                        <XAxis dataKey="class" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rate" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Rate Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={[
                        { month: 'Jan', rate: 78 },
                        { month: 'Feb', rate: 82 },
                        { month: 'Mar', rate: 85 },
                        { month: 'Apr', rate: 83 },
                        { month: 'May', rate: 87 },
                        { month: 'Jun', rate: 89 },
                        { month: 'Jul', rate: 83 }
                      ]}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )
        };

      case 'overdue':
        return {
          title: 'Overdue Accounts Analysis',
          description: 'Detailed breakdown of overdue accounts requiring immediate attention',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">17</div>
                    <div className="text-sm text-muted-foreground">Overdue Accounts</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">£4,250</div>
                    <div className="text-sm text-muted-foreground">Total Overdue</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£250</div>
                    <div className="text-sm text-muted-foreground">Avg Overdue</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Avg Days Late</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Overdue Accounts by Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Amount Overdue</TableHead>
                        <TableHead>Days Late</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { student: 'James Wilson', class: '8B', amount: 1600, days: 45, lastContact: '2025-07-15', severity: 'high' },
                        { student: 'Sarah Connor', class: '7A', amount: 800, days: 32, lastContact: '2025-07-20', severity: 'high' },
                        { student: 'Michael Davis', class: '9C', amount: 450, days: 28, lastContact: '2025-07-25', severity: 'medium' },
                        { student: 'Emma Johnson', class: '10A', amount: 300, days: 15, lastContact: '2025-08-01', severity: 'low' },
                        { student: 'Tom Wilson', class: '11B', amount: 250, days: 12, lastContact: '2025-08-02', severity: 'low' }
                      ].map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.student}</TableCell>
                          <TableCell>{item.class}</TableCell>
                          <TableCell className="text-red-600 font-semibold">£{item.amount}</TableCell>
                          <TableCell>
                            <Badge variant={item.days > 30 ? 'destructive' : item.days > 14 ? 'default' : 'secondary'}>
                              {item.days} days
                            </Badge>
                          </TableCell>
                          <TableCell>{item.lastContact}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Send className="w-3 h-3 mr-1" />
                                Remind
                              </Button>
                              <Button variant="ghost" size="sm">Call</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )
        };

      case 'expected':
        return {
          title: "Today's Expected Collections",
          description: 'Students scheduled to make payments today',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£2,100</div>
                    <div className="text-sm text-muted-foreground">Expected Today</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">£262</div>
                    <div className="text-sm text-muted-foreground">Avg Expected</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search expected collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { student: 'Emma Johnson', class: '8B', amount: 1600, type: 'Tuition', contact: '+44 7123 456789' },
                      { student: 'Tom Wilson', class: '7A', amount: 250, type: 'Transport', contact: '+44 7234 567890' },
                      { student: 'Lisa Brown', class: '9C', amount: 150, type: 'Exam Fee', contact: '+44 7345 678901' },
                      { student: 'Alex Davis', class: '12A', amount: 100, type: 'Library', contact: '+44 7456 789012' }
                    ].map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.student}</TableCell>
                        <TableCell>{item.class}</TableCell>
                        <TableCell>£{item.amount}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.contact}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">Call</Button>
                            <Button variant="ghost" size="sm">Remind</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        };

      default:
        return {
          title: 'Metric Details',
          description: 'Detailed information',
          content: <div>Details coming soon...</div>
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
          <DialogDescription>{modalContent.description}</DialogDescription>
        </DialogHeader>
        {modalContent.content}
      </DialogContent>
    </Dialog>
  );
}