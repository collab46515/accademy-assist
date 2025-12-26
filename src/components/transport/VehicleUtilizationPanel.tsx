import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransportAnalytics } from "@/hooks/useTransportAnalytics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Bus, Clock, Fuel, Wrench, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function VehicleUtilizationPanel() {
  const { vehicleUtilization, isLoading } = useTransportAnalytics();

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

  const totalVehicles = vehicleUtilization.length;
  const avgUtilization = totalVehicles > 0
    ? vehicleUtilization.reduce((sum, v) => sum + v.utilization_percentage, 0) / totalVehicles
    : 0;
  const avgOccupancy = totalVehicles > 0
    ? vehicleUtilization.reduce((sum, v) => sum + v.occupancy_rate, 0) / totalVehicles
    : 0;
  const totalFuelCost = vehicleUtilization.reduce((sum, v) => sum + v.fuel_cost, 0);
  const totalMaintenanceCost = vehicleUtilization.reduce((sum, v) => sum + v.maintenance_cost, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUtilization.toFixed(1)}%</div>
            <Progress value={avgUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy.toFixed(1)}%</div>
            <Progress value={avgOccupancy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Cost</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFuelCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenanceCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Vehicle Utilization Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleUtilization.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Utilization Data</h3>
              <p className="text-muted-foreground text-center">
                Vehicle utilization metrics will appear here as trips are completed.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Hours Used</TableHead>
                  <TableHead>Distance (km)</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Fuel Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleUtilization.map((util) => (
                  <TableRow key={util.id}>
                    <TableCell className="font-medium">
                      {util.vehicle_id?.slice(0, 8) || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {new Date(util.report_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{util.trips_count}</TableCell>
                    <TableCell>{util.total_hours_used.toFixed(1)}h</TableCell>
                    <TableCell>{util.total_distance_km.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={util.utilization_percentage} className="w-16" />
                        <span className="text-sm">{util.utilization_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={util.occupancy_rate} className="w-16" />
                        <span className="text-sm">{util.occupancy_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>${util.fuel_cost.toFixed(2)}</TableCell>
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
