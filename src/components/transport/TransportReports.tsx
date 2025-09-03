import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, TrendingUp, Truck, Users, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export function TransportReports() {
  const monthlyData = [
    { month: "Sep", onTime: 94, delayed: 6, cancelled: 0, totalTrips: 850 },
    { month: "Oct", onTime: 91, delayed: 8, cancelled: 1, totalTrips: 920 },
    { month: "Nov", onTime: 96, delayed: 4, cancelled: 0, totalTrips: 880 },
    { month: "Dec", onTime: 89, delayed: 10, cancelled: 1, totalTrips: 750 },
    { month: "Jan", onTime: 93, delayed: 6, cancelled: 1, totalTrips: 900 }
  ];

  const routePerformance = [
    { route: "Route 1", onTimeRate: 95, avgDelay: 2.1, satisfaction: 4.8, students: 45 },
    { route: "Route 2", onTimeRate: 87, avgDelay: 4.5, satisfaction: 4.3, students: 38 },
    { route: "Route 3", onTimeRate: 98, avgDelay: 1.2, satisfaction: 4.9, students: 25 },
    { route: "Route 4", onTimeRate: 91, avgDelay: 3.2, satisfaction: 4.6, students: 52 }
  ];

  const costAnalysis = [
    { category: "Fuel", amount: 3250, percentage: 35 },
    { category: "Maintenance", amount: 1890, percentage: 20 },
    { category: "Insurance", amount: 1480, percentage: 16 },
    { category: "Salaries", amount: 2130, percentage: 23 },
    { category: "Other", amount: 550, percentage: 6 }
  ];

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const incidentData = [
    { type: "Traffic Delays", count: 12, trend: "+2" },
    { type: "Vehicle Breakdown", count: 3, trend: "-1" },
    { type: "Weather Related", count: 5, trend: "+3" },
    { type: "Road Closures", count: 2, trend: "0" }
  ];

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select defaultValue="academic-year">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic-year">Academic Year 2023-24</SelectItem>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-routes">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-routes">All Routes</SelectItem>
              <SelectItem value="route-1">Route 1</SelectItem>
              <SelectItem value="route-2">Route 2</SelectItem>
              <SelectItem value="route-3">Route 3</SelectItem>
              <SelectItem value="route-4">Route 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              toast.success("Generating comprehensive transport report...");
              // In real implementation, would generate PDF/Excel report
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button
            onClick={() => {
              toast.success("Exporting transport data to CSV...");
              // In real implementation, would export data
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">93.2%</p>
              <p className="text-sm text-muted-foreground">On-Time Performance</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2.1% from last term
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">847</p>
              <p className="text-sm text-muted-foreground">Students Transported</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                89% of school population
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">2.8 min</p>
              <p className="text-sm text-muted-foreground">Average Delay</p>
              <p className="text-xs text-green-600">Improved from 3.2 min</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <MapPin className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">£9,300</p>
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
              <p className="text-xs text-red-600">+5% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Monthly on-time performance and delays</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="onTime" fill="#10B981" name="On Time %" />
                <Bar dataKey="delayed" fill="#F59E0B" name="Delayed %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Monthly transport expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costAnalysis}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="amount"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {costAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance Analysis</CardTitle>
          <CardDescription>Detailed performance metrics by route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routePerformance.map((route, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{route.route}</h3>
                  <Badge variant={route.onTimeRate >= 95 ? "default" : route.onTimeRate >= 90 ? "secondary" : "destructive"}>
                    {route.onTimeRate}% On Time
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-medium">{route.students}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Delay</p>
                    <p className="font-medium">{route.avgDelay} min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Satisfaction</p>
                    <p className="font-medium">⭐ {route.satisfaction}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Efficiency</p>
                    <p className="font-medium">{Math.round((route.students / 55) * 100)}%</p>
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${route.onTimeRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Incident Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Analysis</CardTitle>
            <CardDescription>Types and frequency of transport incidents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidentData.map((incident, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{incident.type}</p>
                  <p className="text-sm text-muted-foreground">{incident.count} incidents this month</p>
                </div>
                <Badge variant={incident.trend.startsWith('+') ? "destructive" : incident.trend.startsWith('-') ? "default" : "outline"}>
                  {incident.trend} from last month
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Recommendations</CardTitle>
            <CardDescription>Data-driven recommendations for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-green-50">
                <h3 className="font-semibold text-green-900">Route 3 Excellence</h3>
                <p className="text-sm text-green-700">Best performing route with 98% on-time rate</p>
                <p className="text-xs text-green-600 mt-1">Consider applying Route 3 practices to other routes</p>
              </div>
              
              <div className="p-3 border rounded-lg bg-orange-50">
                <h3 className="font-semibold text-orange-900">Route 2 Optimization</h3>
                <p className="text-sm text-orange-700">Highest delay rate at 4.5 minutes average</p>
                <p className="text-xs text-orange-600 mt-1">Review route timing and potential bottlenecks</p>
              </div>
              
              <div className="p-3 border rounded-lg bg-blue-50">
                <h3 className="font-semibold text-blue-900">Cost Efficiency</h3>
                <p className="text-sm text-blue-700">Fuel costs increased 8% this month</p>
                <p className="text-xs text-blue-600 mt-1">Consider route optimization to reduce fuel consumption</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parent Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle>Parent Satisfaction Survey</CardTitle>
          <CardDescription>Feedback from parents on transport services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-green-600">4.7</p>
              <p className="text-sm text-muted-foreground">Overall Satisfaction</p>
              <p className="text-xs">Based on 234 responses</p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Punctuality</span>
                  <span>4.8/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Safety</span>
                  <span>4.9/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "98%" }} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Communication</span>
                  <span>4.5/5</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Recent Comments</p>
              <div className="space-y-2 text-xs">
                <p className="p-2 bg-gray-50 rounded">"Very reliable service, my child always arrives on time"</p>
                <p className="p-2 bg-gray-50 rounded">"Drivers are very friendly and professional"</p>
                <p className="p-2 bg-gray-50 rounded">"Good communication about delays"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}