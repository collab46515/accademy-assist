import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Bot, 
  Brain,
  Sparkles,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle,
  Zap,
  Target
} from "lucide-react";

interface AIFeature {
  id: string;
  name: string;
  description: string;
  category: "comments" | "scheduling" | "analytics" | "communication";
  status: "active" | "beta" | "coming-soon";
  usageCount: number;
  accuracy: number;
}

interface GeneratedComment {
  id: string;
  studentName: string;
  subject: string;
  generatedText: string;
  status: "generated" | "approved" | "edited";
  confidence: number;
  timestamp: string;
}

interface PredictiveInsight {
  id: string;
  type: "attendance" | "performance" | "behaviour";
  title: string;
  prediction: string;
  confidence: number;
  actionRequired: boolean;
  affectedStudents: number;
}

const mockAIFeatures: AIFeature[] = [
  {
    id: "1",
    name: "Comment Generator",
    description: "Generate personalized student comments for reports",
    category: "comments",
    status: "active",
    usageCount: 247,
    accuracy: 94.2
  },
  {
    id: "2",
    name: "Smart Scheduling",
    description: "AI-powered timetable optimization",
    category: "scheduling",
    status: "beta",
    usageCount: 56,
    accuracy: 87.5
  },
  {
    id: "3",
    name: "Predictive Analytics",
    description: "Early warning system for at-risk students",
    category: "analytics",
    status: "active",
    usageCount: 189,
    accuracy: 91.8
  },
  {
    id: "4",
    name: "Auto-Response",
    description: "Automated parent inquiry responses",
    category: "communication",
    status: "coming-soon",
    usageCount: 0,
    accuracy: 0
  }
];

const mockComments: GeneratedComment[] = [
  {
    id: "1",
    studentName: "Emma Thompson",
    subject: "Mathematics",
    generatedText: "Emma has shown excellent progress in algebra this term. Her problem-solving skills have improved significantly, and she demonstrates strong analytical thinking. She actively participates in class discussions and helps her peers understand complex concepts.",
    status: "approved",
    confidence: 94,
    timestamp: "2024-01-15 14:30"
  },
  {
    id: "2",
    studentName: "James Wilson",
    subject: "English Literature",
    generatedText: "James has made good progress in his essay writing this term. His analysis of character development has improved, though he would benefit from more detailed textual evidence in his arguments. His creative writing shows imagination and flair.",
    status: "edited",
    confidence: 89,
    timestamp: "2024-01-15 15:45"
  }
];

const mockInsights: PredictiveInsight[] = [
  {
    id: "1",
    type: "attendance",
    title: "Attendance Drop Prediction",
    prediction: "15 Year 9 students likely to have attendance issues in next 2 weeks",
    confidence: 87,
    actionRequired: true,
    affectedStudents: 15
  },
  {
    id: "2",
    type: "performance",
    title: "Grade Decline Alert",
    prediction: "8 students in Year 11 Mathematics at risk of grade drop",
    confidence: 92,
    actionRequired: true,
    affectedStudents: 8
  },
  {
    id: "3",
    type: "behaviour",
    title: "Behavioral Pattern Detection",
    prediction: "Increased disruption likely during Friday Period 5 classes",
    confidence: 76,
    actionRequired: false,
    affectedStudents: 0
  }
];

