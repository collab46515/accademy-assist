import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PoundSterling, AlertTriangle, CheckCircle, Clock, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LibraryFines() {
  const outstandingFines = [
    {
      id: "1",
      studentName: "John Smith",
      studentId: "ST002",
      bookTitle: "The Hunger Games",
      fineType: "Overdue",
      amount: 5.50,
      daysOverdue: 11,
      dateIncurred: "2024-01-15",
      status: "Outstanding"
    },
    {
      id: "2",
      studentName: "Mike Brown",
      studentId: "ST004",
      bookTitle: "Wonder",
      fineType: "Damage",
      amount: 15.00,
      daysOverdue: 0,
      dateIncurred: "2024-01-20",
      status: "Outstanding"
    },
    {
      id: "3",
      studentName: "Lisa Davis",
      studentId: "ST005",
      bookTitle: "To Kill a Mockingbird",
      fineType: "Lost Book",
      amount: 25.00,
      daysOverdue: 0,
      dateIncurred: "2024-01-18",
      status: "Outstanding"
    }
  ];

  const paidFines = [
    {
      id: "1",
      studentName: "Emma Watson",
      studentId: "ST001",
      bookTitle: "The Great Gatsby",
      fineType: "Overdue",
      amount: 3.00,
      paidDate: "2024-01-22",
      paymentMethod: "Cash"
    },
    {
      id: "2",
      studentName: "Sarah Johnson",
      studentId: "ST003",
      bookTitle: "Harry Potter",
      fineType: "Overdue",
      amount: 2.50,
      paidDate: "2024-01-21",
      paymentMethod: "Card"
    }
  ];

  const fineSettings = {
    overdueDaily: 0.50,
    damageMinimum: 5.00,
    lostBookReplacement: 100, // percentage of book price
    maxOverdueFine: 20.00,
    gracePeriodDays: 2
  };

  const getFineTypeBadge = (type: string) => {
    switch (type) {
      case "Overdue":
        return <Badge variant="secondary">Overdue</Badge>;
      case "Damage":
        return <Badge variant="destructive">Damage</Badge>;
      case "Lost Book":
        return <Badge variant="destructive">Lost Book</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const totalOutstanding = outstandingFines.reduce((sum, fine) => sum + fine.amount, 0);
  const totalPaidThisMonth = paidFines.reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <PoundSterling className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">£{totalOutstanding.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">£{totalPaidThisMonth.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Paid This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{outstandingFines.length}</p>
              <p className="text-sm text-muted-foreground">Active Fines</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Overdue {'>'}7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="outstanding" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="outstanding">Outstanding Fines</TabsTrigger>
            <TabsTrigger value="paid">Payment History</TabsTrigger>
            <TabsTrigger value="settings">Fine Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => console.log("Send reminders clicked")}>Send Reminders</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Record Payment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Fine Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <Input placeholder="Enter student ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select className="w-full p-2 border rounded">
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Payment notes..." />
                  </div>
                  <Button className="w-full" onClick={() => console.log("Record payment clicked")}>Record Payment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="outstanding">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Fines</CardTitle>
              <CardDescription>Fines awaiting payment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book/Item</TableHead>
                    <TableHead>Fine Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date Incurred</TableHead>
                    <TableHead>Days Outstanding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{fine.studentName}</p>
                          <p className="text-sm text-muted-foreground">{fine.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{fine.bookTitle}</TableCell>
                      <TableCell>{getFineTypeBadge(fine.fineType)}</TableCell>
                      <TableCell className="font-medium">£{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{fine.dateIncurred}</TableCell>
                      <TableCell>
                        <Badge variant={fine.daysOverdue > 14 ? "destructive" : "secondary"}>
                          {Math.floor((new Date().getTime() - new Date(fine.dateIncurred).getTime()) / (1000 * 3600 * 24))} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => console.log(`Show receipt for ${fine.studentName}`)}>
                            <Receipt className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => console.log(`Pay fine for ${fine.studentName}`)}>Pay Now</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recently paid fines</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Book/Item</TableHead>
                    <TableHead>Fine Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidFines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{fine.studentName}</p>
                          <p className="text-sm text-muted-foreground">{fine.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{fine.bookTitle}</TableCell>
                      <TableCell>{getFineTypeBadge(fine.fineType)}</TableCell>
                      <TableCell className="font-medium">£{fine.amount.toFixed(2)}</TableCell>
                      <TableCell>{fine.paidDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{fine.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => console.log(`Show receipt for ${fine.studentName}`)}>
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fine Structure</CardTitle>
                <CardDescription>Configure fine amounts and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Daily Overdue Fine</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={fineSettings.overdueDaily} 
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Amount charged per day for overdue items</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Overdue Fine</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={fineSettings.maxOverdueFine} 
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Maximum fine amount for overdue items</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Grace Period (Days)</Label>
                  <Input 
                    type="number" 
                    value={fineSettings.gracePeriodDays} 
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Days before fines start accruing</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Minimum Damage Fine</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={fineSettings.damageMinimum} 
                    className="w-full"
                  />
                </div>
                
                <Button className="w-full" onClick={() => console.log("Update fine settings clicked")}>Update Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Cash Payments</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Card Payments</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Online Payments</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Bank Transfer</Label>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Textarea 
                    placeholder="Payment terms and conditions..."
                    value="Payment must be made within 30 days. Continued library privileges may be suspended for outstanding fines over £20."
                  />
                </div>
                
                <Button className="w-full" onClick={() => console.log("Save payment settings clicked")}>Save Payment Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}