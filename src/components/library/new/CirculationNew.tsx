import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  BookOpen, 
  RotateCcw, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { format, addDays, differenceInDays } from "date-fns";
import type { LibraryCirculation, LibraryBookCopy, LibraryMember } from "@/types/library";

export function CirculationNew() {
  const { 
    bookCopies, 
    members, 
    circulations, 
    settings,
    issueBook, 
    returnBook, 
    renewBook,
    isLoading 
  } = useLibraryData();

  const [activeTab, setActiveTab] = useState("issue");
  const [searchAccession, setSearchAccession] = useState("");
  const [searchMember, setSearchMember] = useState("");
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  
  // Selected items for operations
  const [selectedCopy, setSelectedCopy] = useState<LibraryBookCopy | null>(null);
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);
  const [selectedCirculation, setSelectedCirculation] = useState<LibraryCirculation | null>(null);
  const [returnCondition, setReturnCondition] = useState("Good");
  const [returnRemarks, setReturnRemarks] = useState("");

  // Get active circulations (currently issued)
  const activeCirculations = circulations.filter(c => c.status === 'issued');
  const overdueCirculations = activeCirculations.filter(c => new Date(c.due_date) < new Date());
  const recentReturns = circulations.filter(c => c.status === 'returned').slice(0, 20);

  // Search for book by accession number
  const findBookByAccession = () => {
    const accNum = parseInt(searchAccession);
    if (isNaN(accNum)) return;
    
    const copy = bookCopies.find(c => c.accession_number === accNum);
    if (copy) {
      if (copy.status !== 'available') {
        // Check if it's for return
        const circ = activeCirculations.find(c => c.copy_id === copy.id);
        if (circ) {
          setSelectedCirculation(circ);
          setShowReturnDialog(true);
          return;
        }
      }
      setSelectedCopy(copy);
      setShowIssueDialog(true);
    }
  };

  // Filter available members
  const availableMembers = members.filter(m => 
    m.is_active && 
    !m.is_blocked &&
    (m.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
     m.admission_number?.toLowerCase().includes(searchMember.toLowerCase()) ||
     m.staff_id?.toLowerCase().includes(searchMember.toLowerCase()))
  );

  const handleIssue = async () => {
    if (!selectedCopy || !selectedMember) return;
    
    const loanDays = selectedMember.member_type === 'student'
      ? (settings?.student_loan_days || 14)
      : (settings?.staff_loan_days || 30);
    
    const dueDate = format(addDays(new Date(), loanDays), 'yyyy-MM-dd');
    
    await issueBook(selectedCopy.id, selectedMember.id, dueDate);
    
    setShowIssueDialog(false);
    setSelectedCopy(null);
    setSelectedMember(null);
    setSearchAccession("");
    setSearchMember("");
  };

  const handleReturn = async () => {
    if (!selectedCirculation) return;
    
    await returnBook(selectedCirculation.id, returnCondition, returnRemarks);
    
    setShowReturnDialog(false);
    setSelectedCirculation(null);
    setReturnCondition("Good");
    setReturnRemarks("");
    setSearchAccession("");
  };

  const handleRenew = async (circulationId: string) => {
    await renewBook(circulationId);
  };

  const getOverdueDays = (dueDate: string) => {
    const days = differenceInDays(new Date(), new Date(dueDate));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("issue")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Quick Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Accession Number"
                value={searchAccession}
                onChange={(e) => setSearchAccession(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && findBookByAccession()}
              />
              <Button onClick={findBookByAccession}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Currently Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeCirculations.length}</p>
            <p className="text-sm text-muted-foreground">books with members</p>
          </CardContent>
        </Card>

        <Card className={overdueCirculations.length > 0 ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className={`h-5 w-5 ${overdueCirculations.length > 0 ? 'text-destructive' : ''}`} />
              Overdue Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overdueCirculations.length}</p>
            <p className="text-sm text-muted-foreground">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="issue">Issue Books</TabsTrigger>
          <TabsTrigger value="current">Current Issues ({activeCirculations.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueCirculations.length})</TabsTrigger>
          <TabsTrigger value="returns">Recent Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="issue">
          <Card>
            <CardHeader>
              <CardTitle>Issue Book to Member</CardTitle>
              <CardDescription>Enter accession number or scan barcode to issue a book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Search Book (Accession Number)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Enter Accession Number"
                      value={searchAccession}
                      onChange={(e) => setSearchAccession(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && findBookByAccession()}
                    />
                    <Button onClick={findBookByAccession}>Find</Button>
                  </div>
                </div>
              </div>

              {/* Available Books Table */}
              <div>
                <h4 className="font-medium mb-2">Available Books</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acc. No.</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Call Number</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookCopies.filter(c => c.status === 'available' && !c.is_reference).slice(0, 10).map((copy) => (
                      <TableRow key={copy.id}>
                        <TableCell>
                          <code className="font-mono font-bold">{copy.accession_number}</code>
                        </TableCell>
                        <TableCell>{copy.book_title?.title || "Unknown"}</TableCell>
                        <TableCell><code className="text-xs">{copy.call_number}</code></TableCell>
                        <TableCell>{copy.rack?.rack_name || "-"}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedCopy(copy);
                              setShowIssueDialog(true);
                            }}
                          >
                            Issue
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Currently Issued Books</CardTitle>
              <CardDescription>All books currently with members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc. No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCirculations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No books currently issued
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeCirculations.map((circ) => {
                      const isOverdue = new Date(circ.due_date) < new Date();
                      const daysOverdue = getOverdueDays(circ.due_date);
                      
                      return (
                        <TableRow key={circ.id} className={isOverdue ? "bg-destructive/5" : ""}>
                          <TableCell>
                            <code className="font-mono font-bold">{circ.book_copy?.accession_number}</code>
                          </TableCell>
                          <TableCell>{circ.book_copy?.book_title?.title || "Unknown"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{circ.member?.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {circ.member?.member_type === 'student' 
                                  ? circ.member?.class_name 
                                  : circ.member?.department}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(circ.issue_date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>{format(new Date(circ.due_date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="destructive">{daysOverdue} days overdue</Badge>
                            ) : (
                              <Badge variant="outline">Due in {Math.abs(differenceInDays(new Date(), new Date(circ.due_date)))} days</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedCirculation(circ);
                                  setShowReturnDialog(true);
                                }}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Return
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRenew(circ.id)}
                                disabled={circ.renewal_count >= (circ.member?.member_type === 'student' 
                                  ? (settings?.student_max_renewals || 1)
                                  : (settings?.staff_max_renewals || 2))}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Renew
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Overdue Books
              </CardTitle>
              <CardDescription>Books past their due date requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc. No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Overdue</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueCirculations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        No overdue books!
                      </TableCell>
                    </TableRow>
                  ) : (
                    overdueCirculations.map((circ) => {
                      const daysOverdue = getOverdueDays(circ.due_date);
                      const finePerDay = circ.member?.member_type === 'student'
                        ? (settings?.student_fine_per_day || 1)
                        : (settings?.staff_fine_per_day || 0);
                      const estimatedFine = daysOverdue * finePerDay;
                      
                      return (
                        <TableRow key={circ.id} className="bg-destructive/5">
                          <TableCell>
                            <code className="font-mono font-bold">{circ.book_copy?.accession_number}</code>
                          </TableCell>
                          <TableCell>{circ.book_copy?.book_title?.title || "Unknown"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{circ.member?.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {circ.member?.phone || circ.member?.email || "No contact"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(circ.due_date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{daysOverdue} days</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-destructive">₹{estimatedFine.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedCirculation(circ);
                                setShowReturnDialog(true);
                              }}
                            >
                              Process Return
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Recent Returns</CardTitle>
              <CardDescription>Books returned recently</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc. No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReturns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No recent returns
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentReturns.map((circ) => (
                      <TableRow key={circ.id}>
                        <TableCell>
                          <code className="font-mono">{circ.book_copy?.accession_number}</code>
                        </TableCell>
                        <TableCell>{circ.book_copy?.book_title?.title || "Unknown"}</TableCell>
                        <TableCell>{circ.member?.full_name}</TableCell>
                        <TableCell>{format(new Date(circ.issue_date), 'dd MMM')}</TableCell>
                        <TableCell>{circ.return_date && format(new Date(circ.return_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>
                          {circ.fine_amount && circ.fine_amount > 0 ? (
                            <Badge variant={circ.fine_paid ? "secondary" : "destructive"}>
                              ₹{circ.fine_amount} {circ.fine_paid ? '(Paid)' : ''}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{circ.return_condition || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Issue Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
            <DialogDescription>Select a member to issue this book to</DialogDescription>
          </DialogHeader>
          
          {selectedCopy && (
            <div className="p-4 bg-muted rounded-lg mb-4">
              <p className="font-medium">{selectedCopy.book_title?.title}</p>
              <p className="text-sm text-muted-foreground">
                Accession #{selectedCopy.accession_number} • {selectedCopy.call_number}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label>Search Member</Label>
              <Input
                placeholder="Search by name, admission no, or staff ID"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
            </div>

            {searchMember && (
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {availableMembers.slice(0, 10).map((member) => {
                  const maxBooks = member.member_type === 'student'
                    ? (settings?.student_max_books || 2)
                    : (settings?.staff_max_books || 5);
                  const canBorrow = member.current_borrowed < maxBooks;

                  return (
                    <div
                      key={member.id}
                      className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted ${
                        selectedMember?.id === member.id ? 'bg-primary/10' : ''
                      } ${!canBorrow ? 'opacity-50' : ''}`}
                      onClick={() => canBorrow && setSelectedMember(member)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.member_type === 'student' 
                              ? `${member.class_name} • ${member.admission_number}`
                              : `${member.department} • ${member.staff_id}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={canBorrow ? "outline" : "destructive"}>
                            {member.current_borrowed}/{maxBooks} books
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedMember && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="font-medium text-green-800 dark:text-green-200">
                  Selected: {selectedMember.full_name}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Due date: {format(addDays(new Date(), 
                    selectedMember.member_type === 'student' 
                      ? (settings?.student_loan_days || 14)
                      : (settings?.staff_loan_days || 30)
                  ), 'dd MMM yyyy')}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowIssueDialog(false);
              setSelectedCopy(null);
              setSelectedMember(null);
              setSearchMember("");
            }}>
              Cancel
            </Button>
            <Button onClick={handleIssue} disabled={!selectedCopy || !selectedMember}>
              Issue Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>Process book return</DialogDescription>
          </DialogHeader>
          
          {selectedCirculation && (
            <>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedCirculation.book_copy?.book_title?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Accession #{selectedCirculation.book_copy?.accession_number}
                </p>
                <p className="text-sm mt-2">
                  Borrowed by: <span className="font-medium">{selectedCirculation.member?.full_name}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Issue: {format(new Date(selectedCirculation.issue_date), 'dd MMM yyyy')} • 
                  Due: {format(new Date(selectedCirculation.due_date), 'dd MMM yyyy')}
                </p>
              </div>

              {getOverdueDays(selectedCirculation.due_date) > 0 && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="font-medium text-destructive">Overdue Fine</p>
                  <p className="text-sm">
                    {getOverdueDays(selectedCirculation.due_date)} days × ₹
                    {selectedCirculation.member?.member_type === 'student'
                      ? (settings?.student_fine_per_day || 1)
                      : (settings?.staff_fine_per_day || 0)} = 
                    <span className="font-bold"> ₹
                      {(getOverdueDays(selectedCirculation.due_date) * 
                        (selectedCirculation.member?.member_type === 'student'
                          ? (settings?.student_fine_per_day || 1)
                          : (settings?.staff_fine_per_day || 0))).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label>Book Condition</Label>
                  <Select value={returnCondition} onValueChange={setReturnCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Remarks</Label>
                  <Textarea
                    value={returnRemarks}
                    onChange={(e) => setReturnRemarks(e.target.value)}
                    placeholder="Optional remarks about the return"
                    rows={2}
                  />
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowReturnDialog(false);
              setSelectedCirculation(null);
              setReturnCondition("Good");
              setReturnRemarks("");
            }}>
              Cancel
            </Button>
            <Button onClick={handleReturn}>
              Process Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
