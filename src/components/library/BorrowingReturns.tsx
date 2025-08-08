import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode, Scan, BookOpen, Calendar, User, AlertTriangle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function BorrowingReturns() {
  const [scanMode, setScanMode] = useState<"borrow" | "return" | null>(null);
  const [studentId, setStudentId] = useState("");
  const [bookIsbn, setBookIsbn] = useState("");

  const currentBorrowings = [
    {
      id: "1",
      studentName: "Emma Watson",
      studentId: "ST001",
      bookTitle: "To Kill a Mockingbird",
      isbn: "978-0-06-112008-4",
      borrowDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Active",
      daysLeft: 5
    },
    {
      id: "2",
      studentName: "John Smith",
      studentId: "ST002",
      bookTitle: "The Hunger Games",
      isbn: "978-0-439-02348-1",
      borrowDate: "2024-01-10",
      dueDate: "2024-02-10",
      status: "Overdue",
      daysLeft: -3
    },
    {
      id: "3",
      studentName: "Sarah Johnson",
      studentId: "ST003",
      bookTitle: "Wonder",
      isbn: "978-0-375-86902-0",
      borrowDate: "2024-01-20",
      dueDate: "2024-02-20",
      status: "Active",
      daysLeft: 10
    }
  ];

  const recentReturns = [
    {
      id: "1",
      studentName: "Mike Brown",
      bookTitle: "Harry Potter and the Philosopher's Stone",
      returnDate: "2024-01-25",
      condition: "Good",
      fine: 0
    },
    {
      id: "2",
      studentName: "Lisa Davis",
      bookTitle: "The Great Gatsby",
      returnDate: "2024-01-24",
      condition: "Fair",
      fine: 2.50
    }
  ];

  const getStatusBadge = (status: string, daysLeft: number) => {
    if (status === "Overdue") {
      return <Badge variant="destructive">Overdue ({Math.abs(daysLeft)} days)</Badge>;
    }
    if (daysLeft <= 3) {
      return <Badge variant="secondary">Due Soon ({daysLeft} days)</Badge>;
    }
    return <Badge variant="default">Active ({daysLeft} days left)</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <QrCode className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Quick Checkout</h3>
                  <p className="text-sm text-muted-foreground">Scan student & book</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Checkout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter or scan student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                  <Button variant="outline" size="icon">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Book ISBN</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter or scan book ISBN" value={bookIsbn} onChange={(e) => setBookIsbn(e.target.value)} />
                  <Button variant="outline" size="icon">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full">Process Checkout</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                  <h3 className="font-semibold">Quick Return</h3>
                  <p className="text-sm text-muted-foreground">Return books easily</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Return</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Book ISBN or Student ID</Label>
                <div className="flex gap-2">
                  <Input placeholder="Scan book or enter student ID" />
                  <Button variant="outline" size="icon">
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full">Process Return</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto text-orange-600" />
              <h3 className="font-semibold">Overdue Items</h3>
              <p className="text-sm text-muted-foreground">3 items overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Borrowings</TabsTrigger>
          <TabsTrigger value="returns">Recent Returns</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Items</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Borrowings</CardTitle>
              <CardDescription>Books currently borrowed by students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBorrowings.map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{borrowing.studentName}</p>
                          <p className="text-sm text-muted-foreground">{borrowing.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{borrowing.bookTitle}</p>
                          <p className="text-sm text-muted-foreground">{borrowing.isbn}</p>
                        </div>
                      </TableCell>
                      <TableCell>{borrowing.borrowDate}</TableCell>
                      <TableCell>{borrowing.dueDate}</TableCell>
                      <TableCell>
                        {getStatusBadge(borrowing.status, borrowing.daysLeft)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => console.log(`Renew ${borrowing.bookTitle} for ${borrowing.studentName}`)}>Renew</Button>
                          <Button variant="outline" size="sm" onClick={() => console.log(`Return ${borrowing.bookTitle} from ${borrowing.studentName}`)}>Return</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Recent Returns</CardTitle>
              <CardDescription>Books returned in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReturns.map((return_item) => (
                    <TableRow key={return_item.id}>
                      <TableCell className="font-medium">{return_item.studentName}</TableCell>
                      <TableCell>{return_item.bookTitle}</TableCell>
                      <TableCell>{return_item.returnDate}</TableCell>
                      <TableCell>
                        <Badge variant={return_item.condition === "Good" ? "default" : "secondary"}>
                          {return_item.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {return_item.fine > 0 ? (
                          <Badge variant="destructive">£{return_item.fine}</Badge>
                        ) : (
                          <Badge variant="default">No Fine</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Items</CardTitle>
              <CardDescription>Books that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBorrowings.filter(b => b.status === "Overdue").map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{borrowing.studentName}</p>
                          <p className="text-sm text-muted-foreground">{borrowing.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{borrowing.bookTitle}</TableCell>
                      <TableCell>{borrowing.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{Math.abs(borrowing.daysLeft)} days</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">£{Math.abs(borrowing.daysLeft) * 0.50}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => console.log(`Send reminder to ${borrowing.studentName}`)}>Send Reminder</Button>
                          <Button variant="outline" size="sm" onClick={() => console.log(`Contact parent of ${borrowing.studentName}`)}>Contact Parent</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}