const AISuitePage = () => {
  const [features] = useState(mockAIFeatures);
  const [comments] = useState(mockComments);
  const [insights] = useState(mockInsights);
  const [commentPrompt, setCommentPrompt] = useState("");

  const getStatusBadge = (status: AIFeature["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "beta":
        return <Badge className="bg-warning text-warning-foreground"><Sparkles className="h-3 w-3 mr-1" />Beta</Badge>;
      case "coming-soon":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Coming Soon</Badge>;
    }
  };

  const getCategoryIcon = (category: AIFeature["category"]) => {
    switch (category) {
      case "comments":
        return <FileText className="h-4 w-4" />;
      case "scheduling":
        return <Calendar className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      case "communication":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCommentStatusBadge = (status: GeneratedComment["status"]) => {
    switch (status) {
      case "generated":
        return <Badge variant="secondary">Generated</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "edited":
        return <Badge className="bg-warning text-warning-foreground">Edited</Badge>;
    }
  };

  const getInsightIcon = (type: PredictiveInsight["type"]) => {
    switch (type) {
      case "attendance":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "performance":
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case "behaviour":
        return <Target className="h-4 w-4 text-purple-500" />;
    }
  };

  const activeFeatures = features.filter(f => f.status === "active").length;
  const totalUsage = features.reduce((sum, f) => sum + f.usageCount, 0);
  const avgAccuracy = Math.round(features.filter(f => f.accuracy > 0).reduce((sum, f) => sum + f.accuracy, 0) / features.filter(f => f.accuracy > 0).length);
  const criticalInsights = insights.filter(i => i.actionRequired).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Bot className="h-8 w-8 text-primary" />
          <span>AI & Automation Suite</span>
          <Badge className="bg-warning text-warning-foreground">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">Smart features with AI-generated comments, predictive analytics, and automated scheduling</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Features</p>
                <p className="text-3xl font-bold text-primary">{activeFeatures}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-3xl font-bold text-success">{totalUsage}</p>
              </div>
              <Bot className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold text-primary">{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Insights</p>
                <p className="text-3xl font-bold text-destructive">{criticalInsights}</p>
              </div>
              <Brain className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">AI Features</TabsTrigger>
          <TabsTrigger value="comments">Comment Generator</TabsTrigger>
          <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Feature Overview</span>
              </CardTitle>
              <CardDescription>Manage and monitor AI-powered automation features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(feature.category)}
                            <span className="capitalize">{feature.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">{feature.description}</TableCell>
                        <TableCell>{feature.usageCount}</TableCell>
                        <TableCell>
                          {feature.accuracy > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span>{feature.accuracy}%</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 bg-primary rounded-full"
                                  style={{ width: `${feature.accuracy}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(feature.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled={feature.status === "coming-soon"}>
                            {feature.status === "coming-soon" ? "Unavailable" : "Configure"}
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

        <TabsContent value="comments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Generate Comment</span>
                </CardTitle>
                <CardDescription>AI-powered student comment generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Comment prompt:</label>
                  <Textarea
                    placeholder="Enter details about the student's performance, behavior, or achievements..."
                    value={commentPrompt}
                    onChange={(e) => setCommentPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button className="w-full shadow-[var(--shadow-elegant)]">
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Comment
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Recent Comments</span>
                </CardTitle>
                <CardDescription>AI-generated comments awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.studentName}</p>
                          <p className="text-sm text-muted-foreground">{comment.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{comment.confidence}%</span>
                          {getCommentStatusBadge(comment.status)}
                        </div>
                      </div>
                      <p className="text-sm">{comment.generatedText}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Predictive Insights</span>
              </CardTitle>
              <CardDescription>AI-powered early warning system and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Insight</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Affected Students</TableHead>
                      <TableHead>Action Required</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights.map((insight) => (
                      <TableRow key={insight.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getInsightIcon(insight.type)}
                            <span className="capitalize">{insight.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{insight.title}</TableCell>
                        <TableCell className="max-w-xs">{insight.prediction}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{insight.confidence}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${insight.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {insight.affectedStudents > 0 ? insight.affectedStudents : "-"}
                        </TableCell>
                        <TableCell>
                          {insight.actionRequired ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            {insight.actionRequired ? "Take Action" : "View Details"}
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

        <TabsContent value="settings">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Configuration</span>
              </CardTitle>
              <CardDescription>Configure AI models and automation settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Settings</h3>
                <p className="text-muted-foreground">Advanced AI configuration and model training settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISuitePage;