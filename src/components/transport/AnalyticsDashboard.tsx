import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransportAnalytics } from "@/hooks/useTransportAnalytics";
import { Bus, Users, Clock, DollarSign, Fuel, AlertTriangle, MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsDashboard() {
  const { summaryMetrics, analytics, isLoading } = useTransportAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Trips",
      value: summaryMetrics.totalTrips.toLocaleString(),
      description: `${summaryMetrics.completedTrips} completed`,
      icon: Bus,
      color: "text-blue-500",
    },
    {
      title: "Students Transported",
      value: summaryMetrics.totalStudentsTransported.toLocaleString(),
      description: "Total ridership",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "On-Time Rate",
      value: `${summaryMetrics.onTimePercentage.toFixed(1)}%`,
      description: "Average punctuality",
      icon: Clock,
      color: "text-purple-500",
    },
    {
      title: "Total Cost",
      value: `$${summaryMetrics.totalCost.toLocaleString()}`,
      description: "All transport expenses",
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Distance Covered",
      value: `${summaryMetrics.totalDistance.toFixed(0)} km`,
      description: "Total kilometers traveled",
      icon: MapPin,
      color: "text-indigo-500",
    },
    {
      title: "Fuel Efficiency",
      value: `${summaryMetrics.averageFuelEfficiency.toFixed(1)} km/L`,
      description: "Average consumption",
      icon: Fuel,
      color: "text-orange-500",
    },
    {
      title: "Incidents",
      value: summaryMetrics.incidentsCount.toString(),
      description: "Total incidents reported",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Efficiency Score",
      value: analytics.length > 0 ? "85%" : "N/A",
      description: "Overall performance",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {analytics.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Analytics data will be populated automatically as trips are completed 
              and operations data is recorded.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
