import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Trash2,
  Plus,
  Save,
  Send
} from 'lucide-react';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  currentStage: string;
  status: string;
  yearGroup: string;
  submittedAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'document_upload' | 'verification' | 'assessment' | 'interview' | 'decision' | 'payment';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  applicationId: string;
  stage: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  size: string;
}

const mockApplication: Application = {
  id: '1',
  applicationNumber: 'APP202400001',
  studentName: 'Emma Thompson',
  currentStage: 'enrollment',
  status: 'in_progress',
  yearGroup: 'Year 7',
  submittedAt: '2024-01-15T10:30:00Z'
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Verify Birth Certificate',
    description: 'Review and verify the uploaded birth certificate',
    type: 'verification',
    status: 'pending',
    assignedTo: 'Admissions Officer',
    dueDate: '2024-01-20',
    priority: 'high',
    applicationId: '1',
    stage: 'enrollment'
  },
  {
    id: '2',
    title: 'Upload Medical Forms',
    description: 'Parent needs to upload medical history and immunization records',
    type: 'document_upload',
    status: 'in_progress',
    assignedTo: 'Parent',
    dueDate: '2024-01-22',
    priority: 'medium',
    applicationId: '1',
    stage: 'enrollment'
  },
  {
    id: '3',
    title: 'Schedule Assessment',
    description: 'Schedule academic assessment for student',
    type: 'assessment',
    status: 'pending',
    assignedTo: 'Assessment Coordinator',
    dueDate: '2024-01-25',
    priority: 'medium',
    applicationId: '1',
    stage: 'assessment'
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'birth_certificate.pdf',
    type: 'Birth Certificate',
    uploadedAt: '2024-01-16T09:30:00Z',
    status: 'pending',
    size: '2.1 MB'
  },
  {
    id: '2',
    name: 'previous_school_report.pdf',
    type: 'School Report',
    uploadedAt: '2024-01-16T10:15:00Z',
    status: 'verified',
    size: '1.8 MB'
  }
];

export function ApplicationTaskManager() {
  const [selectedApplication] = useState<Application>(mockApplication);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadFiles(files);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    uploadFiles.forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: 'Document',
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
      setDocuments(prev => [...prev, newDoc]);
    });
    setUploadFiles([]);
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'document_upload': return Upload;
      case 'verification': return Eye;
      case 'assessment': return FileText;
      case 'interview': return User;
      case 'decision': return CheckCircle;
      case 'payment': return DollarSign;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-6">
      {/* Application Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{selectedApplication.studentName}</CardTitle>
              <p className="text-muted-foreground">
                {selectedApplication.applicationNumber} • {selectedApplication.yearGroup}
              </p>
              <Badge className="mt-2" variant="outline">
                Current Stage: {selectedApplication.currentStage}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={progressPercentage} className="w-32" />
                <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTasks} of {totalTasks} tasks complete
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Task Overview</TabsTrigger>
          <TabsTrigger value="documents">Document Management</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Tools</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* Task Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {tasks.map((task) => {
              const TaskIcon = getTaskIcon(task.type);
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-muted rounded-lg">
                          <TaskIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {task.assignedTo}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedTask(task)}
                          >
                            Work on Task
                          </Button>
                        )}
                        {task.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Document Management Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload required documents for the application
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium">Choose files to upload</span>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG files up to 10MB each
                  </p>
                </div>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Files to Upload:</h4>
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                  <Button onClick={handleFileUpload} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Tools Tab */}
        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Conduct and record academic assessments
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assessment-type">Assessment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Assessment</SelectItem>
                      <SelectItem value="written">Written Exam</SelectItem>
                      <SelectItem value="interview">Personal Interview</SelectItem>
                      <SelectItem value="practical">Practical Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assessment-date">Assessment Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="subject-scores">Subject Scores</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="math-score">Mathematics</Label>
                    <Input type="number" placeholder="Score out of 100" />
                  </div>
                  <div>
                    <Label htmlFor="english-score">English</Label>
                    <Input type="number" placeholder="Score out of 100" />
                  </div>
                  <div>
                    <Label htmlFor="science-score">Science</Label>
                    <Input type="number" placeholder="Score out of 100" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="assessment-notes">Assessment Notes</Label>
                <Textarea 
                  placeholder="Enter assessment observations and recommendations..."
                  className="min-h-24"
                />
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Assessment Results
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parent Communication</CardTitle>
              <p className="text-sm text-muted-foreground">
                Send updates and requests to parents
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="message-type">Message Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="update">Status Update</SelectItem>
                    <SelectItem value="request">Document Request</SelectItem>
                    <SelectItem value="schedule">Assessment Scheduling</SelectItem>
                    <SelectItem value="decision">Admission Decision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message-content">Message</Label>
                <Textarea 
                  placeholder="Enter your message to parents..."
                  className="min-h-32"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This message will be sent to: emma.thompson.parent@email.com
                </AlertDescription>
              </Alert>

              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Complete Task: {selectedTask.title}</CardTitle>
              <p className="text-muted-foreground">{selectedTask.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Task Status</Label>
                  <Select defaultValue={selectedTask.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Task Notes</Label>
                  <Textarea 
                    placeholder="Add notes about this task..."
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      handleTaskComplete(selectedTask.id);
                      setSelectedTask(null);
                    }}
                  >
                    Complete Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTask(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}