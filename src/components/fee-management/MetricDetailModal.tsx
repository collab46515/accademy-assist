import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, Send, Calendar, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';

interface MetricDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricType: 'collected' | 'outstanding' | 'percentage' | 'expected' | 'overdue';
  data: {
    totalCollected: number;
    outstandingFees: number;
    collectionPercentage: number;
    todayExpected: number;
    overdueAccounts: number;
  };
}

interface PaymentRecord {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  receipt_number: string;
  student_name?: string;
}

interface FeeHead {
  id: string;
  name: string;
  category: string;
  amount: number;
}

interface FeeStructure {
  id: string;
  name: string;
  total_amount: number;
  applicable_year_groups: string[];
}

const chartConfig = {
  amount: { label: "Amount", color: "hsl(var(--primary))" },
  count: { label: "Count", color: "hsl(var(--primary))" }
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'];

export function MetricDetailModal({ open, onOpenChange, metricType, data }: MetricDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentSchoolId } = useSchoolFilter();

  useEffect(() => {
    if (open && currentSchoolId) {
      fetchDetailData();
    }
  }, [open, currentSchoolId, metricType]);

  const fetchDetailData = async () => {
    if (!currentSchoolId) return;
    setLoading(true);

    try {
      // Fetch payment records
      const { data: paymentData } = await supabase
        .from('payment_records')
        .select('*')
        .eq('school_id', currentSchoolId)
        .eq('status', 'completed')
        .order('payment_date', { ascending: false })
        .limit(20);

      // Fetch fee heads
      const { data: feeHeadsData } = await supabase
        .from('fee_heads')
        .select('*')
        .eq('school_id', currentSchoolId)
        .eq('is_active', true);

      // Fetch fee structures
      const { data: structuresData } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('school_id', currentSchoolId)
        .eq('status', 'active');

      setPayments(paymentData || []);
      setFeeHeads(feeHeadsData || []);
      setFeeStructures(structuresData || []);
    } catch (error) {
      console.error('Error fetching detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm">Data will appear here once fee assignments are created</p>
    </div>
  );

  // Group payments by method for chart
  const paymentsByMethod = payments.reduce((acc, p) => {
    const method = p.payment_method || 'Other';
    acc[method] = (acc[method] || 0) + Number(p.amount);
    return acc;
  }, {} as Record<string, number>);

  const paymentMethodChartData = Object.entries(paymentsByMethod).map(([method, amount]) => ({
    method,
    amount
  }));

  // Group fee heads by category for pie chart
  const feesByCategory = feeHeads.reduce((acc, fh) => {
    const category = fh.category || 'General';
    acc[category] = (acc[category] || 0) + Number(fh.amount);
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(feesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const getModalContent = () => {
    switch (metricType) {
      case 'collected':
        return {
          title: 'Total Collected This Term',
          description: 'Detailed breakdown of all payments received',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.totalCollected)}</div>
                    <div className="text-sm text-muted-foreground">Total Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{payments.length}</div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(payments.length > 0 ? data.totalCollected / payments.length : 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Payment</div>
                  </CardContent>
                </Card>
              </div>

              {paymentMethodChartData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Collection by Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={paymentMethodChartData}>
                          <XAxis dataKey="method" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="amount" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              ) : null}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Payments</h3>
                  <Button variant="outline" size="sm" disabled={payments.length === 0}>
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
                {payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Receipt #</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.receipt_number || '-'}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.payment_method || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState message="No payments recorded yet" />
                )}
              </div>
            </div>
          )
        };

      case 'outstanding':
        return {
          title: 'Outstanding Fees Overview',
          description: 'Breakdown of configured fee structures and heads',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-destructive">{formatCurrency(data.outstandingFees)}</div>
                    <div className="text-sm text-muted-foreground">Total Outstanding</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{feeStructures.length}</div>
                    <div className="text-sm text-muted-foreground">Active Fee Structures</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{feeHeads.length}</div>
                    <div className="text-sm text-muted-foreground">Fee Heads Configured</div>
                  </CardContent>
                </Card>
              </div>

              {categoryChartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Fee Heads from Master Data</CardTitle>
                </CardHeader>
                <CardContent>
                  {feeHeads.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fee Head</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeHeads.map((fh) => (
                          <TableRow key={fh.id}>
                            <TableCell className="font-medium">{fh.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{fh.category}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(fh.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <EmptyState message="No fee heads configured" />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Fee Structures</CardTitle>
                </CardHeader>
                <CardContent>
                  {feeStructures.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Structure Name</TableHead>
                          <TableHead>Applicable Year Groups</TableHead>
                          <TableHead>Total Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeStructures.map((fs) => (
                          <TableRow key={fs.id}>
                            <TableCell className="font-medium">{fs.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(fs.applicable_year_groups || []).slice(0, 3).map((yg, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{yg}</Badge>
                                ))}
                                {(fs.applicable_year_groups || []).length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(fs.applicable_year_groups || []).length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(fs.total_amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <EmptyState message="No fee structures configured" />
                  )}
                </CardContent>
              </Card>
            </div>
          )
        };

      case 'percentage':
        return {
          title: 'Collection Rate Analysis',
          description: 'Overview of fee collection performance',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{data.collectionPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Collection Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.totalCollected)}</div>
                    <div className="text-sm text-muted-foreground">Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(data.outstandingFees)}</div>
                    <div className="text-sm text-muted-foreground">Outstanding</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.totalCollected + data.outstandingFees)}</div>
                    <div className="text-sm text-muted-foreground">Total Expected</div>
                  </CardContent>
                </Card>
              </div>

              {data.totalCollected === 0 && data.outstandingFees === 0 ? (
                <EmptyState message="No fee collection data available yet" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Collection Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Collected', value: data.totalCollected },
                              { name: 'Outstanding', value: data.outstandingFees }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="hsl(142 76% 36%)" />
                            <Cell fill="hsl(0 84% 60%)" />
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        };

      case 'overdue':
        return {
          title: 'Overdue Accounts',
          description: 'Students with overdue fee payments',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{data.overdueAccounts}</div>
                    <div className="text-sm text-muted-foreground">Overdue Accounts</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.outstandingFees)}</div>
                    <div className="text-sm text-muted-foreground">Total Outstanding</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {data.overdueAccounts > 0 ? formatCurrency(data.outstandingFees / data.overdueAccounts) : formatCurrency(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg per Account</div>
                  </CardContent>
                </Card>
              </div>

              {data.overdueAccounts === 0 ? (
                <EmptyState message="No overdue accounts" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Overdue Account Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Student fee assignments need to be created to track individual overdue accounts.
                      Configure fee structures and assign them to students to enable detailed tracking.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        };

      case 'expected':
        return {
          title: "Today's Expected Collections",
          description: 'Payments expected based on due dates',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.todayExpected)}</div>
                    <div className="text-sm text-muted-foreground">Expected Today</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{formatCurrency(data.totalCollected)}</div>
                    <div className="text-sm text-muted-foreground">Total Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{feeStructures.length}</div>
                    <div className="text-sm text-muted-foreground">Active Structures</div>
                  </CardContent>
                </Card>
              </div>

              {data.todayExpected === 0 ? (
                <EmptyState message="No payments expected today" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Create student fee assignments with due dates to track expected daily collections.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        };

      default:
        return {
          title: 'Metric Details',
          description: 'Detailed information',
          content: <EmptyState message="No data available" />
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
          <DialogDescription>{modalContent.description}</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          modalContent.content
        )}
      </DialogContent>
    </Dialog>
  );
}
