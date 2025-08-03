import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  PieChart,
  Activity,
  FileText,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';

// Mock data for charts
const monthlyCollectionData = [
  { month: 'Sep', collected: 285000, target: 300000, outstanding: 45000 },
  { month: 'Oct', collected: 292000, target: 300000, outstanding: 38000 },
  { month: 'Nov', collected: 278000, target: 300000, outstanding: 52000 },
  { month: 'Dec', collected: 310000, target: 300000, outstanding: 25000 },
  { month: 'Jan', collected: 295000, target: 300000, outstanding: 35000 },
  { month: 'Feb', collected: 312000, target: 300000, outstanding: 18000 }
];

const feeTypeBreakdown = [
  { name: 'Tuition', amount: 1250000, percentage: 65, color: '#8884d8' },
  { name: 'Transport', amount: 185000, percentage: 9.6, color: '#82ca9d' },
  { name: 'Meals', amount: 140000, percentage: 7.3, color: '#ffc658' },
  { name: 'Boarding', amount: 220000, percentage: 11.4, color: '#ff7300' },
  { name: 'Activities', amount: 125000, percentage: 6.5, color: '#00ff88' }
];

const classWiseCollection = [
  { class: 'Year 7', students: 180, collected: 285000, outstanding: 45000, percentage: 86.4 },
  { class: 'Year 8', students: 175, collected: 295000, outstanding: 35000, percentage: 89.4 },
  { class: 'Year 9', students: 165, collected: 275000, outstanding: 55000, percentage: 83.3 },
  { class: 'Year 10', students: 155, collected: 310000, outstanding: 25000, percentage: 92.5 },
  { class: 'Year 11', students: 145, collected: 280000, outstanding: 40000, percentage: 87.5 },
  { class: 'Year 12', students: 120, collected: 240000, outstanding: 30000, percentage: 88.9 },
  { class: 'Year 13', students: 110, collected: 220000, outstanding: 35000, percentage: 86.3 }
];

const paymentMethodData = [
  { method: 'Online Card', amount: 845000, transactions: 1247, percentage: 42.3 },
  { method: 'Bank Transfer', amount: 652000, transactions: 234, percentage: 32.6 },
  { method: 'Digital Wallet', amount: 285000, transactions: 156, percentage: 14.3 },
  { method: 'Cash/Cheque', amount: 218000, transactions: 89, percentage: 10.9 }
];

export const FeeReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');
  const [selectedClass, setSelectedClass] = useState('all');

  const totalCollected = monthlyCollectionData.reduce((sum, month) => sum + month.collected, 0);
  const totalOutstanding = monthlyCollectionData.reduce((sum, month) => sum + month.outstanding, 0);
  const collectionRate = (totalCollected / (totalCollected + totalOutstanding)) * 100;
  const monthOverMonthGrowth = 4.2; // Mock percentage

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive financial insights and performance tracking</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="academic-year">Academic Year</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold">£{(totalCollected / 1000).toFixed(0)}k</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+{monthOverMonthGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-warning">£{(totalOutstanding / 1000).toFixed(0)}k</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">-2.1%</span>
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-primary">{collectionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Target: 90%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Paying fees</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collection-trends">Collection Trends</TabsTrigger>
          <TabsTrigger value="fee-breakdown">Fee Breakdown</TabsTrigger>
          <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monthly Collection vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area type="monotone" dataKey="collected" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="target" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Fee Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value: number) => [`£${value.toLocaleString()}`, '']} />
                    <RechartsPieChart data={feeTypeBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="amount">
                      {feeTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {feeTypeBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collection-trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Collection Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line type="monotone" dataKey="collected" stroke="#8884d8" strokeWidth={3} />
                  <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="outstanding" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-success">94.2%</p>
                  <p className="text-sm text-muted-foreground">Average Collection Rate</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">£297k</p>
                  <p className="text-sm text-muted-foreground">Average Monthly Collection</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-warning">12 days</p>
                  <p className="text-sm text-muted-foreground">Average Payment Delay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fee-breakdown">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeTypeBreakdown.map((fee) => (
                    <div key={fee.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: fee.color }} />
                        <div>
                          <h4 className="font-medium">{fee.name}</h4>
                          <p className="text-sm text-muted-foreground">{fee.percentage}% of total fees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">£{fee.amount.toLocaleString()}</p>
                        <Badge variant="outline">
                          {fee.percentage > 10 ? 'High Impact' : fee.percentage > 5 ? 'Medium Impact' : 'Low Impact'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="class-analysis">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Class-wise Collection Analysis
                </CardTitle>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classWiseCollection.map(cls => (
                      <SelectItem key={cls.class} value={cls.class}>{cls.class}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classWiseCollection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="collected" fill="#8884d8" />
                  <Bar dataKey="outstanding" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {classWiseCollection.map((cls) => (
                  <div key={cls.class} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{cls.class}</h4>
                    <p className="text-sm text-muted-foreground">{cls.students} students</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Collection Rate</span>
                        <span className="text-sm font-medium">{cls.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${cls.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment Method Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {paymentMethodData.map((method) => (
                    <div key={method.method} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{method.method}</h4>
                        <p className="text-sm text-muted-foreground">
                          {method.transactions} transactions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">£{method.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{method.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium mb-4">Payment Method Trends</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={paymentMethodData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="method" type="category" width={100} />
                      <Tooltip formatter={(value: number) => [`£${value.toLocaleString()}`, '']} />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};