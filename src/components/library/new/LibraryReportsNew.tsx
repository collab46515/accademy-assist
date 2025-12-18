import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Printer, 
  BookOpen, 
  Users, 
  DollarSign,
  Archive,
  Calendar,
  ClipboardList
} from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { format } from "date-fns";

export function LibraryReportsNew() {
  const { 
    bookTitles, 
    bookCopies, 
    members, 
    circulations, 
    fines,
    purchases,
    donations,
    withdrawals
  } = useLibraryData();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportType, setReportType] = useState("accession");

  const reports = [
    {
      id: "accession",
      name: "Accession Register",
      description: "Complete list of all books with accession numbers",
      icon: BookOpen,
      category: "catalog"
    },
    {
      id: "circulation-student",
      name: "Student Circulation Register",
      description: "Issue/return records for students",
      icon: Users,
      category: "circulation"
    },
    {
      id: "circulation-staff",
      name: "Staff Circulation Register",
      description: "Issue/return records for staff",
      icon: Users,
      category: "circulation"
    },
    {
      id: "overdue",
      name: "Overdue Books Report",
      description: "List of all overdue books",
      icon: Calendar,
      category: "circulation"
    },
    {
      id: "reference",
      name: "Reference Books Register",
      description: "List of non-issuable reference books",
      icon: BookOpen,
      category: "catalog"
    },
    {
      id: "fines",
      name: "Fines & Recovery Register",
      description: "Fine collection and pending dues",
      icon: DollarSign,
      category: "finance"
    },
    {
      id: "purchases",
      name: "Purchase Register",
      description: "Book purchases with vendor details",
      icon: ClipboardList,
      category: "acquisition"
    },
    {
      id: "donations",
      name: "Donation Register",
      description: "Book donations with donor details",
      icon: ClipboardList,
      category: "acquisition"
    },
    {
      id: "withdrawals",
      name: "Withdrawal Register",
      description: "Condemned/withdrawn books",
      icon: Archive,
      category: "compliance"
    },
    {
      id: "stock",
      name: "Stock Verification Report",
      description: "Annual stock check summary",
      icon: ClipboardList,
      category: "compliance"
    },
    {
      id: "shelf-list",
      name: "Shelf List",
      description: "Books arranged by call number",
      icon: Archive,
      category: "catalog"
    },
    {
      id: "member-summary",
      name: "Member Borrowing Summary",
      description: "Borrowing statistics per member",
      icon: Users,
      category: "circulation"
    }
  ];

  const handleGenerateReport = (reportId: string) => {
    // TODO: Implement actual report generation
    console.log('Generating report:', reportId, { dateFrom, dateTo });
  };

  const categorizedReports = {
    catalog: reports.filter(r => r.category === 'catalog'),
    circulation: reports.filter(r => r.category === 'circulation'),
    acquisition: reports.filter(r => r.category === 'acquisition'),
    finance: reports.filter(r => r.category === 'finance'),
    compliance: reports.filter(r => r.category === 'compliance'),
  };

  // Quick Stats
  const stats = {
    totalBooks: bookCopies.filter(c => c.status !== 'withdrawn').length,
    referenceBooks: bookCopies.filter(c => c.is_reference).length,
    currentlyIssued: circulations.filter(c => c.status === 'issued').length,
    overdue: circulations.filter(c => c.status === 'issued' && new Date(c.due_date) < new Date()).length,
    totalMembers: members.length,
    pendingFines: fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.balance, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Library Reports</h2>
        <p className="text-muted-foreground">Generate and print compliance registers and reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{stats.totalBooks}</p>
            <p className="text-xs text-muted-foreground">Total Books</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{stats.referenceBooks}</p>
            <p className="text-xs text-muted-foreground">Reference</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{stats.currentlyIssued}</p>
            <p className="text-xs text-muted-foreground">Currently Issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{stats.totalMembers}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">₹{stats.pendingFines.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Pending Fines</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => { setDateFrom(""); setDateTo(""); }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports by Category */}
      <Tabs defaultValue="catalog">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="circulation">Circulation</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {Object.entries(categorizedReports).map(([category, categoryReports]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryReports.map((report) => (
                <Card key={report.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <report.icon className="h-5 w-5" />
                      {report.name}
                    </CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleGenerateReport(report.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="icon">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Print-Ready Registers Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print-Ready Registers
          </CardTitle>
          <CardDescription>
            All reports are formatted for A4 printing and match standard library register formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Supported Formats:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>PDF (print-ready A4)</li>
                <li>Excel (.xlsx)</li>
                <li>CSV (data export)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Compliance Ready:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Accession Register (Master)</li>
                <li>Separate Student/Staff Circulation</li>
                <li>Stock Verification Summary</li>
                <li>Withdrawal/Condemnation Records</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
