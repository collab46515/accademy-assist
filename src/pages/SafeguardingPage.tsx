import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  Search, 
  Plus,
  AlertTriangle,
  Eye,
  Clock,
  CheckCircle,
  User,
  FileText,
  Lock
} from "lucide-react";

interface SafeguardingRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: "concern" | "incident" | "disclosure" | "referral";
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  reportedBy: string;
  reportedDate: string;
  status: "open" | "investigating" | "resolved" | "escalated";
  assignedTo?: string;
  lastUpdated: string;
}

interface WelfareNote {
  id: string;
  studentId: string;
  studentName: string;
  category: "attendance" | "behaviour" | "health" | "family" | "academic";
  content: string;
  author: string;
  date: string;
  confidential: boolean;
}

interface RiskAssessment {
  id: string;
  studentId: string;
  studentName: string;
  riskLevel: "low" | "medium" | "high";
  factors: string[];
  mitigations: string[];
  reviewDate: string;
  assessedBy: string;
  status: "current" | "under-review" | "expired";
}

const mockRecords: SafeguardingRecord[] = [
  {
    id: "SG-001",
    studentId: "STU001",
    studentName: "Emma Thompson",
    type: "concern",
    priority: "medium",
    description: "Concerns about changes in behaviour and attendance patterns",
    reportedBy: "Mr. Johnson (Form Tutor)",
    reportedDate: "2024-01-15",
    status: "investigating",
    assignedTo: "Mrs. Davis (DSL)",
    lastUpdated: "2024-01-15"
  },
  {
    id: "SG-002",
    studentId: "STU003",
    studentName: "Sophie Chen",
    type: "incident",
    priority: "high",
    description: "Physical altercation during break time requiring intervention",
    reportedBy: "Ms. Williams (Duty Teacher)",
    reportedDate: "2024-01-14",
    status: "resolved",
    assignedTo: "Mrs. Davis (DSL)",
    lastUpdated: "2024-01-14"
  }
];

const mockWelfareNotes: WelfareNote[] = [
  {
    id: "WN-001",
    studentId: "STU001",
    studentName: "Emma Thompson",
    category: "attendance",
    content: "Student has shown improvement in punctuality following parent meeting",
    author: "Mr. Johnson",
    date: "2024-01-15",
    confidential: false
  },
  {
    id: "WN-002",
    studentId: "STU002",
    studentName: "James Wilson",
    category: "family",
    content: "Recent family circumstances may be affecting academic performance",
    author: "Mrs. Davis",
    date: "2024-01-12",
    confidential: true
  }
];

const mockRiskAssessments: RiskAssessment[] = [
  {
    id: "RA-001",
    studentId: "STU001",
    studentName: "Emma Thompson",
    riskLevel: "medium",
    factors: ["Attendance concerns", "Social isolation"],
    mitigations: ["Weekly check-ins", "Peer support buddy"],
    reviewDate: "2024-02-15",
    assessedBy: "Mrs. Davis (DSL)",
    status: "current"
  }
];

const SafeguardingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records] = useState(mockRecords);
  const [welfareNotes] = useState(mockWelfareNotes);
  const [riskAssessments] = useState(mockRiskAssessments);

  const getStatusBadge = (status: SafeguardingRecord["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
      case "investigating":
        return <Badge className="bg-warning text-warning-foreground"><Eye className="h-3 w-3 mr-1" />Investigating</Badge>;
      case "resolved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case "escalated":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Escalated</Badge>;
    }
  };

  const getPriorityBadge = (priority: SafeguardingRecord["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Low</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "high":
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "urgent":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>;
    }
  };

  const getTypeBadge = (type: SafeguardingRecord["type"]) => {
    const colors = {
      concern: "bg-blue-500 text-white",
      incident: "bg-red-500 text-white",
      disclosure: "bg-purple-500 text-white",
      referral: "bg-green-500 text-white"
    };
    
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  const getRiskBadge = (level: RiskAssessment["riskLevel"]) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-500 text-white">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>;
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getCategoryBadge = (category: WelfareNote["category"]) => {
    const colors = {
      attendance: "bg-blue-500 text-white",
      behaviour: "bg-red-500 text-white",
      health: "bg-green-500 text-white",
      family: "bg-purple-500 text-white",
      academic: "bg-orange-500 text-white"
    };
    
    return <Badge className={colors[category]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>;
  };

  const filteredRecords = records.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecords = records.length;
  const openRecords = records.filter(r => r.status === "open" || r.status === "investigating").length;
  const urgentRecords = records.filter(r => r.priority === "urgent").length;
  const highRiskStudents = riskAssessments.filter(r => r.riskLevel === "high").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Safeguarding & Pastoral Care</h1>
        <p className="text-muted-foreground">KCSIE-compliant DSL tools with incident logging, risk assessments, and welfare tracking</p>
      </div>

      {/* Warning Banner */}
      <Card className="mb-8 border-destructive bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-destructive" />
            <span className="text-destructive font-medium">
              Confidential Area - Access restricted to authorized DSL staff only
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold text-primary">{totalRecords}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Cases</p>
                <p className="text-3xl font-bold text-warning">{openRecords}</p>
              </div>
              <Eye className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-3xl font-bold text-destructive">{urgentRecords}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-3xl font-bold text-destructive">{highRiskStudents}</p>
              </div>
              <User className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records">Safeguarding Records</TabsTrigger>
          <TabsTrigger value="welfare">Welfare Notes</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Safeguarding Records</span>
                  </CardTitle>
                  <CardDescription>Log and track safeguarding concerns and incidents</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]" variant="destructive">
                  <Plus className="h-4 w-4 mr-2" />
                  New Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records by student, description, or reporter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.studentName}</TableCell>
                        <TableCell>{getTypeBadge(record.type)}</TableCell>
                        <TableCell>{getPriorityBadge(record.priority)}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                        <TableCell>{record.reportedBy}</TableCell>
                        <TableCell>{record.reportedDate}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welfare">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Welfare Notes</span>
                  </CardTitle>
                  <CardDescription>Track student welfare and pastoral observations</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Confidential</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {welfareNotes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.studentName}</TableCell>
                        <TableCell>{getCategoryBadge(note.category)}</TableCell>
                        <TableCell className="max-w-xs truncate">{note.content}</TableCell>
                        <TableCell>{note.author}</TableCell>
                        <TableCell>{note.date}</TableCell>
                        <TableCell>
                          {note.confidential ? (
                            <Badge variant="destructive"><Lock className="h-3 w-3 mr-1" />Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>Risk Assessments</span>
                  </CardTitle>
                  <CardDescription>Assess and monitor student risk factors</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Risk Factors</TableHead>
                      <TableHead>Mitigations</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Assessed By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riskAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.studentName}</TableCell>
                        <TableCell>{getRiskBadge(assessment.riskLevel)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {assessment.factors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {assessment.mitigations.map((mitigation, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                {mitigation}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{assessment.reviewDate}</TableCell>
                        <TableCell>{assessment.assessedBy}</TableCell>
                        <TableCell>
                          <Badge className={assessment.status === "current" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                            {assessment.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafeguardingPage;