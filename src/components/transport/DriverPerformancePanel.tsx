import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransportAnalytics } from "@/hooks/useTransportAnalytics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star, Shield, Clock, Fuel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DriverPerformancePanel() {
  const { driverPerformance, isLoading } = useTransportAnalytics();

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

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-500">Excellent</Badge>;
    if (rating >= 3.5) return <Badge className="bg-blue-500">Good</Badge>;
    if (rating >= 2.5) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {driverPerformance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
              <p className="text-muted-foreground text-center">
                Driver performance metrics will appear here after trips are completed.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Punctuality</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driverPerformance.map((perf) => (
                  <TableRow key={perf.id}>
                    <TableCell className="font-medium">
                      {perf.driver_id?.slice(0, 8) || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {new Date(perf.period_start).toLocaleDateString()} - {new Date(perf.period_end).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {perf.completed_trips}/{perf.total_trips}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Progress value={perf.punctuality_score} className="w-16" />
                        <span className="text-sm">{perf.punctuality_score}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Progress value={perf.safety_score} className="w-16" />
                        <span className="text-sm">{perf.safety_score}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={perf.checkin_compliance_rate} className="w-16" />
                        <span className="text-sm">{perf.checkin_compliance_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {perf.overall_rating.toFixed(1)}
                        {getRatingBadge(perf.overall_rating)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Punctuality</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverPerformance.length > 0
                ? `${(driverPerformance.reduce((sum, d) => sum + d.punctuality_score, 0) / driverPerformance.length).toFixed(1)}%`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverPerformance.length > 0
                ? `${(driverPerformance.reduce((sum, d) => sum + d.safety_score, 0) / driverPerformance.length).toFixed(1)}%`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverPerformance.length > 0
                ? `${(driverPerformance.reduce((sum, d) => sum + d.fuel_efficiency_score, 0) / driverPerformance.length).toFixed(1)}%`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
