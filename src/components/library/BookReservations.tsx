import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, BookOpen, Plus, Bell } from "lucide-react";

export function BookReservations() {
  const reservations = [
    {
      id: "1",
      studentName: "Emma Watson",
      studentId: "ST001",
      bookTitle: "The Hunger Games",
      reservedDate: "2024-01-20",
      availableDate: "2024-02-05",
      status: "Active",
      priority: 1,
      notified: true
    },
    {
      id: "2",
      studentName: "John Smith",
      studentId: "ST002",
      bookTitle: "Wonder",
      reservedDate: "2024-01-18",
      availableDate: "2024-02-03",
      status: "Ready",
      priority: 1,
      notified: true
    },
    {
      id: "3",
      studentName: "Sarah Johnson",
      studentId: "ST003",
      bookTitle: "To Kill a Mockingbird",
      reservedDate: "2024-01-22",
      availableDate: "2024-02-10",
      status: "Waiting",
      priority: 2,
      notified: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready":
        return <Badge variant="default" className="bg-green-600">Ready for Pickup</Badge>;
      case "Active":
        return <Badge variant="secondary">In Queue</Badge>;
      case "Waiting":
        return <Badge variant="outline">Waiting</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-muted-foreground">Active Reservations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Ready for Pickup</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <User className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Students in Queue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">3.2</p>
              <p className="text-sm text-muted-foreground">Avg Wait Days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Current Reservations</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Send Notifications
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="st001">Emma Watson (ST001)</SelectItem>
                      <SelectItem value="st002">John Smith (ST002)</SelectItem>
                      <SelectItem value="st003">Sarah Johnson (ST003)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Book</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book1">To Kill a Mockingbird</SelectItem>
                      <SelectItem value="book2">The Hunger Games</SelectItem>
                      <SelectItem value="book3">Wonder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Reservation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Queue</CardTitle>
          <CardDescription>Manage book reservations and waiting lists</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Reserved Date</TableHead>
                <TableHead>Expected Available</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{reservation.studentName}</p>
                      <p className="text-sm text-muted-foreground">{reservation.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{reservation.bookTitle}</TableCell>
                  <TableCell>{reservation.reservedDate}</TableCell>
                  <TableCell>{reservation.availableDate}</TableCell>
                  <TableCell>
                    <Badge variant={reservation.priority === 1 ? "default" : "secondary"}>
                      #{reservation.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {reservation.status === "Ready" ? (
                        <Button size="sm">Process Pickup</Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            {reservation.notified ? "Notified" : "Notify"}
                          </Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reservation Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Reserved Books</CardTitle>
            <CardDescription>Books with highest demand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "The Hunger Games", reservations: 8, waitTime: "5 days" },
              { title: "Wonder", reservations: 6, waitTime: "3 days" },
              { title: "Harry Potter Series", reservations: 5, waitTime: "7 days" },
              { title: "To Kill a Mockingbird", reservations: 4, waitTime: "2 days" }
            ].map((book, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-muted-foreground">Avg wait: {book.waitTime}</p>
                </div>
                <Badge variant="outline">{book.reservations} reservations</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservation Trends</CardTitle>
            <CardDescription>Weekly reservation statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-medium">23 new reservations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fulfilled</span>
                <span className="font-medium text-green-600">18 completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cancelled</span>
                <span className="font-medium text-red-600">2 cancelled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">90%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}